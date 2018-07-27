---
author: Paddy Steed & Colin Simmons
date: "2018-07-18"
heroImage: /img/blog/profiling/before_keepalive.svg
title: Improving Concourse Performance
draft: true

heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

Since introducing CredHub into the [concourse-up](10) distribution, we became aware of some performance issues with it. We noticed if you had lots of resouces, the load on the ATC would be very high, and the system would feel very sluggish.

In concourse-up we colocate the Concourse ATC, CredHub, UAA, and some other components on the web VM. We tried scaling this VM to be a larger instance type but saw little to no improvement. We also tried scaling the RDS instance where CredHub stores its credentials to no avail. Even though vertical scaling didn't offer large speed improvement, our Concourse installation was still usable so we didn't worry about it too much.

## Performance Regression

This changed when Concourse v3.14.0 was released. This version contained a new feature which allowed Concourse to start even if CredHub was down. After upgrading we noticed that our Concourse was slower than ever and that both concourse-up and the upstream Concourse repo got bug reports about the slowness.

Concourse's usage of CredHub allows for credentials to be stored in either a team level or a pipeline level path with the latter taking precedence over the former. We knew that this implementation results in a surprising number of requests off of a small number of resources as Concourse will check both path possibilities for each secret.

For example, suppose you have a Concourse pipeline with the following resource:

```yaml
- name: concourse-up
  type: git
  source:
    uri: git@github.com:EngineerBetter/concourse-up.git
    branch: master
    private_key: ((github_private_key))
```

Every time Concourse checks for a new version of this resource (once per minute by default) it will query CredHub for secrets on:

* `/concourse/TEAM/PIPELINE/github_private_key` _and_ on
* `/concourse/TEAM/github_private_key`

## Investigation, Profiling

When we first set out trying to fix this problem in concourse-up we thought we would have to implement a cache for credential lookups. The hope was that this would help to relieve the pressure on CredHub as had been done for Vault. However, we know that because of [Amdahl's law][0], if we don't understand the problem before we start trying to solve it, we likely won't achieve the best improvements.

To start our investigation, we used concourse-up to deploy a fresh Concourse. We then wrote [a script][9] that would add a many secrets to CredHub, and then set several pipelines on Concourse that referenced those secrets. All of these pipelines were set to check for new versions of the resources every 10 seconds. Effectively the result was an instantly crawling Concourse. We ran `htop` on the Concourse's web VM and observed that CPU usage was 100% across both cores, and fairly even between ATC and CredHub.

We decided we needed to collect CPU profiles to figure out what was going on. Go has excellent tooling for profiling, and the ATC component takes advantage of it. There are two flags which can be used to expose an HTTP endpoint from which the go tool can obtain CPU samples. These endpoints are `--debug-bind-ip` and `--debug-bind-port`. By default the latter is set to `127.0.0.1` which means it cannot recieve traffic from outside the server. We set this flag to `0.0.0.0` and modified the security group for the ATC on AWS to allow our machine to access that endpoint. We were then able to use the [`go tool pprof`][1] command to collect CPU samples from the running ATC.

The results were very clear. *Most of the CPU time was spent parsing system CA cerficates*.

To better visualise and understand the sample data, we used a fantastic tool created by Uber called [go-torch][2]. Using Docker we generated an SVG flame graph of the ATC profile:

```sh
docker run uber/go-torch -u http://$ATC_EIP:8079 -p > flame.svg
```

The resulting graph was:
<embed style="width: 100%" src="/img/blog/profiling/before.svg" type="image/svg+xml" />

If you haven't encountered flame graphs before, Brendan Gregg wrote a [good primer to them][3].

## A Subtle Bug

This graph indicated that new CredHub clients were being constructed very frequently, and during the constructon of this client, a lot of work was done. The ATC only really needs to construct this client once, then it can reuse the client every time it needs to fetch credentials.

We noticed that the high CPU usage issue was [already being tracked][4] by the Concourse team, which had been introduced in an attempt to fix a [previous bug][5]. It also introduced another, more subtle bug.

Given that `lazyCredhub` is a struct, can you spot the bug in this method that will cause `lc.credhub` to _always_ be nil?

```golang
func (lc lazyCredhub) CredHub() (*credhub.CredHub, error) {
	if lc.credhub != nil {
		return lc.credhub, nil
	}

	var err error
	credhubOnce.Do(func() {
		credhubInstance, err = credhub.New(lc.url, lc.options...)
	})
	if err != nil {
		return nil, err
	}

	lc.credhub = credhubInstance

	return lc.credhub, nil
}
```

The method has a _value_ receiver, and not a _pointer_ receiver. Thus, on each method invocation a new copy of the struct was being created, and the method executed against that. When the method returns, our new instance pops off the stack and the `lazyCredhub` instance in the calling scope remains completely unchanged.

We submitted [a fix for this][6] on the ATC component. Then we patched our test Concourse environment and collected a new profile. This generated the following flame graph:

<embed style="width: 100%" src="/img/blog/profiling/before_keepalive.svg" type="image/svg+xml" />

As you can see this fix eliminated the parsing activities but a large proportion of time is being spent on TLS handshakes.

## A Subtle Performance Gotcha

Both Concourse and the CredHub CLI are written in Go where TLS operations are handled by `net/http`. This package uses a goroutine to perform TLS handshakes so we couldn't tell from the profiling data which functions were initiating them. However, since we only saw this behaviour when CredHub was used, we suspected that it was calls to obtain credentials which were initiating these handshakes.

HTTP 1.1 defaults to using persistent connections. This means that ATC should only be doing a TLS handshake once, then reusing the established session for many subsequent requests. This did not appear to be happening.

The following is a very common pattern for making HTTP requests in Go:

```go
resp, err := http.Get(myURL)
if err != nil {
  return err
}
defer resp.Body.Close()
var x X
err = json.NewDecoder(resp.Body).Decode(&x)
if err != nil {
  return err
}
```

The problem with this is that the `Decode(r)` method reads from `r` until the end of the first json value. **The `net/http` package will only reuse a HTTP connection if the response body has been read to completion**. In practice, that means you have to read from the body until you receive `io.EOF` from the read method. Even if you have read all the bytes on the wire, the `net/http` package doesn't know that and won't return the connection to the idle pool.

The following code solves this problem by draining the connection before closing it, allowing the connection to be reused.

```go
resp, err := http.Get(myURL)
if err != nil {
  return err
}
defer func() {
  io.Copy(ioutil.Discard, resp.Body)
  resp.Body.Close()
}()
var x X
err = json.NewDecoder(resp.Body).Decode(&x)
if err != nil {
  return err
}
```

With this in mind we took a look at the credhub-cli and found that it was falling into this trap. We [raised a PR][8] to fix it.

## A Dramatic Improvement

Once our fix was merged we patched our test Concourse again, collected a new profile, and generated the following flame graph:

<embed style="width: 100%" src="/img/blog/profiling/after_keepalive.svg" type="image/svg+xml" />

Now the ATC is free to spend all its processing power on ATC-related activities. It no longer has to contend with TLS handshakes and CredHub client creation.

As a real-world example we built a version of ATC containing all these fixes and patched the EngineerBetter Concourse installation with it. We saw an immediate drop in CPU utilisation on the web VM.

The cloudwatch graph for this change is below.

<img style="width: 100%" src="/img/blog/profiling/cloudwatch.png" />

[0]: https://en.wikipedia.org/wiki/Amdahl%27s_law
[1]: https://blog.golang.org/profiling-go-programs
[2]: https://github.com/uber/go-torch
[3]: http://www.brendangregg.com/flamegraphs.html
[4]: https://github.com/concourse/concourse/issues/2300
[5]: https://github.com/concourse/concourse/issues/2154
[6]: https://github.com/concourse/atc/pull/291
[7]: https://tools.ietf.org/html/rfc7230#section-6.3
[8]: https://github.com/cloudfoundry-incubator/credhub-cli/pull/45
[9]: https://gist.github.com/takeyourhatoff/3c8a83a0eab0b3630658531793a926eb
[10]: https://github.com/EngineerBetter/concourse-up

---
author: Paddy Steed & Colin Simmons
date: "2018-07-18"
heroImage: /img/blog/profiling/before_keepalive.svg
title: Profiling Distributed Systems
draft: true

heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

Since introducing Credhub into the concourse-up distribution, we became aware of some performance issues with it. We noticed if you had lots of resouces, the load on the ATC would be very high, and the system would feel very sluggish. Being distributed system engineers, we did what came naturally and scaled. In concourse-up we colocate the Concourse ATC, Credhub, UAA, and some other components on the web VM. We tried scaling this VM to be a larger instance type but saw little to no improvement. We also tried scaling the RDS instance where credhub stores its credentials to no avail. Even though vertical scaling didn't offer large speed improvement, our Concourse installation was still usable so we didn't worry about it too much.

This changed when Concourse v3.14.0 was released. This version contained a new feature which allowed the Concourse to start even if the Credhub was down. After upgrading we noticed that our Concourse was slower than ever and that both concourse-up and the upstream Concourse repo got bug reports about the slowness.

Concourse's implementation of Credhub allows for credentials to be stored in either a team level or a pipeline level path with the latter taking precedence over the former. We knew that this implementation results in a surprising number of requests off of a small number of resources as Concourse will check both path possibilities for each secret. For example, suppose you have a Concourse pipeline with the following resource:

```yaml
- name: concourse-up
  type: git
  source:
    uri: git@github.com:EngineerBetter/concourse-up.git
    branch: master
    private_key: ((github_private_key))
```

Every time Concourse checks for a new version of this resource (once per minute by default) it will query Credhub for secrets on `/concourse/TEAM/github_private_key` and on `/concourse/TEAM/PIPELINE/github_private_key`

When we first set out trying to fix this problem in concourse-up we though we would have to implement a cache to credential lookups. The hope was that this would help to relieve the pressure on Credhub as had been done for Vault. However, we know that becuase of [Amdahl's law][0], if we don't understand the problem before we start trying to solve it, we likely won't achieve the best improvements.

To start our investigation, we used concourse-up to deploy a fresh Concourse. We then wrote [a script][9] that would add a many secrets to Credhub then set several pipelines on Concourse that referenced those secrets. All of these pipelines were set to check for new versions of the resources every 10 seconds. Effectively the result was an instantly crawling Concourse. We ran `htop` on the Concourse's web VM and observed that cpu usage was 100% across both cores, and fairly even between ATC and Credhub.

We decided we needed to collect CPU profiles to figure out what was going on. Go has execellent tooling for profiling, and the ATC componet takes advantage of it. There are two flags which can be used to expose an HTTP endpoint from which the go tool can obtain CPU samples. These endpoints are `--debug-bind-ip` and `--debug-bind-port`. By default the latter is set to `127.0.0.1` which means it cannot recieve traffic from outside the server. We set this flag to `0.0.0.0` and modified the security group for the ATC on AWS to allow our machine to access that endpoint. We were then able to use the [`go tool pprof`][1] command to collect cpu samples from the running ATC.

The results were very clear. Most of the CPU time was spent parsing system CA cerficates.

To better visualise and understand the sample data, we used a fantastic tool created by Uber called [go-torch][2]. Using docker we generated an svg flame graph of the ATC profile.

```sh
docker run uber/go-torch -u http://$ATC_EIP:8079 -p > flame.svg
```

The resulting graph was:
<embed style="width: 100%" src="/img/blog/profiling/before.svg" type="image/svg+xml" />

If you haven't encountered flame graphs before, Brendan Gregg wrote a [good primer to them][3]

This graph indicated that new credhub clients were being constructed very frequently, and during the constructon of this client, a lot of work was done. The ATC only really need to construct this client once, then it can reuse the client every time it needs to fetch credentials.

We noticed that this issue was [already being tracked][4] by the Concourse team. The intitial solutions to this issue had inadvertantly reintroduced a [previous bug][5]. We submitted [a fix for this][6] on the ATC component. Then we patched our test Concourse environment and collected a new profile. This generated the following flame graph.

<embed style="width: 100%" src="/img/blog/profiling/before_keepalive.svg" type="image/svg+xml" />

As you can see this fix eliminated the parsing activities but a large proportion of time is being spent on TLS handshakes.

Both Concourse and the Credhub CLI are written in Go where TLS operations are handled by `net/http`. This package uses a goroutine to perform TLS handshakes so we couldn't tell from the profiling data which functions were initiating them. However, since we only saw this behaviour when credhub was used, we suspected that it was calls to obtain credentials which were initiating these handshakes.

HTTP 1.1 defaults to using persistent connections. This means that ATC should only be doing a TLS handshake once, then reusing the established session for many subsequent requests. This did not appear to be happening.

The following is a very common pattern for making http requests in Go:

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

The problem with this is that the `Decode(r)` method reads from `r` until the end of the first json value. The `net/http` package will only reuse a HTTP connection if the response body has been read to completion. In practice, that means you have to read from the body until you receive `io.EOF` from the read method. Even if you have read all the bytes on the wire, the `net/http` package doesn't know that and won't return the connection to the idle pool.

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

With this in mind we took a look at the credhub-cli and found that it was falling into this trap. We [raised a PR][8] to fix it. Once our fix was merged we patched our test Concourse again, collected a new profile, and generated the following flame graph:

<embed style="width: 100%" src="/img/blog/profiling/after_keepalive.svg" type="image/svg+xml" />

Now the ATC is free to spend all its processing power on ATC-related activities. It no longer has to contend with TLS handshakes and Credhub client creation.

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

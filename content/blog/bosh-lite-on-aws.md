---
author: Colin Simmons
date: "2020-07-10"
heroImage: /img/blog/yaml-fortune.png
title: BOSH-ception deploying a Bosh-lite director on AWS
heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

At EngineerBetter two things we love doing are writing tests and pipelining anything that moves. Recently when working with a client we found ourselves working on some custom BOSH releases. Naturally we started by creating a Concourse pipeline to create releases for us. I won't go through the steps of the pipeline here but we have [some](https://github.com/EngineerBetter/weavescope-boshrelease/blob/master/ci/pipeline.yml) [examples](https://github.com/EngineerBetter/prometheus-boshrelease/blob/master/ci/pipeline.yml) of other release pipelines on GitHub.

As part of the TDD process we wanted to add some comprehensive system tests to our pipeline to help us resolve some issues that the client had been seeing with the release in the past. Unfortunately this meant we would need to deploy the release candidate of our release as well as some other releases to a real BOSH director every time we ran the test job. We wanted a 'clean' director for each test to reduce flakiness of our tests so this raised an interesting question:

<section class="boxout">
<p>What is the best way to deploy a director from a Concourse task?</p>
</section>

### The First Attempt

The first thing we tried was running our task in the [main-bosh-docker image](https://github.com/chuanran/bosh/tree/master/ci/docker/main-bosh-docker). This let us run the following command at the start of our system test to start a director:

```sh
. start-bosh \
  -o /usr/local/bosh-deployment/uaa.yml \
  -o /usr/local/bosh-deployment/credhub.yml
source /tmp/local-bosh/director/env
```

<section class="boxout">
  <h4>This technically worked but it had some drawbacks:</h4>
  <ul>
    <li>Running a whole director, several deployments, and system tests was overloading the Concourse workers especially when our pipeline ran multiple times in a row</li>
    <li>The director was quite slow when it came to compiling and running tasks</li>
    <li>Deploying the director at the start of every test then setting up the test meant that setup for 30+ minutes of tests took over an hour</li>
  </ul>
</section>

There had to be another way...

### Moving BOSH back out of the container

<section class="boxout">
  <h4>To summarise, our requirements at this point were:</h4>
  <ul>
    <li>have a director with nothing deployed to it at the start of every system test task</li>
    <li>not have to wait ages for things to deploy before starting the tests</li>
    <li>not to overload the Concourse workers</li>
    <li>not to create loads more VMs on our client's AWS account</li>
  </ul>
</section>

In order to avoid overloading the Concourse workers we will need to deploy the director as a separate VM. We can use [bosh-lite](https://bosh.io/docs/bosh-lite/) to create a director which will deploy containers on itself rather than additional VMs. This works by using the [Warden CPI](https://github.com/cppforlife/bosh-warden-cpi-release).

Most of the time bosh-lite directors are deployed locally onto Virtualbox but it can also be deployed to a different IaaS by swapping out the `cpi.yml` opsfile from [bosh-deployment](https://github.com/cloudfoundry/bosh-deployment) when we deploy. Our client ran most of their development workloads on AWS so we opted for deploying our new director there.

Something else to note is that there are broadly two ways to deploy things with BOSH: `deploy` and `create-env`. The former uses a director to deploy and manage the deployment while the latter creates a standalone deployment that is not managed by a director. BOSH directors are technically bosh deployments themselves but they are almost universally deployed using `create-env`.

For our purpose a standalone director VM is unfavourable for two reasons. Firstly it is by definition not supervised by anything and thus won't be resurrected if it breaks. Secondly, `deploy` is easier to manage from a Concourse pipeline thanks in part to the [bosh deployment resource](https://github.com/cloudfoundry/bosh-deployment-resource).

While [it has been done before](https://starkandwayne.com/blog/resurrecting-bosh-with-binary-boshes/), deploying a director from another director is not a common occurrence. We couldn't find this process documented anywhere using modern BOSH tooling. We realised that it would be really convenient if we could deploy a bosh-lite director using the same director than deployed the Concourse we were using for testing.

### Any problem can be solved with enough ops files

The difference between the `create-env` and `deploy` commands is the schema of the manifests consumed by each of them. When running `bosh create-env` you must provide a [v1 manifest](https://bosh.io/docs/deployment-manifest/) which contains all the networking and CPI information for the deployment. In the transition to [the v2 manifest](https://bosh.io/docs/manifest-v2/) the networking/IaaS considerations were split out into the cloud config. `bosh deploy` requires a v2 manifest. This means our problem is now to convert [`bosh.yml`](https://github.com/cloudfoundry/bosh-deployment/blob/master/bosh.yml) from v1 to v2.

Rather than taking the file and modifying it directly, we prefer applying adjustments using [ops files](https://bosh.io/docs/cli-ops-files/) so that we can pick up updates to bosh-deployment without facing massive merge conflicts.

The key changes are:

- allow for a custom deployment name rather than having it hardcoded to `bosh`
- remove the manifest sections that no longer exist in v2
- add stemcell and update blocks to the manifest
- remove the disable-agent job to enable the agent (🤯)
- define vm details and networks that exist in parent director's cloud config

After defining these changes in ops files it was easy to write a pipeline using the bosh-deployment-resource to deploy our new director for us.

In our case, we had to make some additional changes because our director wasn't able to generate variables. You can see all our ops files and our deployment pipeline in https://github.com/EngineerBetter/bosh-lite-on-aws

<figure>
  <img src="/img/blog/bosh-ception.jpg" class="fit image">
  <figcaption>What is the plural of Bosh anyway?</figcaption>
</figure>

### Using the new Director

Since the bosh-lite director has been deployed by Concourse, it is really easy to target it from a different pipeline on the same Concourse team as CredHub variables will be available.

In order to communicate with the new director the following environment variables are needed:

- `BOSH_ENVIRONMENT`: provided when deploying director
- `BOSH_CLIENT`: admin
- `BOSH_CLIENT_SECRET`: provided or generated when deploying director (as `admin_password`)
- `BOSH_CA_CERT`: provided or generated when deploying director

For `bosh ssh` to work you will also need the director's SSH key which is provided or generated at deployment time.

Then set `export BOSH_ALL_PROXY=ssh+socks5://jumpbox@${BOSH_ENVIRONMENT}:22?private-key=/path/to/private/key.pem`

Note that unless you gave your bosh-lite director an external IP, you will only be able to connect from a VM on the same private network. We considered this to be a nice security side-effect since we only intended to use this director from a Concourse that is managed by the same director.

Even though we are exporting `BOSH_ALL_PROXY` to allow `bosh ssh` to connect to deployments on the bosh-lite director, commands like `curl` will also need to connect through a proxy. One way to set this up is by starting a background proxy then setting the `ALL_PROXY` env var.

```sh
ssh -fN -D 9090 -o "StrictHostKeyChecking=no" jumpbox@${BOSH_ENVIRONMENT} -i ${PWD}/key.pem
export ALL_PROXY=socks5h://localhost:9090
```

The final consideration is that now this director is separate from the Concourse task, it will only be in a clean state at the start of a new task if we run something to clean it up. We opted to add some cleanup trap statements to each of our task scripts. For example:

As an example you could put the following at the start of a script:

```sh
function cleanup() {
  set +e
  bosh -d some-test-deployment delete-deployment -n
  bosh clean-up --all
  set -e
}

function cleanup_with_exit()
{
  rv=$?
  cleanup
  # stop the ALL_PROXY tunnel
  pkill -f 'ssh.*-f' || true
  exit $rv
}

trap cleanup_with_exit EXIT

cleanup
```

### Next steps

While this setup drastically reduced the build times of our system tests (about an hour saved per build) it still isn't perfect. In particular, relying on tasks to clean themselves up fully is a fragile assumption. It would be nice if the director could be recreated between each build. It would also be useful if this bosh-lite director could be used by multiple different pipelines at the same time.

Something we've talked about is having a pool of these bosh-lite directors running on AWS then allowing pipeline jobs to "check out" a director in order to run a task. Then upon release the director could be recreated before being returned to the pool. If we end up implementing this in the future I'll be sure to write a follow-up blog post.

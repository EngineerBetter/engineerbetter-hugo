---
author: Peter Ellis Jones
date: "2016-12-14"
heroImage: /img/blog/continuous-delivery-ice-cream-factory.jpg
title:  Continuously Deploying Pivotal Cloud Foundry
---

EngineerBetter recently helped a large financial organisation **fully automate** their Pivotal Cloud Foundry deployments, taking a manual process that took a whole team more than a week, and replacing it with an **hands-off** continuous depoyment pipeline that **took mere hours**, often **overnight whilst the team slept**. We didn't just automate the deployment of their PCF: we **automated** the creation of their **cloud infrastructure**; deployment of **upgrades**; installation of **security updates**; and all with **full testing**.

Cloud Foundry enables continuous delivery for developers. **EngineerBetter bring continuous delivery to platform operators** and traditional IT teams. Here's how.

<!--more-->

## Traditional Ops

The customer has a lot of experience with Cloud Foundry and some very large deployments. However they were using a traditional, release-oriented approach when it came to deploying and maintaining Cloud Foundry. When a new PCF release came out the team would deploy it to a staging environment, test it, and "release" it to separate ops teams managing prod environments around the world. The upgrade would take around a week, and tied up nearly all of the team's time while it was being done.

PCF gets updated often. From mid-October to mid-November there averaged an **update every 4 days**. This caused a lot of headaches for the team as updates would get backed-up — **new versions were coming out faster than the team could deploy, test, and release them** leaving prod environments exposed to CVEs for weeks (when this should be measured in hours); a lot of the same manual work was repeated for every upgrade; And they were left with no time to test and deploy new features that development teams were asking them for.

Cloud Foundry allows app developers to deploy and scale apps seamlessly, so what if we could deploy Cloud Foundry just as easily? What if we could destroy and recreate any number of identically-configured Cloud Foundries at will? What if we had a pipeline that automatically upgraded and tested new versions? Thanks to Pivotal and some forward-thinking supporters within the financial organisation, we got the opportunity to do just that.

## Continuously Deploying Cloud Foundry

If you're deploying Pivotal Cloud Foundry from scratch you'll need to do the following six steps:

- Download the latest version of PCF - you'll need [Pivotal Elastic Runtime (ERT)](https://network.pivotal.io/products/elastic-runtime/) and [Ops Manager](https://network.pivotal.io/products/ops-manager)
- [Set up your IaaS](https://docs.pivotal.io/pivotalcf/1-8/installing/) (VPCs, S3 buckets etc if you're on AWS; clusters, resource pools, and datastores on vSphere) and [Deploy an Ops Manager VM](https://docs.pivotal.io/pivotalcf/1-8/customizing/cloudform-om-deploy.html)
- [Configure the Ops Manager credentials](https://docs.pivotal.io/pivotalcf/1-8/customizing/cloudform-om-config.html#access-om)
- [Configure and deploy a BOSH Director using Ops Manager](https://docs.pivotal.io/pivotalcf/1-8/customizing/cloudform-om-config.html#access-om)
- [Upload ERT to the Ops Manager](https://docs.pivotal.io/pivotalcf/1-8/customizing/add-delete.html)
- [Configure and deploy ERT via the Ops Manager](https://docs.pivotal.io/pivotalcf/1-8/customizing/cloudform-er-config.html)

If you make no mistakes, this takes a couple of hours to half a day to complete. Once it's all done, you'll at least want to run the Cloud Foundry [smoke tests](https://github.com/cloudfoundry/cf-smoke-tests), and possibly more intensive testing depending on your use-case.

Fortunately all these steps can be automated. Unfortunately, some are easier than others. To help with the automation we chose [Concourse](https://concourse.ci) as our CI server. Concourse has three features that make it a great CI server:

- **Pipeline-first**. In Concourse you create pipelines composed of multiple jobs composed of multiple tasks. First-class support for pipelines means it's easy to model complex dependencies between jobs. Deploying Cloud Foundry is definitely a pipeline, not a job.
- **Isolated builds**. All tasks run on [OCI images](https://www.opencontainers.org/) (read: Docker images) using the Garden container manager. Parameters are passed in as environment variables. This ensures builds don't accidentally leave state around that can disrupt other builds (I'm looking at you, Jenkins)
- **Declarative configuration**. Pipeline configuration is done via YAML files which can be checked into source control, and easily re-applied. This avoids [snowflake](http://martinfowler.com/bliki/SnowflakeServer.html) build servers that are expensive or impossible to re-build (still looking at you, Jenkins)

Using Concourse we set about creating our six-step pipeline:

### 1) Getting new versions of PCF

Concourse has a simple extension system that let's anyone define new "resources". A resource can be anything that has new versions, like a git repo or a build artifact. One open-source resource is the [pivnet-resource](https://ci.concourse.ci/teams/main/pipelines/main?groups=develop). This downloads new versions of PCF components from network.pivotal.io, and lets you trigger new builds.

### 2) Preparing the IaaS and Deploying an Ops Manager VM

The IaaSs we used all had pretty good APIs and tooling. If you're on AWS, this part will be creating VPCs and networking infrastructure via CloudFormation. On vSphere this is setting up clusters and resource pools. In a continuous delivery pipeline, it's important that every step is [idempotent](https://en.wikipedia.org/wiki/Idempotence#Examples) — ie, the job must result in the same state being applied to the system independent of whether it's the first run or the hundredth. CloudFormation does a good job of converging state when a script gets updated but there are some gotchas — for example it's hard to get the current status of a CloudFormation stack. The CloudFormation stack "Stack Status" property actually tells you the status of *the previous operation on the stack* rather than the stack itself (eg 'CREATE_COMPLETE' rather than 'ACTIVE'). Thankfully with some a few lines of Bash we were able to ensure this step was idempotent.

### 3) Configure the Ops Manager credentials

Ops Manager is a GUI-based application with a limited API (we deployed version 1.7 — later versions have a better API). We used [opsmgr gem](https://rubygems.org/gems/opsmgr) to automate it — this gem is a command line tool uses the API where possible, and Capybara (browser automation) otherwise. Getting Capybara to run in Docker can be tricky, but the short of it is you need [XFVB](https://en.wikipedia.org/wiki/Xvfb) for a virtual display server, and run all your scripts within *xvfb-run*.

```
xfvb-run bundle exec rake opsmgr...
```

### 4) Configure and deploy a BOSH Director using Ops Manager

The *opsmgr* gem lets you configure the Ops Manager BOSH Director with a YAML file. Since all configuration is passed from Concourse to the build via environment variables, one pattern we ended up using a lot is templating YAML files from environment variables. Since we had ruby as a dependency anyway, we leveraged [ERB](http://www.stuartellis.name/articles/erb/) templates for this, and ended up with a lot of files like this:

```yaml
ops_manager:
  url: <%= ENV.fetch('OPSMAN_URL') %>
  username: <%= ENV.fetch('OPSMAN_USERNAME') %>
  password: <%= ENV.fetch('OPSMAN_PASSWORD') %>
```

ERB is part of the ruby standard library and has it's own CLI command so writing a template such as the one above is as simple as:

```
erb template.yml.erb > output.yml
```

### 5) Upload ERT to the Ops Manager

The *opsmgr* handles this for us nicely, but we added some Bash wrangling to avoid re-uploading tiles if a version was already uploaded. One problem we continually faced was long feedback cycles so we optimised where possible to reduce build times.

### 6) Configure and deploy ERT via the Ops Manager

The *opsmgr* gem exposed commands to get and update an *installation_settings* YAML file. This is a huge YAML that contains all the configuration of all the tiles that will be deployed. If you're familiar with [Bosh manifests](https://bosh.io/docs/deployment-manifest.html) the *installation_settings* file is a like a prototype bosh manifest for all products to be deployed. Although 1.8 exposes better methods for configuring products, unfortunately with Ops Manager 1.7 we had to use the following method:

- Download the current *installation_settings* using the *opsmgr* gem.
- Manipulate the YAML to apply the configuration for the ERT tile
- Re-upload the *installation_settings* file using the *opsmgr* gem.

*installation_settings* is completely undocumented, so we had to use trial and error to work out which fields in *installation_settings* corresponded to which fields in the Ops Manager GUI that we wanted to modify. One thing that helped us was [colordiff](http://www.colordiff.org/) to easily visualise changes to the file. Another was to code as defensively as possible during the YAML-manipulation phase — if the file did not look exactly how we expected it to look, exit with a failure (otherwise known as "use [fetch](https://ruby-doc.org/core-2.2.0/Hash.html#method-i-fetch) everywhere")

Since *installation_settings* is the configuration for *all* products that Ops Manager is deploying, we also had to make use of Concourse [serial groups](https://concourse.ci/configuring-jobs.html#serial_groups) later on when we were deploying multiple tiles, to ensure that we weren't overwriting the global configuration in two separate CI jobs.

## Results

Our code is not pretty. We've used some hacky methods to glue together tools that weren't really designed to work together. However what we do have is a pipeline that continuously deploys Cloud Foundry to multiple foundations on multiple IaaSs. Something that would take days manually following a run-book, now **happens overnight while the team is sleeping**. CVE exposure time can be measured in hours not weeks. And the ugly code we do have are small scripts that can be taken out back individually and euthanised as and when better methods become available (like when we upgrade to 1.8).


### Testing

Since we're now continuously upgrading Cloud Foundry, when we add features likes related to security or availability, it's not enough to accept those features on the current version. We need to write tests to assert the functionality so we can catch regressions. One of our requirements is that we can withstand loss of an availability zone (AZ). So after each deployment we run a test that:

1. 1) Destroys all VMs in an AZ
1. 2) Checks the [smoke tests](https://github.com/cloudfoundry/cf-smoke-tests) still pass
1. 3) Re-creates the VMs

Replacing manual tests with automated tests does take a while (especially for infrastructure), but you quickly build up the tooling to make each subsequent test easier to implement.

### Small cost of change

Our Cloud Foundry instances are now very much [cattle](http://www.theregister.co.uk/2013/03/18/servers_pets_or_cattle_cern/), not the pets they once were. This means we can easily destroy and replicate them — we can spin up new instances to spike potential features, and we can destroy dev environments at the end of the day to reduce costs. And when upgrades fail, it's much easier to diagnose and fix, because we're not paranoid about breaking things (they can always be reproduced).


---
author: Peter Ellis Jones
date: "2017-05-03"
heroImage: /img/blog/bessie_coleman.jpg
title:  Introducing Concourse-Up - Deploy Concourse CI in a Single Command
---

<figure>
    <figcaption style="font-size: 8pt">
    <a href="https://en.wikipedia.org/wiki/Bessie_Coleman">Bessie Coleman, c.1922</a></figcaption>
</figure>

It's no secret that we love [Concourse](https://concourse.ci). Concourse is a new kind of continuous integration server that treats pipelines as a first class citizen. It uses declarative config and a minimal UI to ensure that your builds can always be repeated, and your CI server always recoverable.

Concourse is notoriously easy to get started with, but as soon as you want your team to use it in production you've previously had to learn [BOSH](https://bosh.io) (which is notoriously hard to get started with). Teams who just want great CI shouldn't need to think about this, so we built a tool called [Concourse-Up](https://github.com/engineerbetter/concourse-up) to get your cluster up and keep it running, using a single command.
<!--more-->
The motivation for creating this tool began with our own needs, because we needed an easy button for setting up CI on new customer engagements. We'd also met many people who'd had a great intro to Concourse, but were put off by the complexity of setting up BOSH for a [production environment](http://concourse.ci/clusters-with-bosh.html) in the cloud. Recently, while chatting with folks at the [Concourse London User Group](https://www.meetup.com/Concourse-London-User-Group/), the feedback echoed what we'd heard elsewhere: "Concourse is too hard to deploy".

Setting up Concourse locally is easy enough using [Vagrant](https://www.vagrantup.com) or [Docker Compose](https://docs.docker.com/compose/). The problem is when you're at the next stage of adoption. Whilst BOSH has many features that puppet, chef, ansible and others lack, taking the time to learn it is an investment not everyone wants to make. We knew that [BOSH Bootloader](https://github.com/cloudfoundry/bosh-bootloader) had simplified the process, but we wanted a user experience that avoided any manual steps at all.

[Concourse-Up](https://github.com/engineerbetter/concourse-up) is a fire-and-forget way of deploying a Concourse cluster on AWS using Terraform and BOSH. Simply choose a name for your concourse, for example "chimichanga", and deploy with:

```
$ concourse-up deploy chimichanga
```

<img alt="Concourse-Up Screenshot" src="http://i.imgur.com/gZPuUW5.png" class="image fit">

Go fetch yourself a coffee, and about 12 minutes later you will have a fully functioning Concourse. You'll have a BOSH director looking after Concourse VMs in a private network and repairing them if anything goes wrong; a load balancer with a self-signed or user-provided TLS certificate; sensible security groups, and a custom domain if you wish.

Concourse-Up also allows you to scale your worker nodes either horizontally or vertically; just run `concourse-up deploy` using the `--workers` and `--worker-size` options.

Want to upgrade your Concourse? We have a [Concourse pipeline](https://ci.engineerbetter.com/teams/main/pipelines/concourse-up) (deployed by Concourse-Up!) that watches [bosh.io](https://bosh.io) for release and stemcell updates. When new versions are detected we automatically compile, test and release Concourse-Up with the latest BOSH releases and it publish to Github. Get yourself the [latest release](https://github.com/EngineerBetter/concourse-up/releases) of Concourse-Up, simply run `concourse-up deploy` again and it will update your Concourse in-place.

Of course, there is no need for things like scaling and upgrades to be manual-only operations. Our intention for `concourse-up` is for it to preload pipelines that enable a Concourse-Up cluster to automatically scale, patch and upgrade itself.

If you have any thoughts, feedback or feature requests for Concourse-Up, please let us know what you think. Equally, if you'd like to have a chat about achieving this level of operability with your other BOSH-deployed services, such as your Cloud Foundry runtime or data services, we'd be happy to explain more. Drop us a line at [@engineerbetter](https://twitter.com/engineerbetter) or [contact@engineerbetter.com](mailto:contact@engineerbetter.com).

---
author: Daniel Jones
date: "2021-03-03"
heroImage: /img/blog/buzzed-butler.png
title: Concourse is Awesome
draft: true
heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

[Concourse](https://concourse-ci.org) is a _continuous thing do-er_ that happens to be rather good at CI/CD for big, complicated systems. At EngineerBetter we're rather fond of it, and we wanted to explain why.

## Concourse is 'Pro' CI/CD

Concourse is great for integrating lots of things, checking that they work together, and then progressing to something else like a release or promotion job. It has great fan-out, fan-in semantics.

Many folks have created Concourse-based 'CI-as-a-Service' solutions at their organisations, building pipelined solutions so that app teams don't need to worry about writing their own. This pattern is particularly popular at regulated enterprises, who need to ensure that the path to production is secure.

We even worked with one customer who offered 'CI-as-a-Service' to their platform - external collaborators didn't ship plugins, they provided Git repos and the platform ingested third-party code via Concourse pipelines.

Concourse is great for big, complex, important things. Y'know, like the massive Kubernetes platforms and microservice architectures that everyone's building these days.

The following **_enormous_** pipeline is that of RabbitMQ. It's so big that I need to tell you that the post continues after it. It's kinda like the opening scene of Star Wars.

<a href="https://ci.rabbitmq.com/teams/main/pipelines/server-release:v3.8.x?group=re%3Afinal&group=re%3Arc&group=re%3Abeta&group=re%3Aalpha&group=(qa%3Aclients)&group=qa%3Aupgrades&group=qa%3Apkg&group=qa%3Aplugins&group=qa%3Abroker" target="_blank">
  <figure>
    <img class="fit image" src="/img/blog/concourse-rabbit.png" alt="Screenshot of a RabbitMQ Concourse pipeline" />
    <figcaption>This _enormous_ pipeline belongs to the RabbitMQ team</figcaption>
  </figure>
</a>

So, why do people choose Concourse for big, important projects?

### Containerised

Everything runs in containers. Everything. Without exception.

There is no way that your builds can fail due to a polluted workspace, or environment variables bleeding from one job to another (I'm looking at you, Jenkins).

### Pipelines

The primary unit of Concourse is the [pipeline](https://concourse-ci.org/pipelines.html). It was built around pipelines from the very beginning, and so doesn't have 'tacked on' pipeline support like some legacy CI/CD servers (I'm looking at you again, Jenkins).

<a href="https://ci.engineerbetter.com/teams/main/pipelines/concourse-tasks" target="_blank">
  <figure>
    <img class="fit image" src="/img/blog/concourse-tasks-pipeline.png" alt="Screenshot of a Concourse pipeline" />
    <figcaption>Whenever a Git repo changes, this pipeline sets itself with the latest config, tests the code, bumps a semver, and then makes GitHub release. Any failures trigger Slack notifications.</figcaption>
  </figure>
</a>

As we'll see below, Concourse has an internal event-driven model. Pipelines make sense of the ordering of events and the dependencies between them, creating a human-intelligible view of what's _actually_ going to happen. There are enough constraints in the event-driven model to avoid emergent behaviour.

### Resources: Event-driven

Concourse models the world in [resources](https://concourse-ci.org/resources.html).

Resources represent things in the outside world that can change. Those changes must have a way of uniquely identifying themselves, so that Concourse can tell if a version is new. Pipeline authors will likely configure that any new versions should trigger a set of jobs, like testing and deployment.

Resources mean that as an engineer, I don't have to write my own code to work out if an object in an S3 bucket is new.

### Resources: Functional

Because resources encapsulate interactions with outside world, it becomes much easier to write functional (in the mathematical sense) pipelines - provide the same inputs, get the same outputs, with no side-effects.

Providing you don't purposefully add side-effects into your [jobs](https://concourse-ci.org/jobs.html), you can re-run the same job multiple times with complete confidence. Everything that goes into your pipeline came via a resource, which enforces that it is versioned.

You can also execute [tasks (steps within a job)](https://concourse-ci.org/tasks.html) in isolation, knowing that you won't break anything. Which brings us on to...

### Executing Tasks using Local Inputs

The `fly execute` command allows you to run tasks _on_ the Concourse workers, using either resources from the outside world, or local copies.

Want to run the system tests for your local changes, without pulling down a bazillion test credentials? Don't want to do a 'speculative commit and push' just so you can see if you changes would pass CI? Run `fly execute` and use your local, uncommitted copy of the code.

It's not just EngineerBetter that think that `fly execute` is ace - Principal Software Engineer at Sky [Andrew Merrell wrote a post singing its praises](https://medium.com/@andrew_merrell/concourses-fly-execute-is-a-hidden-gem-5f4b54ffb249) too.

### Easy Access to Failed Tasks

Concourse offers the [`fly intercept` command to get you a terminal session directly into the container](https://concourse-ci.org/builds.html#fly-intercept) for a build, so you can debug it easily. You can even copy and paste the URL from the web UI into the terminal, so you don't need to type out build numbers.

No faffing about with `kubectl` here.

### Declarative Config, All The Time

Concourse pipelines are defined in code, meaning that, unless you're a deranged loon, all changes will be version-controlled.

Concourse simply doesn't allow you to make behavioural changes through the UI (with the exception of triggers/pausing things, and pinning old versions of resources). You don't need to worry about colleagues re-configuring jobs in some UI without an audit trail.

You can also do some cool stuff with pipeline-generation:

* [More from Andrew Merrell at Sky on creating pipelines dynamically](https://medium.com/@andrew_merrell/automating-pipeline-creation-on-concourse-6205b0a92724)
* [SAP's Python pipeline DSL](https://github.com/SAP/pipeline-dsl)
* [SpringerNature's Halfpipe](https://github.com/springernature/halfpipe)
* [A Ruby DSL](https://github.com/jhmcstanton/rudder/)

### Images, Not Plugins

Concourse doesn't have plug-ins. Resources are shipped as container images, and tasks can specify their own image to run in. That's it.

No asking the CI admin to install a plugin for you. No waking up to find that Jenkins has automatically updated its plugins overnight, and introduced a breaking change. No plugins that depend on plugins that depend on plugins.

Your pipelines are utterly portable - as long as those images are publicly available, your pipeline can run anywhere.

### Postgres

Yep, Concourse is backed by a relational database. That means that it can hold thousands if not millions of build histories without falling over. The data layer of Concourse will scale better than solutions relying on etcd for persistence, such as Argo.

### Not Just For Kubernetes

Concourse runs anywhere. It is [shipped as a single binary](https://github.com/concourse/concourse/releases/latest) for each platform (including Windows!), as well as container images. There's an [official Helm chart for Kubernauts](https://github.com/concourse/concourse-chart), but Concourse doesn't force you to use Kubernetes, nor does it assume that everything you want to do is in Kubernetes.

There are plenty of good reasons to run CI/CD outside of Kubernetes. For instance, how do you pipeline the provisioning of your Kubernetes clusters in the first place? What if you're in an enterprise without access to a Kubernetes cluster? What if your pipeline is responsible for bootstrapping entire environments?

### Cloud Native: Deployment

Concourse itself is configured entirely via environment variables or startup flags. There are no manual procedures or configuration processes.

All Concourse components execute from the same, single native binary. No JVMs, no pre-requisites, just execute the binary.

### Cloud Native: Bring Your Own Worker

Concourse workers are the machines that perform the, err, workloads. They register with the central scheduler, not the other way 'round, and communicate securely via SSH tunnels.

Because workers add themselves to a cluster, this makes them easy to horizontally autoscale.

### Visualising the Value Stream

Because Concourse is pipeline-driven, and because it's good at integrating many assets, it's a great way of visualising _everything that goes into your product_.

### Inverse Conway's Law

By testing, integrating and deploying many things in a single pipeline, we can drive collaboration and a DevOps mindset.

EngineerBetter have worked with customers to form cross-functional teams, owning deployment of complex SaaS products end-to-end. For one customer in particular, this was the first time the entire value stream of the product had been codified. For the very first time there was an unambiguous, executable, reproducible path to production that was under version control.

## Background Images

How could you not love this happy Beluga?

<figure>
  <a href="/img/blog/concourse-pipeline-bg.png" target="_blank"><img class="fit image" src="/img/blog/concourse-pipeline-bg.png" alt="Concourse pipeline with a background image" /></a>
  <figcaption>Images can be animated too, for extra memetasticness</figcaption>
</figure>

### Who Shouldn't Use Concourse?

You shouldn't use Concourse if you:

* are doing things in isolation (like a single app), that aren't really pipelines
* prefer GUIs to CI-as-code
* want to execute unreproducible builds (I'm looking at you again Jenkins, and the [Build Parameters plugin](https://plugins.jenkins.io/build-with-parameters/))
* aren't able to create or use container images

If you use PR-based workflows, Concourse can handle that, and [there are future improvements to the UX](https://github.com/concourse/concourse#the-road-to-concourse-v10) to make it easier.

## How Can I Find Out More?

EngineerBetter will be making a few things in the near future to make Concourse easier to try out. In the mean time, you should check out the official [Concourse Quick Start](https://concourse-ci.org/quick-start.html) which uses Docker Compose, or the [Concourse Helm Chart](https://github.com/concourse/concourse-chart).

You could also [register your interest for EngineerBetter's hosted Concourse offering](https://docs.beluga.engineerbetter.com/beluga/), currently in private beta.

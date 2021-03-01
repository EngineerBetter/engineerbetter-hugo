---
author: Daniel Jones
date: "2021-03-01"
heroImage: /img/blog/buzzed-butler.png
title: Concourse is Awesome
draft: true
heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

[Concourse](https://concourse-ci.org) is a _continuous thing do-er_ that happens to be rather good at CI/CD for big, complicated systems. At EngineerBetter we're rather fond of it, and we wanted to explain why.

## Pipelines

The primary unit of Concourse is the pipeline. It was built around pipelines from the very beginning, and so doesn't have 'tacked on' pipeline support like some legacy CI/CD servers (I'm looking at you, Jenkins).

## Resources: Event-driven

Concourse models the world in pipelines and resources.

Resources represent things in the outside world that can change. Those changes must have a way of uniquely identifying themselves, so that Concourse can tell if a version is new. Pipeline authors will likely configure that any new versions should trigger a set of jobs, like testing and deployment.

Resources mean that as an engineer, I don't have to write my own code to work out if an object in an S3 bucket is new.

## Resources: Functional

Because resources encapsulate interactions with outside world, it becomes much easier to write functional (in the mathematical sense) pipelines - provide the same inputs, get the same outputs, with no side-effects.

Providing you don't purposefully add side-effects into your jobs, you can re-run the same job multiple times with complete confidence.

You can also execute tasks (steps within a job) in isolation, knowing that you won't break anything. Which brings us on to...

## Executing Tasks using Local Inputs

The `fly execute` command allows you to run tasks _on_ the Concourse workers, using either resources from the outside world, or local copies.

Want to run the system tests for your local changes, without pulling down a bazillion test credentials? Don't want to do a 'speculative commit and push' just so you can see if you changes would pass CI? Run `fly execute` and use your local, uncommitted copy of the code.

## Easy Access to Failed Tasks

Concourse offers the `fly intercept` command to get you a terminal session directly into the container for a failed build, so you can debug it easily. No faffing about with `kubectl` here.

## Declarative Config, All The Time

Concourse pipelines are defined in code, meaning that, unless you're deranged, all changes will be version-controlled.

Concourse simply doesn't allow you to make behavioural changes through the UI (with the exception of triggers/pausing things, and pinning old versions of resources). You don't need to worry about colleagues re-configuring jobs without an audit trail in some UI.

## Images, Not Plugins

Concourse doesn't have plug-ins. Resources are shipped as container images, and tasks can specify their own image to run in. That's it.

No asking the CI admin to install a plugin for you. No waking up to find that Jenkins has automatically updated its plugins overnight, and introduced a breaking change. No plugins that depend on plugins that depend on plugins.

Your pipelines are utterly portable - as long as those images are publicly available, your pipeline can run anywhere.

## Postgres

Yep, Concourse is backed by a relational database. That means that it can hold thousands if not millions of build histories without falling over. The data layer of Concourse will scale better than solutions relying on etcd for persistence, such as Argo.

## Not Just For Hipsters

Concourse runs anywhere. It is shipped as simple cross-platform binaries (including Windows!), as well as container images. There's an official Helm chart for Kubernauts, but Concourse doesn't _force_ you to use Kubernetes.

There are plenty of good reasons to run CI/CD outside of Kubernetes. For instance, how do you pipeline the provisioning of your Kubernetes clusters in the first place? What if you're in an enterprise without access to a Kubernetes cluster?

## Bring Your Own Worker

Concourse workers are the machines that perform the, err, workloads. They register with the central scheduler, not the other way 'round.

Because workers add themselves to a cluster, this makes them easy to horizontally autoscale.

## Visualising the Value Stream

Because Concourse is pipeline-driven, and because it's good at integrating many assets, it's a great way of visualising _everything that goes into your product_.

## Inverse Conway's Law

By testing, integrating and deploying many things in a single pipeline, we can drive collaboration and a DevOps mindset.

EngineerBetter have worked with customers to form cross-functional teams, owning deployment of complex SaaS products end-to-end. For one customer in particular, this was the first time the entire value stream of the product had been codified. For the very first time there was an unambiguous, executable, reproducible path to production that was under version control.

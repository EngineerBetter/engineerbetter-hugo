---
author: Daniel Jones
date: "2015-05-15"
heroImage: /img/blog/hyattregencypool.jpg
title: Cloud Foundry Summit 2015 Themes

heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

I'm back from the excellent [Cloud Foundry Summit 2015](http://cfsummit.com), and have been back in the country long enough to catch up on some sleep. That picture up there is the poolside area where I may have sipped a few pints of Californian IPA between presentations.

There were plenty of interesting talks about specific subjects (CC V3 API, Service Broker API updates), but I wanted to recount some common topics that cropped up.
<!--more-->
## Diversity

I'd like to stick this one in early. It was great to see diversity in the community being taken seriously. As Sam Ramji pointed out in a breakout session most technology movements also have philosophical believes driving them, and that the Cloud Foundry Foundation is new and so can determine its own destiny. As a middle-class white male I'm keen to listen to how folks like me can make things better.

## BOSH Apologists

A running theme of conversations I had with BOSH users was acknowledging the poor usability and accessibility of BOSH as a tool. Practically every mention of BOSH I witnessed in talks was prepended with "*it might not be easy to get started with, but it's really worth getting up to speed with.*" It's certainly a sentiment I agree with, and it's encouraging to see that this is an issue the community recognises.

<img class="image right" src="/img/fulls/bosh-clam.png" />A smoking gun of the poor user experience BOSH provides is probably the proliferation of 'usability band-aids' available, almost exclusively developed by DrNic. What do we have now? [BOSH Lite](https://github.com/cloudfoundry/bosh-lite) (not to be confused with [Light BOSH](http://boshartifacts.cloudfoundry.org/file_collections?type=stemcells)), [BOSH Micro](https://github.com/cloudfoundry/bosh/tree/master/bosh_cli_plugin_micro), [Nise BOSH](https://github.com/nttlabs/nise_bosh), [BOSH Init](https://github.com/cloudfoundry/bosh-init), [BOSH Gen](https://github.com/cloudfoundry-community/bosh-gen), [BOSH Workspace](https://github.com/cloudfoundry-incubator/bosh-workspace)... Any I missed? These are clearly the sign of an active community, but also a symptom of an underlying problem.

One wonders how BOSH uptake might increase if the tool had a better UX, better and non-overlapping terminology, and a sexy website like that of [Lattice](http://lattice.io) or [Terraform](http://terraform.io).

## Concourse

Pivotal seem to be continuing to adopt their new continuous integration system, [Concourse](https://concourse.io). I've had the pleasure of working with [some of the engineering team](http://github.com/xoebus) and have every faith that it's going to be a rock-solid project.

Concourse is a pipeline-oriented CI system, comprising coordination and UI servers, worker agents (both of which can be scaled out) and command-line tools for iteration on pipeline config. The web GUI does a great job of visualising pipelines, to the point where as Concourse Product Manager Alex Suraci pointed out, you can use it as a learning tool to get a snapshot view of what a team builds and how they work.

You should really go check out [the Concourse website](http://concourse.ci); although be warned that as a pre-1.0 product the docs aren't always up-to-date. It's also unlikely to be suitable if you want plug-ins for everything, as you might get on Jenkins - I gather it is deliberately supposed to be simple and cruft-free.

<figure class="retain-aspect-ratio">
  <iframe src="https://www.youtube.com/embed/mYTn3qBxPhQ?list=PLhuMOCWn4P9g-UMN5nzDiw78zgf5rJ4gR" frameborder="0" allowfullscreen></iframe>
</figure>

## Scheduling Persistent Services

It was telling that two talks converged around the same point - how do twelve-factor apps need to change in order to be stateful? It's always been the case that whilst stateless webapps have enabled horizontal scalability of the app tier, they've kicked the can down the road and passed the buck (metaphor bonus multiplier!) to the data tier. Shared-nothing was always *shard*-everything or *shared*-everything(-in-the-database).

CloudCredo's Colin Humphreys and Marco Hochstrasser gave a talk entitled "Service Foundry", hypothesising about *ten*-factor apps, what these would look like, and how they might work on CF. It was a thought-provoking talk as much as a call-to-action amongst the community to work together on the problem.

<figure class="retain-aspect-ratio">
  <iframe src="https://www.youtube.com/embed/806zRJpUdKg?list=PLhuMOCWn4P9g-UMN5nzDiw78zgf5rJ4gR" frameborder="0" allowfullscreen></iframe>
</figure>

The next day two Pivots presented "Persistent Services in Diego," detailing a spike they'd done on enabling exactly that. Their work doesn't magically solve the consistency/availability conundrum, but it did demonstrate how cells in Diego could offer themselves for workloads based on the requirement for either fixed or floating volumes.

<figure class="retain-aspect-ratio">
  <iframe src="https://www.youtube.com/embed/806zRJpUdKg?list=PLhuMOCWn4P9g-UMN5nzDiw78zgf5rJ4gR" frameborder="0" allowfullscreen></iframe>
</figure>

I gather that these features are on the Diego backlog, so will definitely be happening.

I've been daydreaming about an auctioning scheduler model where each node knows its locality to some replicated data, and can bid based on it. That is all dependent on having an HDFS-style synchronously blocking data store though, so won't be applicable for all use cases.

## Multi-DC Cloud Foundry

At the unofficial CF camp on the Sunday preceeding the conference proper, there was an interesting chat about running multiple Cloud Foundry instances in different data centres.

Three issues brought themselves to the fore:

1. How to route traffic between Cloud Foundry instances
1. How to operate distinct Cloud Foundry instances
1. How to maintain app state between Cloud Foundry instances

In my simple mind, routing traffic is the sort of thing you need an F5 Global Traffic Manager or Amazon's Elastic Load Balancer for. I'm not much sure what else can be done other than geography based routing on the first request, and geo-IP lookup done by each CF app to redirect to a specific hostname if it turns out the traffic has been misdirected.

The second issue was an interesting one. Whilst I naively proposed a band-aid of a CF CLI plugin to multiplex commands to multiple CF instances, Colin quite rightly pointed out that this just shifts the problem of attaining consistency of operations to somewhere that it's harder to control. Colin pointed out that if the internals of Cloud Foundry (things like NATS and the Cloud Controller database) were better at dealing with latency and consistency (a move to etcd?), then multi-data-centre-spanning Cloud Foundry instances would be a more realistic prospect.

App state was another question with both a simple and a complex answer. My proposed solution to the enquirer was to use something like Cassandra writing to multiple datacentres when needed, and only doing local writes when not required. Colin once again made a pertinent point based on his experience working on high-volume charity donation sites, that *proper* computer science is necessary: CRDTs, CQRS and each request containing all needed state (y'know, like HTTP is *supposed* to be). Another audience member did point out that the above is much easier to achieve when your system is effectively write-only and each transaction is isolated!

Duncan Winn and Haydon Ryan gave a talk that discussed dual versus split datacentre Cloud Foundry:

<figure class="retain-aspect-ratio">
  <iframe src="https://www.youtube.com/embed/1hYG4y7vm5w?list=PLhuMOCWn4P9g-UMN5nzDiw78zgf5rJ4gR" frameborder="0" allowfullscreen></iframe>
</figure>

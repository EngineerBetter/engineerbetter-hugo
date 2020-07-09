---
author: Daniel Jones
date: "2020-07-09"
heroImage: /img/blog/suse-rancher.jpeg
title: SUSE Acquire Rancher
heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

Yesterday [SUSE announced that they are to acquire Rancher](https://www.theregister.com/2020/07/09/suse_acquires_rancher/), the folks who have helped thousands of customers deploy Kubernetes just about _everywhere_.

## What it means for the market

This makes for an interesting marketplace. We've got **VMware, who went on a spending spree** to give them everything they need for their Tanzu initiative. **IBM bought Red Hat** and with it Openshift, and now SUSE have undeniable Kubernetes credentials with the Rancher acquisition. Several big players all with competent offerings, presumably all going for the same market.

Notably, these folks are all offering **insurance against vendor lock-in**. For all the announcements of _SomeBank_ partnering with _ThatCloud_, they're _all_ eyeing multi-cloud strategies.

## What it means for SUSE and Rancher

It's a nice move for SUSE. I can imagine that historically they've been great at selling to Derek, who has been managing SLES servers in BankCo for the last 25 years, wears a tie and spends most of his day in Excel or Service Now.

Through Rancher, they'll now have access to Taylor, who works for a microservices-oriented startup, drinks cold-press coffee and writes YAML all day.

SUSE get a route into the young and hip market (to go with their [young and hip cloud CTO](https://www.linkedin.com/in/rssfed23/)), and the credentials of one of the most visible forces in the Kubernetes ecosystem. **Rancher get into the world of the enterprise**, with its long sales cycles, and risk-averse nature.

## What it means for SUSE CaaSP

SUSE already have a Kubernetes offering, called SUSE Containers-as-a-Service Platform. Or CaaSP, which is mercifully shorter.

As my colleague [Jessica Stenning recently discovered, deploying CaaSP](/blog/suse-caasp-on-aws) isn't quite as straightforward as one might hope for. Presumably now this can be sun-setted in favour of Rancher's hugely popular solution.

## What about Cloud Foundry?

SUSE have teams of folks working on [KubeCF](https://www.cloudfoundry.org/kubecf/) and its commercial flavour [SUSE Cloud Application Platform](https://www.suse.com/products/cloud-application-platform/), as well as the rather spiffy [Stratos UI](https://github.com/cloudfoundry/stratos). What will happen to these products, and to these folks?

> _An Optional History Lesson_
>
> SUSE bought out the part of Hewlett Packard Enterprise (HPE) that created HPE Helion, a BOSH-less Cloud Foundry distribution. HPE in turn bought these folks from ActiveState, where the Cloud Foundry distro was called Stackato, and presciently also forewent BOSH.

I should imagine that **Rancher's engineering crew is much bigger than the CAP team**. [Rancher's CTO Darren Shepherd is on the record as _not-loving_ efforts like the Open Service Broker API](https://twitter.com/ibuildthecloud/status/1276905783029096454), and I expect that extends to Cloud Foundry, too.

I get this - Rancher is stock full of infrastructure engineers who are down with the cloud native hotness. I'm sure that for them, `kubectl` and YAML are a perfectly acceptable way to get business value delivered.

I'm kinda in agreement with him on the [OSBAPI](https://www.openservicebrokerapi.org/) front. It's not a very Kube-native mechanism for doing things, and seems _oh, so manual_. You could make the same argument regarding `cf push` - does it have a place in the GitOps world?

These views miss something though - empathy for the typical enterprise developer.

**`kubectl` should absolutely _not_ be the interface for app developers** to consume a platform. If you think developers should _have_ to wrestle with the tens of first-class concepts in the Kubernetes API, and worry about it's not-secure-by-default approach, you're deluded. Or have never worked in an enterprise. Which might make you less deluded... Whatever!

An abstraction is needed. Ideally one that's self-service and exploratory. That same user experience doesn't need to persist all the way to production (I don't want _humans_ doing stuff in prod!), but it needs to exist somewhere.

## An Opportunity

Cloud Foundry, if it hurries up and moves with the times, should be 'easy mode' for Kubernetes.

* Developers: don't want to faff about with `kubectl` to push code? Then ask your operators to install Cloud Foundry!
* Operators: don't want app developers screwing up your carefully-configured cluster? Give them access to Cloud Foundry on a cluster instead of `kubectl`!

What if KubeCF/CAP and Stratos end up being an optional feature when deploying a Kubernetes cluster with Rancher? It's an optional value-add for those situations where you don't want app developers getting down and dirty with `kubectl`.

## An Opportunity Missed

Want to know what scares the hell out of me though?

Being here in five years, and finding all the industry has done is swap out VMs for containers. Finding that we still have a separate (not) DevOps team that pipelines the apps made another team.

As an industry we need to get over the new shiny, and keep a darned eye on lead-time-to-production, flow efficiency and the amount of effort it takes to achieve business outcomes.

## Good for Them

It's great news for SUSE, and presumably there will soon be lots of people at Rancher diving into swimming pools filled with money. Not to mention all the tasty enterprise accounts they'll now have access to.

Let's hope that this another of the steps that accelerates the industry to a place where Kubernetes is a given, and we can focus on how to be more productive.

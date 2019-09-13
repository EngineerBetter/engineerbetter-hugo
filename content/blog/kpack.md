---
author: Jessica Stenning
date: "2019-09-04"
heroImage: /img/blog/.png
title:  "kpack: an indicator Pivotal is bridging the CF/K8's gap?"
draft: true
heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

Pivotal recently announced the open-sourcing of kpack, a Kubernetes-native container build service, and the non-commercial sibling of [Pivotal Build Service](https://content.pivotal.io/blog/pivotal-build-service-now-alpha-assembles-and-updates-containers-in-kubernetes). Essentially, kpack provides a 'Kubernetes-native' means to automate the build and update of containers. It does this by providing Custom Resource Definitions (CRDs) as it's user interface, once defined these CRDs are coordinated by Custom Resource Controllers that automate container image builds and keep them updated. Users can then interact with all Kubernetes API tooling, including `kubectl`.

We've tried it, it works. But perhaps more interesting than the product's functionality is the wider business context it's been born into: kpack is a product bridging functionality between the worlds of Cloud Foundry (CF) and Kubernetes. It's built on the foundation of Cloud Native Buildpacks (CNBs), a Cloud Foundry fundamental - push your source code and let buildpacks create your container image for you. kpack aims to bring these benefits (developer productivity, security compliance, automated OS/app level dependency upgrades and so on) to Kubernetes deployments.

kpack is the fourth Pivotal component to undergo a 'K8's native' adaptation in the past 6 months, the others being:

- [RabbitMQ on Kubernetes](https://content.pivotal.io/blog/introducing-rabbitmq-for-kubernetes): It automates deployment and ongoing operations of RabbitMQ, with a self-service and configurability experience available for developers.
- [Service Mesh](https://docs.pivotal.io/pivotalcf/2-6/adminguide/service-mesh.html): It automates setup and configuration of Istio, enabling developers to get apps deployed to production quickly and securely.
- Spring Runtime: It offers comprehensive support for Java environments—including OpenJDK™, Spring Support, and Apache Tomcat®.

In fact, in this [blog post](https://content.pivotal.io/blog/introducing-kpack-a-kubernetes-native-container-build-service) Pivotal announced The Cloud Foundry community's plans to utilise kpack as the new app staging mechanism in the Cloud Foundry Application Runtime (presumably meaning an imminent move to an official CF repository).

In any case, it's clear there's a conscious effort to increase Pivotal's K8s offering, or in the very least decrease the number of products that are CF exclusive - they recently dropped their 'Pivotal Cloud Foundry (PCF)' product handle, to rebrand as 'Pivotal Platform', a move that was likely sensible regardless but feels symbolic nonetheless.

For some this might sound unsurprising, since VMware announced its acquisition of Pivotal on August 22nd, commentators have been hypothesising a more converged future for the two cloud platforms.

"Kubernetes is emerging as the de facto standard for multi-cloud modern apps. We are excited to combine Pivotal’s development platform, tools and services with VMware's infrastructure capabilities to deliver a comprehensive Kubernetes portfolio to build, run and manage modern applications," Pat Gelsinger, CEO of VMware.

In fact their [press release](https://www.vmware.com/company/news/releases/vmw-newsfeed.VMware-Signs-Definitive-Agreement-to-Acquire-Pivotal-Software.1905769.html) contained the word 'Kubernetes' almost a dozen times, with the words 'Cloud Foundry' totally non-existent.

Yes, a company with a brand built on virtualisation needs to make a big statement about its transition to containerisation, but looking at that statement of intent alongside VMware's recent acquisitions (Heptio in November 2018, and packaging service Bitnami in May of this year) paints a pretty consistent picture... VMware is making big investments in _Kubernetes_, so why shouldn't we expect that to translate to Pivotal products too?

_If you're looking for an intro to using kpack, this [Stark & Wayne tutorial](https://starkandwayne.com/blog/investigating-kpack-automatically-updating-kubernetes-pods-with-buildpacks/) gives a good run through and provides some useful context not included in the kpack readme_

Additional points to mention:
- no mention of 'Cloud Foundry' in VMware's press release, announcing their acquisition of Pivotal but lots of k8s talk.
- ongoing class-action currently playing out in the US?

---
author: Jessica Stenning
date: "2019-09-25"
heroImage: /img/blog/packing-robot.jpg
title:  "kpack: another indicator Pivotal is bridging the CF/K8s gap"
heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

Pivotal recently announced the **open-sourcing of kpack**, a Kubernetes-native container build service, and non-commercial sibling of Pivotal Build Service. Essentially, kpack provides a **'Kubernetes-native' means to automate the build and update of container images**. It does this by providing Custom Resource Definitions (CRDs) as a user interface, these CRDs are then coordinated by Custom Resource Controllers (CRCs) to automate container image builds and keep them updated.

Where previously you might have introduced CI pipelines to watch for any Git or buildpack updates, now you can **just point kpack at your Git repo** and be done with it. Simples! Users can then interact with all the usual Kubernetes API tooling, including kubectl.

We've tried it, it works.

Perhaps more interesting than the product's functionality is the wider business context it's been born into: kpack is a product bridging functionality between the worlds of Cloud Foundry (CF) and Kubernetes. Built on the foundation of [Cloud Native Buildpacks](https://buildpacks.io) (CNBs), it's the next-generation of a Cloud Foundry fundamental - push your source code and let buildpacks create your container image for you. kpack aims to bring these benefits (developer productivity, security compliance, automated OS/app level dependency upgrades and so on) to Kubernetes deployments.

kpack is one of a number of Pivotal components that have been [cited](https://content.pivotal.io/announcements/pivotal-makes-kubernetes-easier-for-developers-and-operators) as undergoing a K8s adaptation in the past 6 months, the others being:

- Pivotal Build Service: kpack's commercial counterpart, it automates the creation of container images while providing the additional functionality of the Kubernetes permissions model and a dedicated cli.
- [RabbitMQ on Kubernetes](https://content.pivotal.io/blog/introducing-rabbitmq-for-kubernetes): automates the deployment and maintenance of RabbitMQ, with self-service and configurability available for developers.
- [Service Mesh](https://docs.pivotal.io/pivotalcf/2-6/adminguide/service-mesh.html): automates the setup and configuration of [Istio](https://istio.io/).

In this [blog post](https://content.pivotal.io/blog/introducing-kpack-a-kubernetes-native-container-build-service) Pivotal announced the Cloud Foundry community's plans to utilise kpack as the new app staging mechanism in the Cloud Foundry Application Runtime (presumably meaning an **imminent move to an official CF repository?**).

It's clear there's a conscious effort to increase Pivotal's K8s offering, or at the very least decrease the number of products tied exclusively to CF - they recently dropped their 'Pivotal Cloud Foundry (PCF)' product handle, rebranding as 'Pivotal Platform', a move that was arguably sensible regardless, but feels symbolic nonetheless.

For some this might sound unsurprising. Since VMware announced its acquisition of Pivotal on August 22nd, commentators have been hypothesising a more converged future for the two cloud platforms.

"Kubernetes is emerging as the de facto standard for multi-cloud modern apps. We are excited to combine Pivotal’s development platform, tools and services with VMware's infrastructure capabilities to deliver a comprehensive Kubernetes portfolio to build, run and manage modern applications," Pat Gelsinger, CEO of VMware.

In fact their [press release](https://www.vmware.com/company/news/releases/vmw-newsfeed.VMware-Signs-Definitive-Agreement-to-Acquire-Pivotal-Software.1905769.html) contained the word 'Kubernetes' almost a dozen times, while the words 'Cloud Foundry' remained totally non-existent.

Yes, a company with a brand built on virtualisation needs to make a big statement about its transition to containerisation. Looking at that statement of intent alongside VMware's recent acquisitions (Heptio in November 2018, and packaging service Bitnami in May of this year) paints a pretty consistent picture... VMware is making big investments in _Kubernetes_, why wouldn't we expect that to translate to Pivotal products too?

_If you're looking for an intro to using kpack, this [Stark & Wayne tutorial](https://starkandwayne.com/blog/investigating-kpack-automatically-updating-kubernetes-pods-with-buildpacks/) provides some useful context not included in the kpack readme_

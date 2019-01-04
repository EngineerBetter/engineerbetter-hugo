---
author: Daniel Jones
date: "2018-12-05"
heroImage: /img/blog/iceland-pipeline.jpg
title:  PKS
draft: true

heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

We've been experimenting with PKS (Pivotal ~~Kubernetes~~ _Container_ Service), standing it up on a variety of IaaSes, and keeping it up-to-date using Concourse pipelines - just as we do with Cloud Foundry.

PKS is an exciting prospect for enterprises who want to exploit Kubernetes whilst avoiding some of the headaches that it brings.

In November I was speaking at cloud conference in New York, and found the time to catch a talk entitled _Six Kubernetes Pain Points_. The common issues enumerated were:


* One cluster is not enough
* Developers want clusters close to them, for low latency
* Data storage
* Day two operations - upgrading, scaling, capacity management
* Managing heterogeneous infrastructure underneath the platform
* Backup & restore, disaster recovery

Thankfully, PKS addresses almost all of these points.

## One cluster is not enough

Kubernetes is not as safely multi-tenant as Cloud Foundry, and so best practice is currently to have one cluster per untrusted tenant. PKS brings the Kubernetes-as-a-Service experience that Amazon and Google offer to the enterprise. With a command-line tool operators can spin up new Kubernetes clusters effortlessly.

Because all of these clusters are managed by PKS, keeping them upgraded and in-sync is significantly easier than manually-deployed clusters. Combine the PKS CLI with a Concourse pipeline, and you've got GitOps-driven, self-healing, auto-updating Kubernetes as-a-service inside the enterprise.

## Developer locality

As spinning up new clusters is a breeze, there's no reason to _not_ have clusters for development teams. Because BOSH (and so PKS) can deploy on internal infrastructure like vSphere, developers can access clusters on the local internal network without having to reach out to the nearest AWS/GCP/Azure datacentre, lowering latency and increasing responsiveness.

## Day-two operations

BOSH is famous for its powerful capabilities around day-two operations. In fact, it's part of the reason for its [steep learning ~~curve~~ cliff](http://7-stages-of-bosh.engineerbetter.com/#/6). With the power of BOSH tamed and hidden underneath the PKS tooling, you get the benefits of BOSH's resurrector bringing back unhealthy VMs and managing processes on those VMs.

Let's not forget the **three R's of security: rotate, repave, repair**. With BOSH in play, we can rotate security credentials, recreate VMs regularly to limit the amount of time malware can lie in hiding, and apply updates and patches in a timely fashion - all of which help [avoid vulnerabilties that go on for _four years_](https://www.theregister.co.uk/2018/11/30/marriott_starwood_hotels_500m_customer_records_hacked/).

## Heterogeneous Infrastructure

Through the use of BOSH, you can deploy PKS clusters to different IaaSes and have their differences abstracted away.

## Backup and Restore

## The Future

Once federated Kubernetes is mature, tools like PKS will become even more powerful. Federated Kubernetes will allow users to only consider one single logical deployment platform, but will have their workloads spread across multiple Kubernetes instances. With PKS and its use of BOSH, those instances can be on different cloud providers, insulating operators from the risk of outage of any given IaaS, and even opening the possibility of scaling clusters in and out based on which IaaS is cheaper at a given moment in time.

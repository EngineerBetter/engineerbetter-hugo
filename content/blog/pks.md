---
author: Daniel Jones
date: "2019-01-10"
heroImage: /img/blog/taisun-gantry-crane.jpeg
title:  PKS - a Painkiller for Kubernetes
draft: true

heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

PKS is Pivotal's Kubernetes distribution that brings self-service Kubernetes-as-a-Service to the enterprise, be that on private or public cloud. By leveraging the BOSH deployment tool under the hood, PKS is able to solve many of the most common headaches for Kubernetes operators.

We've been experimenting with PKS (Pivotal ~~Kubernetes~~ _Container_ Service), standing it up on a variety of IaaSes, and keeping it up-to-date using Concourse pipelines - just as we do with Cloud Foundry.

PKS is an exciting prospect for enterprises who want to exploit Kubernetes whilst avoiding some of the headaches that it brings.

## Kubernetes Pain Points

In November I was speaking at cloud conference in New York, and found the time to catch a talk entitled _Six Kubernetes Pain Points_. The common issues enumerated were:

* One cluster is not enough
* Developers want clusters close to them, for low latency
* Data storage
* Day two operations - upgrading, scaling, capacity management
* Managing heterogeneous infrastructure underneath the platform
* Backup & restore, disaster recovery

Thankfully PKS addresses all of these points with the exception of managing data storage, which is really out-of-scope for a Kubernetes deployment tool and distribution.

### One cluster is not enough

**Solution: PKS makes it easy to manage many clusters**

Kubernetes is not as safely multi-tenant as Cloud Foundry, and so best practice is currently to have one cluster per untrusted tenant. PKS brings the Kubernetes-as-a-Service experience that Amazon and Google offer to the enterprise. With a command-line tool operators can spin up new Kubernetes clusters effortlessly.

Because all of these clusters are managed by PKS, keeping them upgraded and in-sync is significantly easier than manually-deployed clusters. Combine the PKS CLI with a Concourse pipeline, and you've got GitOps-driven, self-healing, auto-updating Kubernetes as-a-service inside the enterprise.

### Developer locality

**Solution: PKS can deploy Kubernetes to local private cloud**

As spinning up new clusters is a breeze, there's no reason to _not_ have clusters for development teams. Because BOSH (and so PKS) can deploy on internal infrastructure like vSphere, developers can access clusters on the local internal network without having to reach out to the nearest AWS/GCP/Azure datacentre, lowering latency and increasing responsiveness.

### Day-two operations

**Solution: BOSH can rotate credentials and will resurrect nodes**

BOSH is famous for its powerful capabilities around day-two operations. In fact, it's part of the reason for its [steep learning ~~curve~~ cliff](http://7-stages-of-bosh.engineerbetter.com/#/6). With the power of BOSH tamed and hidden underneath the PKS tooling, you get the benefits of BOSH's resurrector bringing back unhealthy VMs and managing processes on those VMs.

Let's not forget the **three R's of security: rotate, repave, repair**. With BOSH in play, we can rotate security credentials, recreate VMs regularly to limit the amount of time malware can lie in hiding, and apply updates and patches in a timely fashion - all of which help [avoid vulnerabilties that go on for _four years_](https://www.theregister.co.uk/2018/11/30/marriott_starwood_hotels_500m_customer_records_hacked/).

### Heterogeneous Infrastructure

**Solution: PKS automates deployments, so no snowflakes**

Through the use of BOSH, **you can deploy PKS clusters to different IaaSes and have their differences abstracted away**. By automating deployments, Kubernetes nodes become cattle and not pets, and will all be uniformly provisioned.

### Backup and Restore

**Solution: Kubernetes masters are backed up**

PKS 1.3 ships with built-in support for **backup and restore** of not only the PKS control plane, but also of the **Kubernetes master nodes** themselves - meaning all the etcd data are backed up. Once again, this comes courtesy of tooling that's available for BOSH and has been battle-tested in production by some of the largest enterprises and governments over a period of years.

In subsequent versions PKS will support backup and restore for even more components: persistent volumes for your apps' data, and also Harbor, the CNCF image registry.

## The Future

Once federated Kubernetes is mature, tools like PKS will become even more powerful. Federated Kubernetes will allow users to only consider one single logical deployment platform, but will have their workloads spread across multiple Kubernetes instances. **With PKS and its use of BOSH, those instances can be on different cloud providers**, insulating operators from the risk of outage of any given IaaS, and even opening the possibility of scaling clusters in and out based on which IaaS is cheaper at a given moment in time.

Pivotal have been in the platform game for longer than Kubernetes has been in existence. They are now applying all they've learnt and all they've built to Kubernetes, making manual deployment of Kubes an absurd choice by comparison.

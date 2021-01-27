---
author: Daniel Jones
date: "2021-01-29"
heroImage: /img/blog/cf-standoff.jpg
title: cf-for-k8s, KubeCF, Kf
draft: true

heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

<figure>
  <figcaption><em><a href="https://www.flickr.com/photos/28293006@N05/8144747570">Original image source</a>, before my terrible modifications</em></figcaption>
</figure>

There is no single obvious choice for those evaluating Kubernetes-based Cloud Foundry distributions and alternatives. Find out why **EngineerBetter chose Google's Kf** for our estate, and why our advice to existing Cloud Foundry users is "**stay on BOSH**."

In January VMware shut down their public Cloud Foundry (Pivotal Web Services). All of EngineerBetter's apps ran on PWS and so we needed to migrate away from the platform and find something equally cheap and simple.

Our choices were:

* cf-for-k8s
* KubeCF
* Google's Kf

<figure>
  <img src="/img/blog/cf-comparison-table.png" class="fit image">
  <figcaption>The selection of features supported by cf-for-k8s and Kf are surprising.</figcaption>
</figure>

We'll get back to the narrative of our own experiences at the end of the post, and instead focus on a comparison of the tools.

## cf-for-k8s

<img src="https://www.cloudfoundry.org/wp-content/uploads/CF-for-K8s-horizontal.png" class="fit image">

[cf-for-k8s](https://github.com/cloudfoundry/cf-for-k8s) drops many features, but generally maintains CF CLI and API compatibility whilst replacing most of the internal components. In terms of approach, cf-for-k8s is "maintain CLI/API compatibility and replace the internals with cloud-native equivalents."

cf-for-k8s is spearheaded by VMware. Whereas KubeCF had to be an incubation project, cf-for-k8s was immediately a top-level project in the Cloud Foundry Foundation.

### How is it implemented?

* Replaces almost all of Cloud Foundry with new components
* Retains the Cloud Controller, for API compatibility
* Deployed using [Carvel](https://carvel.dev/), VMware's open source Kubernetes tooling that has little adoption elsewhere

### How compatible is it?

cf-for-k8s would **fail [Cloud Foundry Provider Certification](https://www.cloudfoundry.org/certified-platforms-how-to/)**. The community maintains [a list of **unsupported** features](https://docs.google.com/document/d/1X5AUpM0eK5z_4yWJk35HqrCFJRVjS7kRJsRxsf-7dsM/view#heading=h.set0zeyyi2jw):

  * Existing _not-cloud-native_ buildpacks
  * Container-to-container networking
  * Route services
  * TCP routing
  * Isolation Segments
  * App instance routing
  * `cf ssh`
  * Developer-specified buildpacks (ie via `cf push -b`)

My personal take is that the project would be more appropriately-named "_something-that-is-a-lot-like-cf-for-k8s_."

### Is it ready yet?

No. The commercial version (the snappily-named [_Tanzu Application Service for Kubernetes_](https://docs.pivotal.io/tas-kubernetes/0-7/index.html)) has been released only as a technical preview.

### Can I buy it?

No.

### What about the future?

VMware are publicly committed to cf-for-k8s.

I would invite readers to consider the amount of [activity on the relevant GitHub repositories](https://github.com/cloudfoundry/cf-for-k8s/pulse), and to see how predominantly _TAS for Kubernetes_ features in VMware Tanzu sales pitches and marketing materials. Search results point to reference documentation and a download page, but no shiny marketing material. VMware employees have recently been showing increasing interest in KubeCF on the Cloud Foundry Foundation Slack.

## KubeCF

<img src="https://www.cloudfoundry.org/wp-content/uploads/Kube-CF.png" class="fit image">

[KubeCF](https://github.com/cloudfoundry-incubator/kubecf) uses complex tooling to deploy the exact-same Cloud Foundry components used currently onto Kubernetes. You can think of its approach as "take what we have, deploy it on Kubes."

KubeCF has had most contributions from SUSE, IBM and HCL.

### How is it implemented?

* All the current Cloud Foundry components, repackaged for Kubernetes
* Uses Fissile to turn cf-deployment BOSH releases into container images
* Deployed using Quarks, a set of operators
* The myriad controllers and init containers can be _very_ hard to debug

### How compatible is it?

* **Almost all features work** including uncommon ones like sidecar containers, and container-to-container networking
* Route services are not supported
* Isolation segments are not supported

### Is it ready yet?

Yes. IBM are running it in production, SUSE have customers running it in production, and we know folks that have been running KubeCF instances for over a year without problems.

### Can I buy it?

Go and ask SUSE if you can buy their [Cloud Application Platform](https://www.suse.com/products/cloud-application-platform/). I suspect you'll get a sales pitch for [Rancher's RKE](https://rancher.com/products/rke/).

### What about the future?

IBM depend on KubeCF for their production offerings.

I would invite readers to ponder whether the expensive Rancher acquisition made by SUSE incentivises them to continue selling Cloud Foundry. What is the [Carrier](https://github.com/SUSE/carrier) project recently started by SUSE, involving the folks who have been working on KubeCF?

Again, look at the [activity on the GitHub repos](https://github.com/cloudfoundry-incubator/kubecf/pulse), and most importantly, see if you can get SUSE to sell you a CAP.

## Kf

<figure>
  <img src="https://raw.githubusercontent.com/google/kf/main/images/kf.svg" class="fit image">
  <figcaption>Kf conceptual architecture, <a href="https://github.com/google/kf">from the Kf repo</a></figcaption>
</figure>

[Kf](https://cloud.google.com/migrate/kf/docs) is a set of components made by Google Cloud and offered as part of their Anthos suite. It offers a core developer experience that is similar to using the CF CLI with a completely new and Kubernetes-native backend. Kf does not intend to implement all the features of Cloud Foundry, rather the core app-pushing experience.

Kf [started life as an open source project](https://web.archive.org/web/20200503213544/github.com/google/kf) before [being made closed source](https://web.archive.org/web/20200905050558/github.com/google/kf), presumably for the sake of competitive advantage or due to lack of engagement from other Cloud Foundry Foundation members.

### How is it implemented?

* A combination of a CLI, Anthos components, and custom Kubernetes controllers
* It's all currently closed-source, proprietary Google code
* As everything is Kubernetes-native one can debug the entire system with `kubectl` alone

### How compatible is it?

* The `kf` CLI is not a like-for-like match for the `cf` CLI
* Many previous features are not implemented, but core app-pushing is
* There is no Cloud Controller, so other non-CLI interactions will not work (eg Stratos)
* There are some restrictions on app and domain names (eg app names cannot start with a numeral, no `www.` as a host)
* Google are working on a migration tool

### Is it ready yet?

Yes. We decided to run all our Cloud Foundry apps on GKE using `kf`. In fact, this very page was served by a `kf` app!

Given some of the scaling limitations of Kubernetes itself, operators should expect to break one large Cloud Foundry into smaller `kf` Kubernetes clusters.

### Can I buy it?

Yes - I'm sure Google Cloud will be very happy to have your custom, and [EngineerBetter as Google Cloud partners](https://cloud.withgoogle.com/partners/detail/?id=engineerbetter&hl=en-GB) can also help you with that.

### What about the future?

Google continue to invest in `kf` and Product Manager Micah Baker has publicly mentioned a feature roadmap stretching out at least a year.

## Our experience

We needed to migrate away from PWS before 15th January 2021. Our estate comprised around 15 static web applications, and a few Ruby apps. Some of these needed Redis and Postgres data services.

The team enthusiastically started off using cf-for-k8s. After more than a week of effort, we concluded that it was not ready for real-world use.

Whilst cf-for-k8s makes starting a development environment trivial, it does not offer the feature toggles required for a production deployment. A lot of the conveniences in cf-deployment's ops files are missing.

The lack of old-school buildpacks was an absolute showstopper for us. There weren't CNB equivalents available, and even if there were, they probably would not have yielded identical results.

Comments from our engineers included "this is _so_ not ready" and "this feels like an alpha." They did like the use of Istio and Fluentd, however.

We've used KubeCF before, and have delivered training on how to install and operate it. Given the small number of apps that we have, and our lack of need for multi-tenancy, the debugging overhead of all the Quarks-spawned init containers felt like something we should avoid.

Kf was the simplest approach given our low app count (fewer than 20). Whilst we encountered a few gotchas (see the limitations on app and domain names above) it was great that old-school buildpacks are supported (as well as CNBs). The operational overhead is minimal, and the effort to change our CI pipelines was pretty minimal.

As one of our engineers commented: "Kf is how I wish cf-for-k8s had been implemented." All state is in the kube-api, meaning everything is debuggable with `kubectl`.

## What should I do?

If you're an existing BOSH-deployed Cloud Foundry operator who does not have a pressing need to make changes, **I strongly suggest that you continue using BOSH and cf-deployment**.

If you're using BOSH-deployed Cloud Foundry and are concerned about the dwindling pool of BOSH talent to operate your environment, then you have two sensible options:

* use `kf` on any Anthos-connected cluster
* use KubeCF and hope that the project will be maintained

I don't see any use cases for which cf-for-k8s is the ideal solution. This is unfortunate, as I already know a bunch of operators who have spent time evaluating it and drawn the same conclusion - it's not ready yet.

## Wait, BOSH?

Wasn't 2021 supposed to be the year of Cloud Foundry's second wind? Bringing the CF experience to the masses of Kubernetes operators who found building their own platform too costly? It seems like, via a self-fulfilling prophecy of strategic decisions, the future of Cloud Foundry is BOSH.

## Isn't there anything else?

We've not found anything that matches the Cloud Foundry experience. Yes, the imperative `cf` CLI is an anachronism in the world of GitOps. But Cloud Foundry is more than that - it's the sum of all the assurances made to operators too. The simplicity of having a batteries-included platform; being able to rebuild container images long after app teams have disbanded; a curated marketplace of dynamically-provisioned data services; a sensible RBAC model; security-by-default; years of production-hardening in regulated, governmental and military environments.

There are great tools out there like [DevSpace](https://devspace.sh/). The big vendors are all interested in building something proprietary on top of Knative. We're yet to find something as vendor-neutral and feature-complete as Cloud Foundry.

If it ain't broke, don't fix it. The innards of Cloud Foundry are antiquated. Fewer and fewer people will be able to support BOSH. However, **there is not yet a 'no-brainer' replacement** that my peers (in other consultancies - we talk a lot) and I can recommend.

Kubernetes is the substrate on which all cloud platforms will be built. [Kubernetes is not a PaaS](https://github.com/EngineerBetter/k8s-is-not-a-paas). I wish vendors had moved Cloud Foundry onto Kubernetes sooner. Goodness knows, [Cisco](https://blogs.cisco.com/cloud/containerized-cloud-foundry-is-key-element-for-cloud-native) and [the team that joined SUSE](https://twitter.com/sramji/status/1331275042647228416) tried.

> <figure class="retain-aspect-ratio">
  <iframe src="https://youtube.com/embed/QWMUYl0BkEI?start=1151" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</figure>

Five years ago I made an invitation to deliver technology in a way that most respected the expended heartbeats of those around you.

* Which path ahead saves your organisation the most toil and expense?
* At what point do antiquated internals present a bigger risk than the cost of homebrewing a platform?
* How much more important are business outcomes than using the coolest new tech?

I look forward to continuing my involvement in the [CNCF Business Value Subcommittee](https://lists.cncf.io/g/cncf-business-value), to ensure the passion and learnings of the Cloud Foundry community continue to have a broad and meaningful impact.

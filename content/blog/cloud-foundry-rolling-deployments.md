---
author:  Andy Paine
date: "2020-06-24"
heroImage: /img/blog/v3-deployments/rolling-waves.jpg
title: Cloud Foundry Rolling Deployments

heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

[Version 7 of Cloud Foundry's `cf` CLI is now generally available](https://www.cloudfoundry.org/blog/cloud-foundry-foundation-announces-availability-of-new-features-to-make-modern-application-development-even-simpler-for-developers/). This makes rolling deployments a first-class feature, and adds many more flexible workflows than the original `cf push` offered. These changes bring the Cloud Foundry user experience more in line with what users have come to expected from Kubernetes' Deployments. **Rolling deployments are now available** - so why should you switch?

## A History of `cf push`

Over the last 18 months, the Cloud Controller (the brains of Cloud Foundry) has been extended to support a new set of APIs - collectively known as V3. Combined with the new V7 of the `cf` CLI, more of the internals of the app deployment process are (optionally) exposed to users.

There are now three approaches:

* simple `cf push`
* blue/green deployments
* new rolling deployments

### Simple `cf push`
Historically, Cloud Foundry's `cf push` command was intentionally atomic - all instances of an app were taken down, before new ones were added. This was to protect the users of apps whose developers were making breaking changes from inconsistent behaviour.

In this older model, there is only one logical app in the Cloud Controller database. When the new version of the code starts running, the identifier of the app hasn't changed, so all previous settings are retained.

A simple `cf push` is shown at the top of the following graph, with a long period of error responses whilst the app is being replaced:

<figure>
  <img src="/img/blog/v3-deployments/push-compared.jpg" alt="Two graphs showing the downtime of an app when pushed with and without a rolling strategy" class="fit image">
  <figcaption>Comparison of 2xx (pink) requests vs. 4xx (orange) requests during a normal push (top) and a rolling push (bottom)</figcaption>
</figure>

### Blue/green deployments
Cloud Foundry has always offered the features for a zero-downtime deployment using a variant of the [blue-green deployment strategy](https://docs.cloudfoundry.org/devguide/deploy-apps/blue-green.html). Blue-green deployments allow for zero downtime by creating an entirely new application for the new code each time (the `blue` deployment) before switching traffic over from the old application (the `green` deployment).

Importantly this required _a new app_ in the database of Cloud Foundry - so a new and unrelated app, with a different ID. Cloud Foundry had no way of knowing that it was a newer version of the same codebase. Events and logs relating to the old version would use the old app ID, and when the old app was deleted (because the new version was live) these data would also be lost.

### Rolling deployments
Rolling deployments leverage the new V3 [**processes**](https://v3-apidocs.cloudfoundry.org/index.html#processes) to allow an existing app to be updated without downtime. When an app is deployed with `cf push --strategy rolling`, Cloud Foundry replaces instances of the old process with instances of the new process one-by-one whilst routing traffic to all healthy instances. Not every customisation applied to an application can be specified in the `manifest.yml`, but by updating an application in-place, all **existing history and configuration is persisted**.

<figure>
  <img src="/img/blog/v3-deployments/rolling-deployment.gif" alt="A gif of a terminal showing multiple processes running during a rolling deployment" class="fit image">
  <figcaption>Multiple processes in flight during a rolling deployment</figcaption>
</figure>


## Benefits of Rolling Deployments

### Service bindings
Cloud Foundry service brokers implement the [Open Service Broker API](https://www.openservicebrokerapi.org/) which specifies that each service binding should use a unique set of credentials. When deploying with a legacy blue-green strategy, new service bindings and **new credentials are generated every time**. This can make it hard to track which applications are accessing a service and result in permissions errors during releases where new credentials are not authorised correctly. Rolling app deployments solve this by using the **same service binding** every time you deploy.

### Network policies
Applications utilising [container-to-container networking](https://docs.cloudfoundry.org/devguide/deploy-apps/routes-domains.html#internal-routes) require network policies to allow traffic between apps. Network policies are associated with app GUIDs meaning new apps created during a legacy blue-green deployment will not be able to communicate with others. Rolling deployments solve this by updating the application in place, **removing network interruptions during deploys**.

### Meaningful audit events
The `cf events` command can track changes to an application over time, providing useful insight into what was changed and when. Rolling deployments provide a persistent view of **how an application has changed over time** including deploys, changes and crashes.

<figure>
  <img src="/img/blog/v3-deployments/audit-events.png" alt="A table of audit events for a app including deployments and a crash" class="fit image">
  <figcaption>Output of `cf events`</figcaption>
</figure>

### Instance quotas
Cloud Foundry organisations and spaces are subject to [quotas](https://v3-apidocs.cloudfoundry.org/index.html#organization-quotas) that limit the amount of computing power users can consume. Blue-green deployments require running **twice as many instances** of an application during deployment. Multiple apps being deployed at the same time can easily tip a user over their allowed quota resulting in failed deployments. Rolling deployments instead only add **one more instance at a time**, providing the same uninterrupted service, without exceeding any quotas.

### Droplets and revisions
When an app is pushed to Cloud Foundry, it is built into an executable package known as a [droplet](https://v3-apidocs.cloudfoundry.org/index.html#droplets) during the staging process. V3 also introduces the concept of [revisions](https://v3-apidocs.cloudfoundry.org/index.html#revisions) which represent a snapshot of the code and configuration of an application. With rolling deployments, apps have a full history of droplets and revisions, allowing for **fast and safe rollbacks** to previous versions of an app.

### Rolling restarts
Sometimes an app needs restarting or restaging - to pick up new configuration, fetch an updated service binding or to clear out a cache. Both commands can now be performed without downtime by adding `--strategy rolling`, following the same one-by-one replacement strategy as deployments.

## Using Rolling Deployments

The good news is that it's as simple as running `cf push --strategy rolling`, providing that you're using v7 of the `cf` CLI and are targeting a Cloud Foundry running capi-release v0.168.0 or later.

> ### Deejay's notes

> It's great that this is now a first-class feature in Cloud Foundry. Given that Cloud Foundry prides itself on providing a great developer experience, it's somewhat unfortunate that it's taken months if not years to get here. Kubernetes' Deployments have been providing a less-surprising default behaviour for a while now.

> The Cloud Controller is particularly hard to refactor, and I hope to see its responsibilities diminish as [`cf-for-k8s`](https://github.com/cloudfoundry/cf-for-k8s) progresses. The default behaviour of `cf push` and `cf restart` made sense ten years ago when Cloud Foundry was nascent, and 12 Factor applications were new to world. This is a timely and much-needed improvement if Cloud Foundry is going to uphold the principle of least astonishment.

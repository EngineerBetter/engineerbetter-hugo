---
author:  Andy Paine
date: "2020-06-05"
heroImage: tbd
title: Cloud Foundry V3 rolling deployments

heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---
# Why should you migrate to using CF rolling deployments?
Over the last 18 months, Cloud Controller (the brains of the CF operation) has been extended to support a new set of APIs - collectively known as V3. Importantly for CF users, this includes supports a new "rolling" deployment strategy. With the next major release of the CF CLI already in beta, rolling deployments are nearly here - so why should you use them?

## Zero downtime deployments
For a long time, Cloud Foundry users have had to pick between having downtime when updating an app with `cf push` or using a variant of the [blue-green deployment strategy](https://docs.cloudfoundry.org/devguide/deploy-apps/blue-green.html) to allow applications to be updated without iterruption. Blue-green deployments allow for zero downtime by creating an entirely new application for the new code each time (the `blue` deployment) before switching traffic over from the old application (the `green` deployment).

## Rolling deployments
Rolling deplyments leverage the new V3 [**processes**](https://v3-apidocs.cloudfoundry.org/index.html#processes) to allow an existing app to be updated without downtime. When an app is deployed with `cf push --strategy rolling`, Cloud Foundry replaces instances of the old process with instances of the new process one-by-one whilst routing traffic to all healthy instances. Not every operation applied to an application can be specified in the `manifest.yml`, but by updating an application in-place, any **existing history and configuration is persisted**.

<figure>
  <img src="/img/blog/v3-multiple-processes.jpg" alt="A screenshot of a terminal showing multiple processes running" class="fit image">
  <figcaption>Multiple processes in flight at the same time</figcaption>
</figure>


## Benefits
### Service bindings
Cloud Foundry service brokers implement the [Open Service Broker API](https://www.openservicebrokerapi.org/) which specifies that each service binding should use a unique set of credentials. When deploying with a blue-green strategy, new service bindings and **new credentials are generated every time**. This can make it hard to track which applications are accessing a service and result in permissions errors during releases where new credentials are not authorised correctly. Rolling app deployments solve this by using the **same service binding** every time you deploy.

### Network policies
Applications utilising [container-to-container networking](https://docs.cloudfoundry.org/devguide/deploy-apps/routes-domains.html#internal-routes) require network policies to allow traffic between apps. Network policies are assigned frotrack app GUIDs meaning new apps created during a blue-green deployment will not be able to communicate with others. Rolling deployments solve this by updating the application in place, **removing network interruptions during deploys**.

### Meaningful audit events
The `cf events` command can track changes to an application over time, providing useful insight into what was changed and when. Rolling deployments provide a persistent view of **how an application has changed over time** including deploys, changes and crashes.

### Instance quotas
Cloud Foundry organisations and spaces are subject to [quotas](https://v3-apidocs.cloudfoundry.org/index.html#organization-quotas) that limit the amount of computing power users can consume. Blue-green deployments require running **twice as many instances** of an application during deployment. Multiple apps being deployed at the same time can easily tip a user over their allowed quota resulting in failed deployments. Rolling deployments instead only add **one more instance at a time**, providing the same uninterrupted service, without exceeding any quotas.

### Droplets and revisions
When an app is pushed to Cloud Foundry, it is built into an executable package known as a [droplet](https://v3-apidocs.cloudfoundry.org/index.html#droplets) during the staging process. V3 also introduces the concept of [revisions](https://v3-apidocs.cloudfoundry.org/index.html#revisions) which represent a snapshot of the code and configuration of an application. With rolling deployments, apps have a full history of droplets and revisions, allowing for **fast and safe rollbacks** to previous versions of an app.

### Rolling restarts
Sometimes an app needs restarting - to pick up new configuration or to clear out a cache. This can also be done without downtime now using `cf restart --strategy rolling`, following the same one-by-one replacement strategy as deployments.
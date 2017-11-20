---
author: Will Gant, Sapphire Mason-Brown
date: "2017-11-20"
heroImage: /img/blog/deploying-kubernetes-with-bosh.jpg
title: Deploying Kubernetes with BOSH

heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

<section class="boxout">
<p>Enthusiastic new starters at EngineerBetter Will Gant and Sapphire Mason-Brown decided to take a tour around the Kubernetes BOSH release that is the <a href="https://docs-kubo.cfapps.io/">Cloud Foundry Container Runtime (CFCR)</a> to find out what it has to offer.</p>
</section>

As the popularity of containerization continues to rise, so too has the use of services like Kubernetes, which automate deployment, scaling and management of applications by development teams. But what happens when a core component of your Kubernetes cluster suddenly fails?

In a traditional scenario, the death of a sickly Kubernetes node would have to be brought to the attention of a platform operator, who would then have to follow a number of manual (and not always fully documented) steps to bring it back to life. Since March this year, additional resilience has been offered in the form of Cloud Foundry Container Runtime (CFCR)(https://docs-kubo.cfapps.io/), which makes Kubernetes available as a BOSH release. Formerly known as Kubo, CFCR is a collaboration between Pivotal and Google, who have since donated the project to the Cloud Foundry Foundation.

Just as with Cloud Foundry, BOSH takes care of the deployment of the platform, while also monitoring its health, spinning up new virtual machines and installing updates as required. To make clusters even more resilient to unexpected failures, BOSH can also deploy CFCR over multiple different cloud providers and even alongside a Cloud Foundry deployment.

## Deploying apps in a cluster

A cluster is made up of at least one master and one worker node. An additional third node (etcd) records the state of the cluster - which nodes exist, which ‘pods’ should be running, and where. Each pod sits on a worker node, and represents one or more containers that share system resources and IP addresses. The outside world communicates with the cluster through the  Kubernetes API, which sits behind a load balancer.

When a developer wants to push a containerized app, they can run the `kubectl run` command:

`kubectl run <APP-NAME> <IMAGE>`

For example `kubectl run hello-world --image=gcr.io/google-samples/node-hello:1.0`.

To view the details of new deployment, run `kubectl describe deployment <APP-NAME>`.

Kubernetes apps run in pods on worker nodes.

Once your app is up and running, you can easily scale the number of running instances, and expose it externally through the kubectl CLI.

## Platform deployment

In order to get your CFCR cluster setup on AWS (the infrastructure provider we chose), the first step is downloading and expanding the official Kubo Deployment tarball. This can be used to terraform a bastion/jump box VM, from which the CFCR deployment is ultimately made. After some configuration, we run `deploy_bosh` to create our BOSH director, and do some further terraforming to create an AWS load balancer that will handle routing for our cluster. After this, it’s just a case of running a couple of scripts to deploy CFCR itself and set up its command line interface.

We went through the setup process a few times, and think it’s realistic to expect to go from zero to running a ‘hello world’ app in under an hour (though the official guide could be improved - we were tripped up a few times by some inconsistent naming of environmental variables).

Whilst the deployment instructions give you what you need to make the initial deployment of BOSH, the uninitiated will need to gain at least a fundamental understanding of what BOSH does, along with some core CLI commands. For instance, while testing the limits of what BOSH was capable of - by terminating all but two of our CFCR nodes in the AWS console - we managed to break our deployment, but were able to inspect our VMs with BOSH before using the director to put our dying cluster out of its misery as a precursor to redeployment.

Many aspect of the developer experience will be familiar to existing users of Cloud Foundry, though, because of the nature of containerized deployment, the process of pushing an app is a little more involved. While a beta version is expected soon, there is also currently no equivalent to the CF marketplace for provisioning services such as databases, and binding them to applications.

CFCR is still in its infancy, with some key components under development. Kubernetes itself dominates the container orchestration market, as the tool chosen by more than 40% of businesses in this year’s [Annual Container Adoption Survey](https://portworx.com/wp-content/uploads/2017/04/Portworx_Annual_Container_Adoption_Survey_2017_Report.pdf). However, [a report by](https://cloudfoundry.org/container-report-2017/?utm_source=pr&utm_campaign=cr17&utm_content=cff) the Cloud Foundry Foundation found an increase from just 22% to 25% of firms making use of containers between 2016 and 2017. With its ease of deployment and built-in lifecycle management, CFCR could be the tool to give the sector the boost it needs to hit the mainstream.

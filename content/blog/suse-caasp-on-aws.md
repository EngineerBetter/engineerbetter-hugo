---
author:  Jessica Stenning
date: "2020-06-29"
heroImage: /img/blog/shipping-containers.jpg
title: Deploying SUSE CaaS Platform on AWS
draft: true

heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

The SUSE Containers as a Service (CaaS) Platform deployment on AWS recently went into technological preview (as of [version 4.1.2](https://www.suse.com/releasenotes/x86_64/SUSE-CAASP/4/#_deployment_on_aws_as_technology_preview)). I spent a few days going through the docs and deploying my own SUSE CaaS Platform (v4.2.1) on AWS, and here are my tips for a smooth deployment.

> This blog post makes reference to "Master" nodes. This terminology is used for consistency with the official documentation.

## What is SUSE CaaS Platform?
First off, what is SUSE CaaS Platform? As SUSE have put it: 'SUSE CaaS Platform is an enterprise class container management solution that enables IT and DevOps professionals to more easily deploy, manage, and scale container-based applications and services'.

Or, if that's too much of a mouthful for you, think Kubernetes with bells and whistles on.

It uses:

* SUSE's Cloud Native Computing Foundation (CNCF) certified Kubernetes distribution;
* SUSE Linux Enterprise Server(SLES) 15 SP1 container OS;
* SUSE managed container image registry;
* Cilium for networking;
* Helm for package management;
* Custom tooling designed to simplify deployment, scaling, and maintenance of Kubernetes.

Here's the [reference architecture](https://documentation.suse.com/suse-caasp/4.2/html/caasp-deployment/_deployment_scenarios.html#_default_deployment_scenario) for CaaS Platform 4.2.X:

<a href="https://documentation.suse.com/suse-caasp/4.2/html/caasp-deployment/images/caasp_cluster_components.png"><img class="image fit" src="https://documentation.suse.com/suse-caasp/4.2/html/caasp-deployment/images/caasp_cluster_components.png" /></a>

## Why would you want to use it?
To put it plainly, you're an enterprise organisation that wants to utilise the benefits of Kubernetes (reduced infrastructure costs, faster application delivery cycle times, all-round improvements to productivity and so on), BUT you're an _enterprise_ so you need a solution that will get sign-off from the security team - a fully supported solution based on a robust container OS helps ticks those boxes.

Additionally, because SUSE's certified distribution of upstream Kubernetes utilises only Kubernetes' features and APIs (no unnecessary additional layers or special APIs), there's no vendor lock-in. If you think one day you might want to move Kubernetes to another cloud provider, or utilise Kubernetes across multiple public and private clouds (or non-cloud resources), SUSE CaaS Platform provides an out of the box portable solution.

## I'm sold, how do I deploy it on AWS?
_This blog post is based on the deployment of SUSE CaaS Platform on AWS, rather than any ongoing maintenance or administration_

The process to deploy on AWS is documented, but as previously mentioned, it's currently in tech preview, and there are a couple of caveats to getting it up and running quickly and successfully. The following steps have been written to be read _alongside_ [the official SUSE documentation](https://documentation.suse.com/suse-caasp/4.2/html/caasp-deployment/_deployment_instructions.html#), not instead of.

## 1. Register for a free trial of SUSE CaaS Platform
This is easily done via the [SUSE Website](https://www.suse.com/products/caas-platform/trials/MkpwEt3Ub98~/?campaign_name=Eval:_CaaSP_4), once you've gone through the registration process you'll be given a trial registration code - keep a note of this as you'll be using it at various stages of the deployment process. A trial of SUSE CaaS Platform lasts 2 months.

<img src="/img/blog/caasp-on-aws/caasp-trial-page.png" class="fit image" alt="SUSE CaaS Platform trial registration">

## 2. Deploy a 'Management' workstation
Firstly you'll need an instance to bootstrap the entire deployment process. The initial deployment step for CaaS Platform on AWS utilises some SUSE-defined Terraform templates to spin up the infrastructure for your cluster. Before you can do that you'll need somewhere to run that Terraform _from_, and as the docs state, you'll need to be running SUSE Linux Enterprise Server (SLES) 15 SP1 to install those packages.

As someone with no experience deploying or operating SLES, it took me a little while to work out the best way to spin up one of these instances to act as my Management instance.

When you register for your free trial of SUSE CaaS Platform you're given access to some downloadable material, some `iso` images for the SLES server with or without packages bundled in (visible in the screenshot above). I started out creating an instance from the SLES `iso` image on Virtualbox to get up and running quickly. While this _technically_ worked, it was a bit painful to get things done, and I wanted to look at automated deployments down the line so pivoted to using AWS instead.

### 2.1 AWS 'Management' workstation
While AWS offers a standard SLES 15 SP1 in its marketplace, it is (currently) not possible to add the CaaS Platform repos to this instance. This took me a while to work out, and as far as I can see, isn't currently documented.

So, while the first paragraph of the deployment docs states that you need a workstation running SLES 15 SP1 or equivalent, the 'standard' AWS AMI is not sufficient.

Instead, using my previous Virtualbox deployment, I identified the AMI used in the terraform to deploy the Master and Worker nodes and used this AMI to create my Management workstation (currently `ami-020aaee0bf8836bf0`) - the docs state that you can run cluster bootstrap commands from the master node, so I took an educated guess that this AMI would have everything needed, and it did!

Again, this isn't documented as a supported method of implementation, but it was effective in my case.

## 3. Management SSH key
When creating the SSH key on your Management instance in the [first step](https://documentation.suse.com/suse-caasp/4.2/html/caasp-deployment/_deployment_instructions.html#ssh.configuration) of the deployment instructions, make sure to run `ssh-keygen -t rsa`, rather than copy pasting the `ssh-keygen -t ed25519` as suggested. You'll hit issues with AWS key incompatibiliy during the Terraform stages later on if you don't.

## 4. Install the installation tools
Go through the [tool installation steps](https://documentation.suse.com/suse-caasp/4.2/html/caasp-deployment/_deployment_instructions.html#_installation_tools) to get Terraform and `skuba` installed on the Management instance along with the necessary configuration files (you'll need your trial registration code to complete these steps).

<figure>
  <img src="/img/blog/caasp-on-aws/packages-install-management.gif" alt="A gif of a terminal showing SUSE CaaS Platform packages being installed on the Management instance" class="fit image">
  <figcaption>SUSE CaaS Platform installation packages being installed on the Management Node</figcaption>
</figure>

> Note: `skuba` is the SUSE-built cli that wraps around `kubeadm` to simplify deployments and upgrades of kubadm-based clusters.

Once you've completed these steps you can navigate to the [AWS specific deployment instructions](https://documentation.suse.com/suse-caasp/4.2/html/caasp-deployment/_deployment_instructions.html#_deployment_on_amazon_web_services_aws)

## 5. Terraform
As instructed, fill out the values required in the `terraform.tfvars` file, and then run a `terraform apply` to spin up your infrastructure (you'll need your trial registration code for this step too).

You might need to install vim to make filling this file out easier, if that's the case do it with zypper
```
sudo zypper in vim
```
<figure>
  <img src="/img/blog/caasp-on-aws/terraform-apply.gif" alt="A gif of a terminal showing terraform commands running on the Management instance" class="fit image">
  <figcaption>Terraform being initialised and applied to create cluster infrastructure from the Management Node</figcaption>
</figure>

## 6. Do all cluster bootstrapping from the Master node
Seeing as the Worker nodes aren't assigned a public IP, and the Management instance is deployed to a different VPC than the Master and Worker nodes, I found that the easiest way to boostrap the cluster is from the Master node.

This means that your Master node will need to have ssh access to the nodes you intend to add to the cluster, it'll also need `skuba` installed to perform the bootstrapping.

### 6.1 Install skuba on the Master node
You'll need the `skuba` cli installed on the Master node to complete the bootstrap process.  Run the commands included in the ['Preparation'](https://documentation.suse.com/suse-caasp/4.2/html/caasp-deployment/bootstrap.html#_install_skuba) section to set this up. Here the `<PRODUCT-KEY>` is your SUSE CaaS Platform registration code. You will need to run these commands with root priveleges.

<figure>
  <img src="/img/blog/caasp-on-aws/packages-install-on-master-node.gif" alt="A gif of a terminal showing skuba being installed on the master node" class="fit image">
  <figcaption>Installation of skuba on the Master Node</figcaption>
</figure>

### 6.2 Use ssh-agent forwarding to grant the master node ssh access
Rather than copying over the private key from the Management instance, use `ssh-agent` forwarding to allow the Master node to use the local ssh-agent on the Management instance.

From the Management node run:
```
ssh -A ec2-user@myip
```

This will give you ssh access to the other nodes in the cluster, which is required for bootstrapping the cluster with `skuba`.

## 7. Complete the cluster bootstrap with skuba
Now it's just a case of [initialising your cluster](https://documentation.suse.com/suse-caasp/4.2/html/caasp-deployment/bootstrap.html#_amazon_web_services_aws_cpi), you can get your Load Balancer IP/FQDN from the terraform output on your Management instance, or directly from the AWS console.

Once your cluster's initialised you can [boostrap the nodes](https://documentation.suse.com/suse-caasp/4.2/html/caasp-deployment/bootstrap.html#cluster.bootstrap).

A couple of points to note:

- When running `skuba` on AWS the user will be `ec2-user`, not `sles`.
- When using the AWS cloud provider integration, the cloud provider has authority on node names and addresses, so you must boostrap and join nodes using their private dns.

So, your first `skuba` bootstrap command will look look like this:
```
skuba node bootstrap --user ec2-user --sudo --target <NODE_IP/FQDN> <NODE_PRIVATE_DNS>
```

Once you've joined all of your Master and Worker nodes to the cluster you're done! You should be able to see a happy cluster with `skuba cluster status`, and install and interact with `kubectl` commands to start deploying pods your cluster!

<figure>
  <img src="/img/blog/caasp-on-aws/kubectl-install-node.gif" alt="A gif of a terminal showing kubectl install on the master node and pods across all namespaces" class="fit image">
  <figcaption>Installation of kubectl with zypper and listing Pods across all namespaces</figcaption>
</figure>

For guidance on ongoing maintenance and administrative tasks associated with your SUSE CaaS Platform see the official [Administration Guide](https://documentation.suse.com/suse-caasp/4.2/html/caasp-admin/index.html)

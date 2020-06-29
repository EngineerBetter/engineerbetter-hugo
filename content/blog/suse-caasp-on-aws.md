---
author:  Jessica Stenning
date: "2020-06-29"
heroImage:
title: Deploying SUSE Containers as a Service Platform (CaasP) on AWS
draft: true

heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

The SUSE Containers as a Service Platform (CaasP) deployment on AWS recently went into technological preview (as of [version 4.1.2](https://www.suse.com/releasenotes/x86_64/SUSE-CAASP/4/#_deployment_on_aws_as_technology_preview)). I spent a few days going through the docs and deploying my own SUSE CaaSP cluster on AWS, here are my tips for a smooth deployment.

## What is SUSE CaaSP?
First off, what is SUSE CaaSP? As SUSE put it 'SUSE CaaS Platform is an enterprise class container management solution that enables IT and DevOps professionals to more easily deploy, manage, and scale container-based applications and services'.

It uses their Cloud Native Computing Foundation (CNCF) certified Kubernetes distribution; SUSE Linux Enterprise Server(SLES) 15 SP1 container OS; SUSE managed container image registry; Cilium for networking; Helm for package management; and custom tooling designed to simplify deployment, scaling, and maintenance of Kubernetes.

Take a look at the reference architecture for CaaSP 4.2.X [here](https://documentation.suse.com/suse-caasp/4.2/html/caasp-deployment/_deployment_scenarios.html#_default_deployment_scenario)

## Why would you want to use it?
To put it plainly, you're an enterprise organisation that wants to utilise the benefits of Kubernetes (reduced infrastructure costs, faster application delivery cycle times, all-round improvements to productivity and so on), BUT you're an _enterprise_ so you need a solution that will get sign off from the security team - a fully supported solution based on a robust container OS helps ticks those boxes.

Additionally, because SUSE's certified distribution of upstream Kubernetes utilises Kubernetes' features and API's, there's no unnecessary vendor lock-in.

## I'm sold, how do I deploy it on AWS?
_This blog post is based on the deployment of SUSE CaaSP on AWS, rather than any ongoing maintenance or administration_

The process to deploy on AWS is documented, but as mentioned earlier it's currently in tech preview, and there are a couple of caveats to getting it up and running quickly and successfully. The following steps have been written to be read _alongside_ the official SUSE documentation, not instead.

Docs for deploying SUSE CaaSP 4.2 can be found [here](https://documentation.suse.com/suse-caasp/4.2/html/caasp-deployment/_deployment_instructions.html#)

## 1. Register for a free trial of SUSE CaaSP
This is easily done via the [SUSE Website](https://www.suse.com/products/caas-platform/trials/MkpwEt3Ub98~/?campaign_name=Eval:_CaaSP_4), once you've gone through the registration process you'll be given a trial Registration code - keep a note of this as you'll be using it at various stages of the deployment process. A trial of SUSE CaaSP lasts 2 months.

## 2. Deploy a 'Management' workstation
Firstly you'll need an instance to bootstrap the entire deployment process. The initial deployment step for CaaSP on AWS utilises some SUSE-defined Terraform templates to spin up the infrastructure for your cluster. Before you can do that you'll need somewhere to run that Terraform _from_, and as the docs state it'll need to be running SUSE Linux Enterprise Server (SLES) 15 SP1 to install those packages.

As someone with no experience deploying or operating SLES, it took me a little while to work out the best way to spin up one of these instances to act as my Management instance.

When you register for your free trial of SUSE CaaSP you're given access to some downloadable material, some iso images for the SLES server with or without packages. I started out creating an instance of the SLES iso image on virtualbox to get up and running quickly. While this _technically_ worked, it was a bit painful to get things done, and I knew I wanted to look at automated deployments down the line so pivoted to using AWS instead.

### 2.1 AWS 'Management' workstation
While AWS offers a standard SLES 15 SP1 in its marketplace, it is (currently) not possible to add the CaaSP repos to this instance. This took me a while to work out, and as far as I can see, isn't currently documented.

So, while the first paragraph of the deployment docs states that you need a workstation running SLES 15 SP1 or equivalent, the 'standard' AWS AMI is not sufficient.

Instead, using my previous virtualbox deployment, I identified the AMI used in the terraform to deploy the Master and Worker nodes and used this AMI to create my Management workstation (currently `ami-020aaee0bf8836bf0`) - the docs state that you can run cluster bootstrap commands from the master node, so I took an educated guess that this AMI would have everything needed, and it did!

Again, this isn't documented as a supported method of implementation, but it was effective in my case.

## 3. Management SSH key
When creating the SSH key on your Management instance in the [first step](https://documentation.suse.com/suse-caasp/4.2/html/caasp-deployment/_deployment_instructions.html#ssh.configuration) of the deployment instructions, make sure to run `ssh-keygen -t rsa`, rather than copy pasting the `ssh-keygen -t ed25519` as suggested. You'll hit issues with AWS key incompatibiliy during the Terraform stages later on if you don't.

## 4. Install the installation tools
Go through the [tool installation steps](https://documentation.suse.com/suse-caasp/4.2/html/caasp-deployment/_deployment_instructions.html#_installation_tools) to get Terraform and Skuba installed on the Management instance along with the necessary configuration files (you'll need your trial Registration code to complete these steps).

_Note: Skuba is the SUSE-built cli that wraps around `kubeadm` to simplify deployments and upgrades of kubadm-based clusters._

Once you've completed these steps you can navigate to the [AWS specific deployment instructions](https://documentation.suse.com/suse-caasp/4.2/html/caasp-deployment/_deployment_instructions.html#_deployment_on_amazon_web_services_aws)

## 5. Terraform
As instructed, fill out the values required in the terraform.tfvars file, and then run a terraform apply to spin up your infrastructure (you'll need your trial Registration code for this step too).

You might need to install vim to make filling this file out easier, if that's the case do it with zypper
```
sudo zypper in vim
```

## 6. Do all cluster bootstrapping from the Master node
Seeing as the Worker nodes aren't assigned a public IP, and the Management instance is deployed to a different VPC Master and Worker nodes, I found that the easiest way to boostrap the cluster is from the Master node.

This means that your Master node will need to have ssh access to the other nodes you intend to add to the cluster, it'll also need `skuba` installed to perform the bootstrapping.

### 6.1 Install the `skuba` on the Master node
You'll need the `skuba` cli installed on the Master to complete the bootstrap process.  Run the commands included in the ['Preparation'](https://documentation.suse.com/suse-caasp/4.2/html/caasp-deployment/bootstrap.html#_install_skuba) section to set this up. Here '<PRODUCT-KEY>' means your SUSE CaaSP Registration code.

### 6.2 Use ssh-agent forwarding to grant the master node ssh access
Rather than copying over the private key from the Management instance, use `ssh-agent` forwarding to allow the Master node to use the local ssh-agent on the Management instance.

From the Management node run:
```
ssh -A ec2-user@myip
```

This will give you the ssh access to the other nodes in the cluster, which is required for bootstrapping the cluster with `skuba`.

## 7. Complete the cluster bootstrap with `skuba`
Now it's just a case of [initialising your cluster](https://documentation.suse.com/suse-caasp/4.2/html/caasp-deployment/bootstrap.html#_amazon_web_services_aws_cpi), you can get your Load Balancer IP/FQDN from the terraform outputs on the Management instance, or directly from the AWS console.

Once your cluster's initialised you can [boostrap the nodes](https://documentation.suse.com/suse-caasp/4.2/html/caasp-deployment/bootstrap.html#cluster.bootstrap).

A couple of points to note:
- When running `skuba` on AWS the user will be 'ec2-user', not 'sles'.
- When using the AWS cloud provider integration, the cloud provider has authority on node names and addresses, so you must boostrap and join nodes using their private dns.

So, your skuba bootstrap command will look look like this:
```
skuba node bootstrap --user ec2-user --sudo --target <NODE_IP/FQDN> <NODE_PRIVATE_DNS>
```

Once you've joined all of your Master and Worker nodes to the cluster you're done! You should be able to see a happy cluster with `skuba cluster status`, and install and interact with `kubectl` commands to start deploying pods your cluster!


[Placeholder for automated deployment section with concourse]

---
author:  Jessica Stenning
date: "2020-06-17"
heroImage: /img/blog/toy-car-sandbox.jpg
title: An Intro to the SUSE Cloud Application Platform Development Sandbox

heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

Over the past couple of days, I've been exploring the [SUSE CAP Developer Sandbox](https://www.explore.suse.dev/capsandbox/), a free-of-charge playground version of SUSE Cloud Application Platform (CAP), built atop SUSE Cloud Foundry and Kubernetes.

## Who's it for?

The SUSE **CAP Sandbox is for any developer that wants to experiment**, especially those that find their velocity is hindered by the processes of an enterprise engineering environment.

Let's say, for example, **you're an engineer at a large bank**. You have a **great idea for a new app** written in Python using Redis. However, **these technologies aren’t approved or supported by the business**, and the **approval process** itself is infamously **lengthy and arduous**. It could be weeks, even months before they're accepted, all the while your new app idea is left on standby. If only you had somewhere you could knock up a quick demo to show your boss...

**_Enter, SUSE CAP Development Sandbox._**

It took 20 minutes for me to go from registering for a SUSE account to viewing my first `cf push`ed sample app in the Stratos UI (see image below). I'm not new to the `cf` CLI or any of the Cloud Foundry (CF) concepts touched on in the intro page of the docs, but even if you are, it takes **a grand total of _two_ commands** before you can start pushing apps to your environment.

<img src="/img/blog/stratos-ui.png" class="fit image" alt="Stratos UI">

Broadly speaking the set up process is as follows:

1. Register for an account with SUSE
2. Use that account to register for the SUSE CAP Development Sandbox service
3. Download the `cf` CLI with your chosen package installer
4. Run `cf login` with your username and password

_That's it._

You don't need to be familiar with Cloud Foundry to get up and running quickly; **all of the `cf`
commands** you might need to **push your app, view logs, and bind it to services** are covered in a short **[set of docs](https://gettingstarted.cap.explore.suse.dev/cli/)**.

## How does it work?

When you register for the SUSE CAP Sandbox, what you're really doing is requesting access to a shared 'sandbox' instance of SUSE CAP. Each user that requests access is then allocated an isolated Org within the Sandbox deployment based on their username - you can see this yourself by running `cf target` once you're logged in with the `cf` CLI.

So, in this playground environment you're actually accessing a full SUSE CAP deployment (SUSE Cloud Foundry running on K8s with the Stratos UI), with some restrictions...

The Org quota allows up to 10 app deployments with a total requested RAM not exceeding 2GB, a maximum of **4 services (MariaDB, Postgres, Redis, and MongoDB** are available), and a total of 9 routes.

## What _don't_ you get?

Lastly, it's worth mentioning the features of SUSE CAP that you won't have access to in the Sandbox, largely these are features that either can't be implemented on an Org by Org basis, or are not feasibly applicable with a small quota:

* Auto-Scaling
* Custom Buildpacks
* User and Team Management
* Blue/Green deployments

### A quick word on blue/green deployments

> The docs state that blue/green deployments are not available in the Sandbox environment, I verified this by running a V3-push on my app instances (instances were stopped with downtime and then updated rather than executing a rolling update).

> You _can_ perform a blue/green deployment from the command line using this [cf-cli plugin](https://github.com/bluemixgaragelondon/cf-blue-green-deploy#bluegreen-deployer-plugin-for-cf), all this plugin does is automate the steps that you would perform if you were going to do a manual blue/green deployment: creating a new instance; mapping the existing route; and unmapping the route from the original instance.

> However, as mentioned in the previous section, the resources available in the Sandbox are limited, and considering the maximum number of routes and apps instances available, you'll find you quickly run into resourcing issues when performing blue/green updates on multiple apps.

## Getting Involved

As an individual developer wanting to build and test new things, you shouldn't miss any of the restricted features too much. That said, if you have a specific request or use-case that you'd like to be supported, you're encouraged to reach out on the [SUSE Sandbox forum](https://forums.suse.com/categories/sandbox-help-feedback).

You can **sign up** for the SUSE CAP Development Sandbox here: https://www.explore.suse.dev/capsandbox/

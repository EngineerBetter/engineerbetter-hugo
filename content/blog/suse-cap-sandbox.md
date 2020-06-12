---
author:  Jessica Stenning
date: "2020-06-12"
draft: true
heroImage: /img/blog/toy-car-sandbox.jpg
title: An Intro to the SUSE CAP Development Sandbox

heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

Over the past couple of days, I've been exploring the SUSE CAP Developer Sandbox, a free of charge playground version of the fully fledged SUSE Cloud Application Platform (CAP), built atop SUSE Cloud Foundry and Kubernetes.

## Who's it for?
The SUSE CAP Sandbox is for any developer that wants to experiment, especially those that find their velocity is hindered by the processes of an enterprise engineering environment.

You want to make some changes to your app, but you don't want to commit them to git just yet, you want to test in an environment without the 'it works on my machine' caveat, and you _really_ don't want to start building a k8s cluster to do all of that yourself.

**_Enter, SUSE CAP Development Sandbox._**

It took 20 minutes for me to go from registering for a SUSE account to viewing my first cf-pushed sample app in the Stratos UI. I'm not new to the `cf-cli` or any of the Cloud Foundry(CF) concepts touched on in the intro page of the docs, but even if you are, it takes a grand total of _two_ commands before you can start pushing apps to your environment.

Broadly speaking the set up process is as follows:
1. Register for an account with SUSE
2. Use that account to register for the SUSE CAP Development Sandbox service
3. Download the `cf-cli` with your chosen package installer
4. Run `cf login` with your username and password

_That's it._

You don't need to be familiar with Cloud Foundry to get up and running quickly; all of the `cf-cli`
commands you might need to push your app, view logs, and bind it to services are covered in a short set of docs.

## How does it work?
When you register for the SUSE CAP Sandbox, what you're really doing is requesting access to a shared 'Sandbox' instance of SUSE CAP. Each user that requests access is then allocated an isolated Org within the Sandbox deployment based on their username - you can see this yourself by running `cf target` once you're logged in with the `cf-cli`.

So, in this playground environment you're actually accessing a full SUSE CAP deployment (SUSE Cloud Foundry running on K8s and Stratos UI), with some restrictions...

The Org quota allows up to 10 app deployments with a total requested RAM not exceeding 2GB, and a maximum of 4 services (MariaDB, Postgres, Redis, and MongoDB are available).

## What _don't_ you get?
Lastly, it's worth mentioning the features of SUSE CAP that you won't have access to in the Sandbox, largely these are features that either can't be implemented on an Org by Org basis, or are not applicable with a small quota:
* Auto-Scaling
* Custom Buildpacks
* User and Team Management
* Blue/Green Deployments

As an individual developer wanting to build and test new things, you shouldn't miss any of those features too much. That said, if you have a specific request or use-case that you'd like to be supported, you're encouraged to reach out on the [SUSE Sandbox forum](https://forums.suse.com/categories/sandbox-help-feedback).

_Sign up for the SUSE CAP Development Sandbox here https://www.explore.suse.dev/capsandbox/_

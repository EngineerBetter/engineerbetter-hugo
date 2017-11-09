---
author: Daniel Jones
date: "2017-10-05"
heroImage: /img/blog/post-devops/post-devops.png
title: Post-DevOps - A Definition

heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

Post-DevOps describes a level of **maturity** that achieves **agility beyond traditional DevOps** by a **platform product team** providing a self-service, automatable platform which enables application product teams to perform all operational activities. Traditional **DevOps is still practiced** by both application product teams and the platform product team, above and below the 'platform line' respectively.

<!--more-->

## Benefits over traditional DevOps

* **Easier hiring and training**, as each group need know fewer technologies
* **Faster iterations** due to reduced coupling between apps and deployment
* **Quicker debugging** due to smaller problem space
* De-duplicated efforts - the platform is instantly reusable, as opposed to reinventing/sharing handcrafted deployment techniques
* All the things that are good about DevOps, **without the undifferentiated heavy lifting**

## What is Post-DevOps?

Post-DevOps is application product teams being responsible for the development and operations of their apps, deployed on a self-service platform that is in turn developed and operated by the platform product team.

## How does Post-DevOps work?

A self-service, automatable platform is provided by the platform product team. This platform has key features:

* Complete **lifecycle management of applications** (deployment, restarts, teardown, scaling)
* Lifecycle **management of services** (creating, binding, tearing down databases)
* Ability to view **logging, metrics and debug data** for applications

The **platform API forms the contract** between application product teams and the platform product team, and allows separation of the concerns of each.

'Above' the platform API application product teams practice DevOps in the traditional sense. They have complete ownership of their code throughout its lifecycle, including 'Day 2' operations and support. Their **operational activities are enabled by the platform**, abstracting away underlying technologies and allowing them to focus on their core competencies.

'Below' the platform API the platform product team actively **_develops_ the platform as a software product**, soliciting new features from users, test-driving the platform as code, performing continuous integration of changes and continuously delivering change to the production platform.

## How did we get here?

DevOps as a movement gained traction because it led to **more reliable software** that was **delivered more quickly**, and requires a way of working that is **more humane** and more satisfying.

DevOps as a term has been diluted beyond most meaning. Are you a system admin? Have you used Puppet? Congratulations, you now get a pay-rise and can call yourself _a_ DevOps! What is the collective noun for a group of folks that orchestrate Chef via Jenkins? That's right, it's _The DevOps Team_!

In all seriousness, we use the existence of "_the_ DevOps team" as a quick indicator of the level of maturity of businesses we work with. It's a sure sign that people need help focusing on true collaboration.

For the sake of this discussion we'll take DevOps to mean "the practice of being responsible for both the development and ongoing operation of applications."

In traditional DevOps application developers (either individually or as a team) gained responsibility for the operation of their apps: deployment, lifecycle management, issue diagnosis, and yes, out-of-hours support. This total ownership has a key business benefit: more reliable software due to having 'skin in the game' of operations. Additionally adopting DevOps becomes a forcing function for the immediacy of self-service, increasing the speed of delivery, the turnaround from live issue to resolution, and subsequently increasing the motivation and job satisfaction of engineers.

The first time I realised that there was something wrong with the notion of DevOps was whilst watching the fearsomely smart [Bethan Williams](https://www.linkedin.com/in/bethan-williams-09b57b4/) giving a talk citing a suggestion from Gartner that a company should either adopt DevOps _or_ a Platform-as-a-Service, but not both at the same time.

Upon hearing that idea, I was a little dismayed. "_Really?_" I thought. "_DevOps is clearly awesome. Are we really suggesting that we should just give people a platform, and go back to people chucking work over a fence?_" It gave me pause for thought.

If DevOps was no more effective than app developers caring only about writing code, would it have gained popularity? Quite simply, no. Our IT practices are driven by market forces, and what is most effective (eventually) wins. So **DevOps is not intrinsically better, even if its humane qualities make it feel that way**. It gives better results.

I think it's fair to say that in our ecosystem we've struggled with this dichotomy for a while. We know DevOps is good; we know platforms are good. It took the ever-insightful [Colin Humphreys](https://www.linkedin.com/in/colin-humphreys-80691322/) to nail the issue (many years _after_ starting a PaaS consultancy, may I add) with what I fondly refer to as "The Chumphreys Post-DevOps Quadrants." It's from this that our notion of Post-DevOps comes.

## Pre-DevOps

In the pre-DevOps world application **developers did the development**, and **system admins did the operations**. Progress was slow, no-one had complete ownership, and reliability was poor.

<img src="/img/blog/post-devops/pre-devops.png" class="fit image">

## DevOps

DevOps brought the unification of these two responsibilities into **one team, performing both application development _and_ operations**. This soon leads to cognitive overload within teams as they need to know an ever-larger tech stack, and becomes hard to scale. Often each team creates bespoke operational tools such as deployment scripts, and these become hard to share effectively.

<img src="/img/blog/post-devops/devops.png" class="fit image">

## A Platform with no DevOps

Introducing a platform and eschewing DevOps, which as I metioned earlier has been mooted by Gartner, leaves us in a situation that isn't a lot better than the pre-DevOps world.

We've got **big gaps where no-one is taking responsibility** for apps on day two, and the platform is likely not being developed into a more useful and powerful tool.

All we've achieved here is letting Pre-DevOps folks deploy things faster, and allowed unreliable apps to self-heal.

<img src="/img/blog/post-devops/platform-no-devops.png" class="fit image">

## Post-DevOps

A platform introduces two new responsibilities: **app operations** and **platform development**:

<img src="/img/blog/post-devops/post-devops.png" class="fit image">

Firstly the platform needs to be developed, extended, and maintained. It isn't a matter of hoping that someone else's platform works out of the box for you, it's performing integration and customisation. Similarly **it's not building your own platform from scratch**; rather it's treating the **platform as a product** and **listening to the needs of your users** (the app developers).

Secondly **the platform must offer developers the ability to manage the full lifecycle of their apps**, otherwise we're back in the bad old days pre-DevOps. App developers should be able to deploy, scale, restart, debug, monitor and get alerts from their apps, all via self-service.

Each group is now practicing DevOps within a smaller context, allowing more focus and intrinsically more re-usable code.

## Why Post-DevOps matters

Unless you're a DevOps consultancy, the primary **reason for your business existing is not to create deployment scripts**. Your business likely does something else, where software _embodies_ that something, and where functional, reliable, continuously-deployed software should be a given.

**If your business is handcrafting endless deployment scripts then you're diverting funds away from the reason your business really exists**. If your business is currently **employing ten DevOps Engineers to build their own platform** on their favourite container scheduler, then **it's wasting money reinventing the wheel**.

Your customers probably do not care _how_ the apps they use are deployed, only that they _are_ deployed; preferably with zero-downtime.

You wouldn't write your own database (unless you're Oracle). You wouldn't write your own hypervisor (unless you're vmWare). **Why would you write your own platform**, be it a PaaS or an elaborate mesh of CI jobs and infrastructure orchestration tools?

The **current connotations of the term DevOps focus us on the wrong problems** (especially the associated technologies). The original intention of the principle predates the ready availability of pre-built platforms. The world has changed, and we should change with it.

Post-DevOps gives us all the benefits of complete ownership, leveraging clear separation of concerns to allow engineers above and below the platform line to be more productive.
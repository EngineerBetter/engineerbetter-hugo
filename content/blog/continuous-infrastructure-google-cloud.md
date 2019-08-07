---
author: Daniel Jones
date: "2019-08-06"
heroImage: /img/blog/crayta.png
title:  Continuous Infrastructure on Google Cloud

heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

Recently we helped the folks at [Unit 2 Games](https://unit2games.com/) **automate the creation** of their **Google Cloud** and **Kubernetes** infrastructure by using Concourse and EngineerBetter's own best-practice approach to reliably deploying platforms.

{{% boxout %}}
"We've managed to take a huge step forward in our infrastructure automation with the help of EngineerBetter. Where our environments were once hand-crafted and fragile, they are now reliable, easy and flexible, and we're getting really confident with the tooling they recommended."

Tom Gummery - Senior Software Engineer at Unit 2 Games
{{% /boxout %}}

Before going into [how we worked](#how-we-worked) and [how we achieved this](#the-implementation), here's a summary of how Unit 2's pipelines now work:

* **All infrastructure is defined in code**, and deployed automatically for **complete auditability and reproducibility**.
* The **many production environments are defined as YAML**, and adding a new environment is as simple as making a Git commit.
* All infrastructure changes are tested in multiple environments _before_ a **canary deployment in production**, followed by a **rolling update**.

## How We Worked

Unit 2 Games are in the midst of making [Crayta](https://crayta.com/), and awesomely-powerful collaborative gameplay creation tool. Using the Unreal engine, Crayta offers collaborative game creation for all - think a much more advanced and aesthetically-pleasing Roblox.

The folks at Unit 2 need to be able to deploy rock-solid Kubernetes-based platforms for large numbers of users. As a Game-as-a-Service, these platforms need to be updated continuously whilst live game sessions are going on.

A global online game doesn't need just one monolithic platform - instead, multiple production environments are required in a number of geographies in order to provide low-latency to users around the world. Not only that, but due to the viral nature of such a social experience, the folks at Unit 2 need to be able to deploy new environments in new territories at a moment's notice.

{{% boxout %}}
"Mobbing over a remote video link turned out to be a effective way of skills transfer and education, whilst also building towards a real deliverable. It has been particularly easy to schedule these sessions in around other work, allowing us to maintain normal service while we develop improvements."

Tom Gummery - Senior Software Engineer at Unit 2 Games
{{% /boxout %}}

EngineerBetter always work collaboratively, so we used **remote mob-programming** to team up with Unit 2. We simultaneously helped build their infrastructure automation solution whilst sharing our experiences and educating their Kubernetes-savvy engineers in the ways of Concourse.

Unit 2 engineers booked out a meeting room, EngineerBetter dialled in via Zoom, and then we proceeded with usual mobbing rules - 10-minute turns on the keyboard, and you can only type something if someone else has told you.

Engineering days were not contiguous, and we'd spend maybe a few days a week collaborating in this way. This allowed the Unit 2 engineers to attend to other matters, and prevented us from getting remote-work fatigue. It also allowed ideas to percolate, meaning we got 'creative tunnel vision' less often.

## The Implementation

In this post we'll refer to stages of QA as _tiers_ - so think things like 'dev', 'staging' and 'production'. We'll call each freestanding and isolated instance of Unit 2 stack an _environment_.

The environments themselves consist of a few different elements:

* A containing GCP project for isolation
* GCS buckets for storing pipeline state
* Load Balancers, DNS and all the usual network gubbins
* A Kubernetes cluster
* GCP and Kubernetes service accounts
* Various Helm charts for things like Ingress

### Infrastructure as Code

As is always the case when we're pipelining platforms, everything that makes up an environment is made concrete in a Git repository.

A lot of this is Terraform, along with Kubernetes YAML, and the odd bit of custom scripting to glue things together. For example, we want our pipelines to be able to create the buckets they use to hold their state in which creates a bit of a chicken-and-egg problem, so we created [a reusable Concourse task](https://github.com/EngineerBetter/concourse-gcp-tf-bootstrap) to do this.

{{% boxout %}}
#### Why Not Just Terraform?

If we're using Terraform inside our pipelines, why not _just_ use Terraform? Why bother with Concourse at all?

Applying Terraform is a one-off process. We want our environments to adopt the latest patches, updates and security fixes. Concourse is the driver for that - as a 'continuous thing-doer', it's watching for upstream releases and then feeding those into Terraform and other tools.
{{% /boxout %}}

### The Same Code for All Environments

The biggest mistake we see experienced platform teams make when using Concourse is to have different pipeline definitions for production versus other environments.

If your production Infrastructure-as-Code is different to the tiers you tested in, then **your tests are not valid**. You are quite literally using untested code in production.

In order to have a cast-iron guarantee that production will work you need to be using the same assets all the way through, giving parity between tiers.

In practice, this means some sophisticated tricks with Concourse, such as either pipelines that set themselves, or pipelines that set other pipelines. This is explained later.

### Promoting Versions

<figure class="retain-aspect-ratio">
  <iframe src="https://www.youtube.com/embed/ae1c5XfJBDQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</figure>

Versions of components in an environment should **only be promoted if they are known to work together**. We need to integration test everything that goes into that environment, and then promote that _set_ of versions to the next tier.

The simple view of this is that the version of every resource (Git repo, Helm chart, BOSH release) that we're interested in is written to a YAML file upon completion of integration tests.

This file is then uploaded to S3, or committed to Git. This act of creating a new version of the file triggers the _next_ pipeline in the chain: so perhaps the `dev` pipeline writes a file that triggers the `staging` pipeline. _Only_ this set of versions is used in the subsequent pipeline.

### Canaries and Rolling Upgrades

<figure class="retain-aspect-ratio">
  <iframe src="https://www.youtube.com/embed/8A2S74xpqIE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</figure>

One production environment is the designated 'canary' environment. This is live, has real users, and is also the first of the production environments to deploy a new set of components. Only once this canary environment has been successfully updated do we consider upgrading the others.

The other production pipelines are configured to be triggered by updates to the versions file that has been 'promoted' by the canary pipeline. I use inverted commas as at this point we're already making live production changes.

In order to facilitate a rolling upgrade of remaining production deployments, we use the [Concourse Pool Resource](https://github.com/concourse/pool-resource). Each pipeline needs to acquire a lock on a member of the 'in flight' pool for its tier. If there are 10 production environments, then we have 2 members in this pool, meaning there's a 20% max-in-flight. Other pipelines will block waiting for a lock to become available.

### Consistency

Each pipeline is locked to only accept versions of resources that have passed previous pipelines. This means that there is every expectation that they should work, and if they don't, we're discovering something new about environmental differences.

There are additional consistency safeguards too.

Our pipelines set themselves. Every time the automation runs, it ensures that it is running with the latest _tested_ version of the automation itself, as well as the latest tested versions of all the other things that make up the platform. Novice Concourse usage involves developers setting pipelines 'by hand', which is error-prone and oft-forgotten.

Our pipelines are also atomic. We make further use of the Concourse Pool Resource to ensure that pipeline config can't be reconfigured halfway through a run. Without this, a pipeline could be 75% complete, a new run could be triggered, which would then update the runtime configuration of the pipeline whilst the prior run was still executing!

Addressing this consistency issue is of such importance that [setting pipelines is on the roadmap to become a first-class construct in Concourse](https://blog.concourse-ci.org/core-roadmap-towards-v10/#rfc-31-set_pipeline-step).

### On-Demand Production Environments

<figure class="retain-aspect-ratio">
  <iframe src="https://youtube.com/embed/tG8TilYioqo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</figure>

Environments in any tier are defined via YAML. In fact, what makes each environment unique is a set of parameters to the pipeline itself - so things like name, region, cluster size, and so on.

Adding a new environment is as simple as adding a new YAML file. How so? We have a 'meta-pipeline' that watches this Git repository for changes, and when it detects a new file, sets a new Concourse pipeline using the parameters in that file! Once the pipeline is set, it will automatically keep itself up-to-date via self-setting.

Of course, the meta-pipeline also sets itself in order to ensure consistency with the latest pipeline definition in Git.

## Bringing it Together

<img src="/img/blog/unit2-pipemania.jpg" class="fit image">

[You can expand the image for a full view](/img/blog/unit2-pipemania.jpg) of this rough design diagram.

Unit 2 Games already had a capable infrastructure automation team, and EngineerBetter were able to accelerate their progress towards having fully-automated GitOps-style infrastructure-as-code on Google Cloud.

The patterns that we use have been tried and tested in banking, fintech, security, publishing and now gaming. Our technical approach transcends IAASes, and once again mob-programming has proven a flexible method to both upskill and deliver.

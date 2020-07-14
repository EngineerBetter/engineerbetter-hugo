---
author: Daniel Jones
date: "2020-06-30"
heroImage: /img/blog/mirror.jpg
title: Continuous Everything in a Regulated Bank
heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
draft: true
---

Over the last year EngineerBetter have been working with Smarsh, introducing new ways of working that have enabled continuous deployment of 19 data services and 20 apps into a regulated investment bank in 10 weeks - and that was just the start!

## Smarsh

Smarsh produce an enterprise communications archiving product called, err, _Enterprise Archive_. It is used by thousands of big-name customers to help them meet regulatory requirements by storing sensitive communications in a secure and searchable way. Whilst Smarsh might not be a household brand, many of their customers _are_.

Smarsh have presences in Bengaluru, India; London, England; and around the United States. Whilst the majority of app developers are based in India, the folks deploying and running things are dotted around the globe.

Smarsh's Enterprise Archive product is available primarily as-a-Service, hosted by Smarsh. Given the nature of the product though, some regulated customers require it to be installed in their own datacentres and often in an airgapped environment - one where there is no communication possible to the outside Internet.

Smarsh's products deal with big data: messages are ingested at high rates, and stored in large volumes. There's a lot of processing and reporting that needs to be done, so it's not a surprise that there are wide variety of different technologies in use: Hazelcast, Storm, Kafka, MongoDB, Elasticsearch, and PostgreSQL, to name a few.

Enterprise Archive is the implementation of regulatory requirements, meaning it's performance and uptime are _serious business_. If this stuff isn't bulletproof, then customers could end up getting fined.

### Legacy Installations

Going back a long way, Smarsh's products were deployed manually by humans. Over time it became clear that automation would help, and like a lot of folks they adopted tools like Puppet and Ansible to help automate parts of the process. This partial automation was an improvement, even though it still required manual intervention and could take many weeks to set up the vast array of components required.

As the limits of tools like Puppet become clear, Smarsh adopted more modern cloud-native tools like Pivotal Cloud Foundry (now VMware Tanzu Application Service) and Concourse CI. These were used in different places for different purposes.

When EngineerBetter first engaged with Smarsh there were different deployment technologies used for part of the deployment process, but not all of it. Deploying the product involved numerous teams, with lots of coordination between them.

## Building Trust

EngineerBetter and Smarsh originally started working together to create Golang [Kubernetes operators](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) for the myriad data services that Smarsh need to run.

The original need changed. In the process of evaluating the effort required to write custom operators (upstream open source versions either didn't exist or didn't have all the required features) the folks at Smarsh looked at BOSH for the first time. They recognised that BOSH's lifecycle management already provided some of the more complicated issues that an operator would need to address 'for free'.

Instead, EngineerBetter went on to assist more generally, and to deliver instructor-led training on Concourse, Cloud Foundry and BOSH, on-site in Bengaluru. On a personal note, we certainly relished the chance to visit India, loved the food, and brought back awesome gifts for our families.

## Full Automation

Over the months that we worked together, Smarsh's ambitions for a fully-automated deployment system grew - something that we positively encouraged. We discussed how we could assist a team that would, for the first time, deploy _everything_ in the Enterprise Archive product automatically.

Our proposal was this:

EngineerBetter would provide three engineers and a backlog manager to form a team joining Smarsh folks from a variety of disciplines. We would operate from a single, ordered backlog prioritised by the Backlog Manager. We would remote pair-program to deliver and upskill at the same time. We would operate as a lean, eXtreme Programming team, doing the most important thing in the simplest way.

The team would integrate all the disparate components of the Smarsh product to be deployed via a single, monolithic Concourse pipeline dubbed the 'megapipeline'. This would invert Conway's law, provide a single-pane-of-glass view of deployments, and enable easier promotion of changes between environments. We would automate everything that was previously manual, find all the areas that needed changing in order to achieve this, and work around those whilst feeding back information to developers inside Smarsh.

## How We Worked

Our cross-functional team worked from a single, ordered backlog in [Pivotal Tracker](). Stories in this backlog are created and prioritised by the Backlog Manager, who ensures that each has clearly-defined acceptance criteria. Work isn't considered complete until the Backlog Manager has run through manual acceptance steps, which ensure firstly that things really do work, and secondly that the intent of the story was correctly communicated in the first place.

Each week the Backlog Manager would conduct a pre-IPM (more on IPMs later) wherein the technical lead (or 'anchor') on the team would give advice on whether the upcoming and unpointed stories in the backlog make sense to engineers, are in a logical order, and contain enough information to be estimated upon.

Typically at the beginning of the week an Iterative Planning Meeting (IPM) is held, facilitated by the Backlog Manager and attended by all engineers. The Backlog Manager goes through upcoming stories in the backlog, explains the desired outcome, and then asks the engineers to estimate the complexity of the stories in the abstract unit of 'story points'.

The IPM ensures that:

* the Backlog Manager and engineers have shared context
* upcoming stories are actionable
* engineers have discussed possible implementations, and any differences in understanding are exposed by their point estimates

Like most agile teams, the morning started with a standup meeting. Standups are one of the most oft-abused facets of agile practice, and we're very keen that ours do not fall into this trap. **A good standup should last no more than two minutes per pair**.

A standup consists of:

* Who did what yesterday? Is the work ongoing, or are you at a clean break?
* Is anyone blocked, and does anyone need help?
* Who is pairing together today?

A standup does _not_ feature tales of woe, becrying how awful yesterday went, or a blow-by-blow account of what the engineers did. We don't need this because we pair-program and rotate between pairs, and write status updates on stories at the end of the day.

We made use of [Pair.ist]() in order to better visualise who is working together, and what the tracks of work are.

As the Smarsh engineers we were pairing with in the morning were based in Bengaluru, we held all meetings using Zoom. In the morning we'd have a quick standup, and then after (our) lunchtime the Bengaluru folks would sign off, and we'd have another quick standup with the American Smarsh engineers.

When pairing, we'd use a combination of Zoom for screen-sharing and Visual Code Studio Live Share. The former allows full-screen screen-share and visual annotations, whilst VS Code Live Share allows multi-user editing of code and sharing of a terminal. In-person pairing would have been preferable as each of these tools has its quirks, but that wasn't really possible for an inter-continental team!

At the end of the week we'd hold an agile retrospective, again online using Zoom and Postfacto. Retros are vital for allowing the team to self-tune and improve, and also for folks to air grievances, show appreciation, and build empathy and trust.

## Technology Challenges


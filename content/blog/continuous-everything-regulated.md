---
author: Daniel Jones
date: "2020-10-01"
heroImage: /img/blog/smarsh/smarsh-deployed.png
title: "Engagement Deep-Dive: Continuous Everything in a Regulated Enterprise"
heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

Over the last year EngineerBetter worked with [Smarsh](https://www.smarsh.com/), introducing new ways of working that enabled **continuous deployment** of **19 data services** and **20 apps** across **multiple vSphere environments** in a **regulated financial enterprise in 10 weeks** - and that was just the start!

> "We needed people to not just speak about the 'right' thing or merely do it for others, we needed a team to partner with our engineers, model and teach the 'right' thing so that it became pervasive organizationally. EngineerBetter does just that and with an empathetic approach that had my teams eager to work with them more often."
> ### Kyle Campos - EVP Technology, Smarsh

In this blog post we'll talk about the **methodology** we used, the **technical implementation** and challenges, and what _we_ learned from the experience.

## Outcomes

We achieved the following outcomes through considered use of approach and methodology:

**A > 90% reduction in time-to-production**. Smarsh went from the effort of many teams over a period of weeks, to an automated pipeline that would run in around 4 hours. At the most absolutely conservative estimate this was a ~90% reduction in time-to-production, and an even greater reduction in human toil.

**Increased technical and methodological knowledge**. By pair-programming we were enable to upskill the customer's engineers _at the same time as_ delivering a system. Just as we learnt a lot on the engagement, Smarsh engineers got insight into Concourse, Cloud Foundry, BOSH, RSpec, and all sorts of other technologies. Even more importantly, by engaging using our methodology, we were able to educate folks in vital concepts such as TDD, lean decision-making, eXtreme Programming, YAGNI, package cohesion principles, continuous delivery, and more.

**Self-sufficient teams**. After nine months, Smarsh were ready for us to downscale the assistance we gave them. After a year Smarsh's engineers are developing and operating the system without our help, so we are no longer needed - you could say "our job here is done".

**One team that could deploy everything**. For the first time in the customer's history a single team owned the deployment process from beginning to end, reducing transaction costs, delays and communication overheads.

**Tested, promoted products**. The entire suite of software and infrastructure was tested and then promoted using our [Stopover approach to Concourse pipelines](https://www.engineerbetter.com/blog/pipeline-promotion/). We could be confident that changes would work before they reached higher environments.

**Reproducible environments**. Because everything was automated there were no unique 'snowflake' environments, making them easier to reason about. We regularly repaved test environments to ensure this reproducibility.

**Context-carrying between timezones**. Being located in Europe allowed EngineerBetter to be the conduit for context to pass from the India timezone to US timezones. Because we were a single team engaging in remote pair-programming, that context was transferred in a human-friendly manner, rather than passive-aggressive JIRA tickets.

**Making the implicit explicit**. Previously knowledge of the system had existed in a fragmented fashion, split between documentation and the human experience of various teams throughout the organisation. Instead, now we had one testable infrastructure-as-code pipeline that embodied all of that knowledge.

> "EngineerBetter certainly bring a high level of technical competency as their name would suggest, but where they help most is actually their ability to listen, adapt and accelerate cultural transformation."
> ### Kyle Campos - EVP Technology, Smarsh

## Smarsh

Smarsh produce an enterprise communications archiving product imaginatively named _[Enterprise Archive](https://www.smarsh.com/products/connected-archive/enterprise-archive/)_. It is used by thousands of big-name customers to help them meet regulatory requirements by storing sensitive communications in a secure and searchable way. Whilst Smarsh might not be a household brand, many of their customers _are_.

<figure>
  <img src="/img/blog/smarsh/enterprise-archive.png" class="fit image" alt="Enterprise Archive UI">
  <figcaption>Smarsh's Enterprise Archive. It remains to be seen if this is where the Captain's logs are kept.</figcaption>
</figure>

Smarsh have presences in Bengaluru, India; London, England; and around the United States. Whilst the majority of app developers are based in India, the folks deploying and running things are dotted around the globe.

Smarsh's Enterprise Archive product is available primarily as-a-Service, hosted by Smarsh. Given the nature of the product though, some regulated customers require it to be installed in their own datacentres and often in an airgapped environment - where there is no communication possible to the outside Internet.

Smarsh's products deal with big data: messages are ingested at high velocities, and stored in large volumes. There's a lot of processing and reporting that needs to be done, so it's not a surprise that there are wide variety of different technologies in use: Hazelcast, Storm, Kafka, MongoDB, Elasticsearch, and PostgreSQL, to name a few.

Enterprise Archive is the implementation of regulatory requirements, meaning it's performance and uptime are _serious business_. If this stuff isn't bulletproof, then customers could end up getting fined.

### Legacy Installations

Going back a long way, Smarsh's products were deployed manually by humans. Over time it became clear that automation would help, and like a lot of folks they adopted tools like Puppet and Ansible to help automate parts of the process. This partial automation was an improvement, even though it still required manual intervention and could take many weeks to set up the vast array of components required.

As the limits of tools like Puppet become clear, Smarsh adopted more modern cloud-native tools like Pivotal Cloud Foundry (now [VMware Tanzu Application Service](https://tanzu.vmware.com/application-service)) and [Concourse CI](https://concourse-ci.org/). These were used in different places for different purposes.

When EngineerBetter first engaged with Smarsh there were different deployment technologies used for part of the installation process, but not all of it. Deploying the product involved numerous teams, with lots of coordination between them.

## Building Trust

EngineerBetter and Smarsh originally started working together to create Golang [Kubernetes operators](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) for the myriad data services that Smarsh need to run.

The original need changed. In the process of evaluating the effort required to write custom operators (upstream open source versions either didn't exist or didn't have all the required features) the folks at Smarsh looked at [BOSH](https://www.bosh.io/docs/) for the first time. They recognised that BOSH's lifecycle management already provided some of the more complicated issues that an operator would need to address 'for free'.

So instead of writing Kubernetes operators EngineerBetter went on to assist more generally, and to deliver instructor-led training on Concourse, Cloud Foundry and BOSH, on-site in Bengaluru. On a personal note, we certainly relished the chance to visit India, loved the food, and brought back awesome gifts for our families.

## Full Automation

Over the months that we worked together, Smarsh's ambitions for a fully-automated deployment system grew - something that we positively encouraged. We discussed how we could assist a team that would, for the first time, deploy _everything_ in the Enterprise Archive product automatically.

Our proposal was this:

EngineerBetter would provide **three Engineers** and a **Backlog Manager** to form a team joining Smarsh folks from a variety of disciplines. We would operate from a **single, ordered backlog** of stories prioritised by the Backlog Manager. We would **remote pair-program** to **deliver and upskill** at the same time. We would operate as a **lean, eXtreme Programming** team, doing the most important thing in the simplest way.

The team would integrate all the disparate components of the Smarsh product to be deployed via a single, monolithic Concourse pipeline dubbed the 'megapipeline'. This would **invert Conway's law**, provide a **single-pane-of-glass view** of deployments, and enable easier promotion of changes between environments. We would **automate everything** that was previously manual, find all the code and processes that needed changing in order to achieve this, and work around those whilst feeding back information to developers inside Smarsh.

<figure>
  <img src="/img/blog/smarsh/smarsh-megapipeline.png" class="fit image" alt="Concourse UI showing a megapipeline">
  <figcaption>A deliberately-obscured view of the deployment megapipeline</figcaption>
</figure>

## How We Worked

Our **cross-functional** team worked from a **single, ordered backlog** in [Pivotal Tracker](https://www.pivotaltracker.com). Stories in this backlog are created and prioritised by the **Backlog Manager**, who ensures that each has **clearly-defined acceptance criteria**. Work isn't considered complete until the Backlog Manager has run through manual acceptance steps, a process that ensures firstly that things really do work, and secondly that the intent of the story was correctly communicated in the first place.

<figure>
  <img src="/img/blog/smarsh/product-team.jpg" class="fit image" alt="A product team">
  <figcaption>The Product/Backlog Manager writes stories that present user value, and engineers always take tasks from the top of the backlog.</figcaption>
</figure>

Each week the Backlog Manager would conduct a **pre-IPM** (more on IPMs later) wherein the technical lead (or 'anchor') on the team would give advice on whether the upcoming and unpointed stories in the backlog make sense to engineers, are in a logical order, and contain enough information to be estimated upon.

Typically at the beginning of the week an **Iterative Planning Meeting (IPM)** is held, facilitated by the Backlog Manager and attended by all engineers. The Backlog Manager goes through upcoming stories in the backlog, explains the desired outcome, and then asks the engineers to estimate the complexity of the stories in the abstract unit of 'story points'.

The **IPM ensures** that:

* the Backlog Manager and engineers have shared context
* upcoming stories are actionable
* engineers have discussed possible implementations, and any differences in understanding are exposed by their point estimates

Like most agile teams, the morning **started with a standup** meeting. Standups are one of the most oft-abused facets of agile practice, and we're very keen that ours do not fall into this trap. **A good standup should last no more than two minutes per pair**.

A standup consists of:

* Are you halfway through a story, or are you at a clean break?
* Is anyone blocked, and does anyone need help?
* Who is pairing together today?

**A standup does _not_ feature tales of woe**, becrying how awful yesterday was, or a blow-by-blow account of what the engineers did. We don't need this because we pair-program and rotate between pairs, and write status updates on stories at the end of the day.

We made use of [Pair.ist](https://pair.ist/) in order to better visualise who is working together, and what the tracks of work are. Pair.ist can also automatically recommend pairings, to ensure that folks rotate.

<figure>
  <img src="/img/blog/smarsh/pairist.png" class="fit image" alt="Example Pair.ist UI">
  <figcaption>An example of Pair.ist in action, showing who is working on track of work, but not individual stories.</figcaption>
</figure>

As the Smarsh engineers we were pairing with in the morning were based in Bengaluru, we held all meetings using Zoom. In the morning we'd have a quick standup, and then after (our) lunchtime the Bengaluru folks would sign off, and we'd have another quick standup with the American Smarsh engineers.

When pairing, we'd use a combination of Zoom for screen-sharing and [Visual Code Studio Live Share](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare). The former allows full-screen screen-share and visual annotations, whilst VS Code Live Share allows multi-user editing of code and sharing of a terminal. In-person pairing would have been preferable as each of these tools has its quirks, but that wasn't really possible for an inter-continental team!

At the end of the week we'd hold an **agile retrospective**, again online using Zoom and [Postfacto](https://github.com/pivotal/postfacto). Retros are vital for allowing the team to self-tune and improve, and also for folks to air grievances, show appreciation, and build empathy and trust.

<figure>
  <img src="/img/blog/smarsh/postfacto.png" class="fit image" alt="Example Postfacto UI">
  <figcaption>An example of a Postfacto retro board, in this instance that of the <a href="https://www.meetup.com/London-Continuous-Delivery/">London Continuous Delivery</a> meetup.</figcaption>
</figure>

## Technology Challenges

There were a number of technical challenges:

1. Deploying into an air-gapped and regulated environment
1. Bootstrapping the environment
1. Automating the deployment of a huge number of systems

### Challenge 1 - The Airgap

Systems inside the end-client's environment couldn't communicate with the outside Internet. Files could be transferred into the target environment via a SFTP syncing mechanism:

1. We upload files to Smarsh's SFTP server
1. Someone or something inside the enterprise writes a file to a special NFS mount
1. An internal system in the enterprise pulls files from the SFTP server
1. Files are now available on the internal NFS server

Of course being enterprise software there were more unexpected idiosyncrasies than this, but hopefully you get the idea. It gave us a basic mechanism by which to get files into the target environment, but it wasn't very continuous.

### Challenge 2 - Bootstrapping the Environment

Our starting point with the target environment was a collection of ESXI hosts, connected to switches that embodied a predefined network topology. That, and a virtual Windows desktop.

The Windows desktop had very few useful tools installed on it, and we didn't have administrator access.

### Challenge 3 - All The Stuff To Deploy

There was a huge amount of stuff that needed deploying:

* Apache Storm
* Zookeeper
* Kafka
* RabbitMQ
* PostgreSQL
* Hazelcast
* MongoDB Routers
* Elasticsearch, Logstash and Kibana
* More Kibana instances for reporting
* Docker Registry
* Minio
* NFS Server
* Mail relays
* HAproxy
* NGiNX
* Pivotal Cloud Foundry, with a few bonus tiles
* Integrations with DataDog
* 20 customer microservices

All of these needed hooking together, and had historically been configured manually. This meant that there were lots of interdependencies to unpick before things could be fully automated.

Whilst there weren't a lot of extant tests at our disposal, there were some full-system end-to-end tests that we could run to check that the entire system was working. They would take about an hour to run and test user-facing functionality, so whilst they give a great degree of confidence, they wouldn't give fast feedback and were not granular enough to allow fast debugging.

## The Implementation

Given the number of constraints in the engagement, the solution was rather complex. I'll do my best to break it down into intelligible chunks.

### Getting the First Files into the Airgap

First of all, we needed to be able to get files into the enterprise.

Our Concourse pipelines (detailed later) would upload tested assets to SFTP. To initially move the files, we'd need a human to trigger the manual sync process.

> <figure class="retain-aspect-ratio">
  <iframe src="https://youtube.com/embed/hoIESDrRuIE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</figure>

> Whilst Concourse automates the uploading of tested assets to SFTP, initially a human must trigger the sync process inside the enterprise.

### Bootstrapping an Automatable Environment

Now we could get _some_ files into the enterprise in a manual way, we needed to create API-driven systems inside the enterprise that could be automated.

We would be using BOSH to deploy and manage virtual machines in the target environment, which has plugins that allow it to talk to VMware vSphere, but not to ESXI hosts directly.

> ### Why not Kubernetes?
>
> It is of note that we were given hypervisors to work with, and at the time vSphere did not offer its Tanzu Kubernetes integration. Introducing Kubernetes would have meant an additional layer of abstraction for little additional benefit.

That meant that we needed to install vSphere, but writing scripts to do this automatically from a Windows machine with no access to MinGW or Git Bash was going to be painful. So we needed to create ourselves a Linux jumpbox with a useful set of tools on it.

> <figure class="retain-aspect-ratio">
  <iframe src="https://youtube.com/embed/FhV0oxy3b84" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</figure>

> We get a VM image into the enterprise manually, boot it, and then run a baked-in script to install vSphere, BOSH, Concourse and more. After this, a Concourse pipeline is set to automatically sync new files.

Once we had a useful Linux jumpbox, we authored scripts to run _on_ that jumpbox to deploy and configure VMware vSphere, giving us a usable IAAS. Further scripts then installed BOSH, Concourse, and Credhub using [Stark & Wayne's BUCC](https://github.com/starkandwayne/bucc) tool. But wait! It wasn't that simple, because we can't download the things when we need them inside the enterprise.

Everything that we needed to run from the jumpbox had to be baked into the VM image. As we continually found more things that needed adding to the jumpbox, we automated the creation of the VM image's `.ova` file in a Concourse pipeline running in Smarsh.

### Getting Files into the Enterprise Automatically

Once we had a Concourse running inside the enterprise, we could then use it to run automation to pull in new files and put them in a place that the main deployment pipeline would be able to more-easily consume them.

The 'sync' pipeline would trigger the SFTP-to-NFS sync, find new files, and upload them into the internal environment's MinIO buckets.

### Deploying Everything in a Megapipeline

Everything up until this point has been bootstrapping. We now had an API-driven IAAS in the form of vSphere, BOSH as a means of declaratively deploying things on that infrastructure, and Concourse to perform the automation.

We created a deployment 'megapipeline' that, given an IaaS, deployed _everything_. Absolutely every component that makes up Enterprise Archive was deployed by a Concourse pipeline some 7,000 lines long.

Whilst this approach is unwieldy, it has a number of benefits that make it worthwhile:

* **A single pane of glass**. There is one place to look to see if an environment is working, and less cognitive load on the engineers as Concourse makes visual all the dependencies between components.
* **Inverse Conway's Law**. By having a single code asset, we were _forced_ to work together in a cross-functional team. It would have been ridiculously ineffective to try having multiple teams maintain a single pipeline, and so we had to work together. This improved team dynamics, time-to-production and overall effectiveness.
* **'Stop the line' forcing function**. As per continuous delivery, kanban and the Toyota Production System, having a single monolithic pipeline meant that we _had_ to deal with failures immediately, otherwise other pairs would become blocked. Having a single deployment pipeline enforced good discipline, and also made it very easy to know what needed doing - in the mornings, if any box on the pipeline is red, then it needs fixing before we do anything else.
* **Simple promotion**. With one megapipeline it is clear when changes are safe to be promoted, and also allowed us to create a 'bill of materials' that showed _the exact version of everything_ that went into a working environment.

Of course, there are downsides. The pipeline was massive, and browsers struggled to render it on slower machines. Sometimes changes were being made that only took effect at the end of the pipeline, and so sometimes there'd be a lot of waiting to do.

We used a combination of the pipeline itself and the end-to-end tests to iterate on decoupling some of the bi-directional dependencies, and automating previously-manual steps.

## Testing

**Continuous deployment without testing is reckless**, and not acceptable in any context, let alone a regulated enterprise!

Everything that we created needed to be tested _before_ being attempted in the enterprise. This meant that we needed **automation to test the automation**.

### Testing the Bootstrap

The deployment pipeline deployed Enterprise Archive itself, but the preliminary bootstrap step was required - we needed to have VMware vSphere installed, and to have the likes of Concourse, Credhub, BOSH, Docker Registry and MinIO installed.

This was the job of the IaaS-paving pipeline, which also generated system-wide secrets, like TLS CA certificates.

The IaaS-paving pipeline performed the exact same steps as humans would do when they _first_ got their hands on the customer environment. The pipeline automated the creation of the jumpbox OVA image, deployed it to ESXI, then `ssh`d into the jumpbox to run the setup scripts that we had in source control. Once the test environment was successfully bootstrapped, we knew that we could promote the tarballs containing the OVA and the scripts across the airgap via SFTP.

An advantage of this approach is that the **IaaS-specific components can be swapped out**. Different IaaS-paving pipelines could be created for vSphere, AWS, Azure, Google Cloud, and if the interface was well-defined, the same deployment pipeline could be used 'on top'. In fact, later work we did with Smarsh worked on exactly this.

This approach also had the added advantage that we could automatically create and destroy test environments with ease.

### Testing the Deployment Pipeline

Once we had bootstrapped a test environment, it was straightforward to then run the deployment pipeline on the new test environment.

In order for the tests to be meaningful we would have to subject our test environments to the same restrictions as inside the enterprise, and to emulate the airgap.

> ### Concourse Resources
>
> Concourse uses custom plugins called resources that represent versionable _things_ in the outside world, such as Git repos, Docker images and files in an S3 bucket. These plugins tend to assume that they can establish connections directly to things like GitHub, which won't work inside an airgap.

We created 'fetch' pipelines _outside_ of the airgap that pulled the latest versions of resources (ie Git repos, Docker images, BOSH releases, PivNet tiles, jars from Artifactory) and wrapped them up as tarballs.

Concourse requires all things it gets from the outside world to be versioned for reproducibility. This meant that we had to make use of the Concourse [semver resource](https://github.com/concourse/semver-resource) to maintain monotonically-increasing version numbers for everything we fetched, which could in turn be written into the names of the tarballs.

The tarballed resources are uploaded to each environment's MinIO blobstore by the 'sync' pipeline (see below).

The fetch pipelines ran outside of a specific test environment, and their output (a bunch of versioned tarballs in an S3 bucket) could be shared by many environments.

> <figure class="retain-aspect-ratio">
  <iframe src="https://youtube.com/embed/-4MmX3hVztA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</figure>

> The 'fetch' pipeline tarballs assets that are needed, and puts them in an S3 bucket. 'Sync' pipelines in external non-airgapped environments copy files from S3 to the environment's MinIO, and 'sync' pipelines inside the airgap instead copy from NFS.

### Sync Pipelines

Whilst test environments _outside_ the airgap _could_ have reached out directly to the original data sources, that would have meant that the deployment pipeline we were building and testing would behave different inside and outside of the airgap. That would invalidate our tests.

We wrote variations of the sync pipelines that, rather than syncing files from NFS, would pull from S3 the tarballs placed there by the 'fetch' pipeline, and then put them into a test environment's MinIO.

## Things We Learned

Whilst we were briefed with upskilling the fine folks we worked with at Smarsh, we learned a whole heap of things too. The technical learnings are too numerous to mention (and some we'd rather forget, like how incredibly-not-cloud-native [Townsend](https://www.townsendsecurity.com/products/centralized-encryption-key-management) is), but here are some of the bigger lessons we learned:

* **Baby steps**. As outlined in [eXtreme Programming Explained](https://www.cs.odu.edu/~zeil/cs350/latest/Public/xprogram/index.html#principles) it's important to change one thing, test, and only then move on. On a couple of occasions we fell into the trap of thinking it'd be quicker to change many things at once, thinking the changes were simple and low-risk. Every time, it came back to bite us.
* **Humility**. I for one am guilty of speaking too much, assuming I'm right (I rarely am) and steamrollering conversations. Working with someone else's hugely complex software stack is a great reminder that there are lots of things that you don't know, even if you're a subject matter expert in certain areas. Within a week, I'd placed sticky notes on my monitor reading "LISTEN MORE" and "I MIGHT BE WRONG".
* **Backlog management is hard** for this sort of work. When you're working on a new product, it's easier to formulate a backlog that clearly expresses user value, as that value can be built and delivered in thin vertical slices - feature by feature. When working with an extant product with a huge amount of functionality, it's very hard to do this. Either the whole thing works, or it doesn't. So backlog management inevitably subverts the product management process, and it's easy to lose sight of the real end user. Additionally the activities that need to be performed are very fluid, based on technical surprises. We always expressed work in value statements so that it was clear _why_ we were doing things, but the backlog needed rejigging several times a week.
* **Remote pairing all day is hard**. A full eight-hour day of remote pairing is incredibly draining. High-quality headsets with noise-cancelling microphones (_not_ noise-cancelling for the listener!) for all participants are a necessity. When remote pairing breaks tend to be less organic, and so use of a [pomodoro timer](https://en.wikipedia.org/wiki/Pomodoro_Technique) really helps.

## How Can We Help You?

Do you need to **improve your time-to-production**, increase quality, decrease time-to-recovery all whilst upskilling your staff?

Do you have **large, complicated infrastructure** endeavours that you would benefit from **treating as software** projects?

Do you have capable staff who would benefit from an **extra set of hands** to enact a **cloud transformation**? Do you want to **combine training and delivery**?

As shown above, EngineerBetter have experience in achieving great outcomes in highly-constrained and less-than-ideal circumstances. If you need similar outcomes, maybe [you should get in touch](mailto:contact@engineerbetter.com).

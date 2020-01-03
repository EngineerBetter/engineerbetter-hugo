---
draft: true
author: Daniel Jones
date: "2020-01-06"
heroImage: /img/blog/devops-team-must-die.png
title: Kill the DevOps Team
heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

The DevOps Team must die.

The continued existence of _The_ DevOps Team allows the misguided, the lazy and the dishonest to feign positive change under the covers of IT-meme buzzword compliance.

>>>
### Inside a buzzword-compliant enterprise...
* _Are we agile?_ Check! We have sprints planned for the next three months!
* _Do we have a Kubernetes strategy?_ Check! Apparently we need just one more month and then it'll be in production.
* _Are we DevOps?_ Check! We've hired a bunch of DevOps Engineers to work in a siloed team to write YAML and run Ansible playbooks.

The DevOps team is an all-too-common anti-pattern, co-opting a virtuous term of good practice in order to convince the C-suite that they're at the cutting edge of buzzword bingo, when in reality  responsibilities and culture linger on from previous decades.

If you have a team called "_The_ DevOps Team", then we can be sure as damnit that you're not actually practising DevOps, and the chances are that you're doing _the exact opposite_.

## _Actual_ DevOps

Now we've got the provocative click-bait opening out of the way, let's define what DevOps _actually_ is:

> You write it, you run it, you get woken up at 4am by it.

This is why it's nonsensical when recruiters send me profiles of "DevOps Engineers" who haven't ever written an application. Folks, please stop doing that.

<img src="/img/blog/post-devops/devops.png" class="fit image">

A more precise definition of DevOps might be:

> DevOps is a practice wherein a single cross-functional team is responsible for the entire lifecycle of an application or service, taking it from creation to operation and support.

So, before we get into defining what DevOps is _not_, let's briefly summarise its benefits.

### What DevOps Makes Better

_Actual_ DevOps leads to increased flow efficiency, reduced time-to-market and higher quality for a number of reasons.

The interests of those writing the software and running it are aligned, because they are the same people. Developers are much more diligent about quality and operability when they are the people that get woken up at 4am in the event of an outage.

As well as aligned interests, this single team that both writes and runs the software has a [shared identity, meaning they care more about each others' problems](https://www.engineerbetter.com/blog/anthropic-sympathy/).

There are no communications boundaries, reducing the transaction cost of change. Instead of communication hops introducing latency into the value stream (think about raising a service ticket and waiting for another team to do a thing), communications are likely synchronous if they're needed at all.

> Case in hand - as I write this, one of our engineers lamented to me that a customer application needs to be provided some encrypted data before it will start cleanly. In order to _generate_ this encrypted data, you need to run the app that needs it in the first place, and hit a certain endpoint. So one has to deploy the app, watch it be marked unhealthy, trigger the endpoint, reconfigure the app with the encrypted value, and then restart it. I don't think [the 12 Factors](https://12factor.net/) specifically called out this use case, but I'm pretty sure that **if the app developers were the people deploying it then they might have figured out a less manual solution**.

## NotDevOps

How many of the following **signs of NotDevOps** can you spot at your organisation?

* A team exists called "The DevOps Team"
* There is a job title of "DevOps Engineer"
* 'The DevOps Team' does not write the applications running in production
* 'The DevOps Team' does not get paged at 4am when something goes wrong
* App development teams have to ask 'The DevOps Team' to do things for them

If you counted one or more of the above, then commiserations: you're doing NotDevOps! On the up side you're not alone, given the [thousands of job adverts for "DevOps Engineers"](https://www.itjobswatch.co.uk/default.aspx?q=DevOps+Engineer&l=&id=0&p=6).

Back in ye olden days, we used to call these people Systems Administrators, or perhaps Config Management. They were the folks who knew stuff about Linux and who got your code into an environment. These days, **if you're a SysAd who knows Puppet/Chef/Salt/Ansible/kubectl**, then congratulations are in order - **you're now _a DevOps_** and as a result you get a 50% pay rise!

As alluded to earlier, folks that _are_ actually developing the applications **shouldn't have to ask** someone else to:

* Create a CI pipeline/Jenkins job
* Create a Git repo
* Build a Docker image from their code
* Deploy their code into an environment
* Get logs from a running instance

If they do have to ask for these things, then guess what? **NotDevOps!**

If you're practising NotDevOps, your employer doesn't get the benefits that they think they are. You're lying to the C-suite who _think_ you're doing this cool thing they've heard about, when actually it's the same playbook with differently-named teams.

This is worse than just _not_ doing DevOps - you're creating a blind spot for the people that pay for your expertise, and ruining the reputation of those who _are_ doing the right thing by abusing the terminology.

>>>
The superbly intelligent and thoughtful [Matthew Skelton](https://www.linkedin.com/in/matthewskelton/) of [Conflux Digital](https://confluxdigital.net/) has gone into a lot more detail in defining the various ways of doing NotDevOps, handily summarised in [a list of DevOps Anti-Types](https://web.devopstopologies.com/#anti-types). Matthew more importantly co-authored [Team Topologies](https://www.amazon.co.uk/Team-Topologies-Organizing-Business-Technology/dp/1942788819/) which will tell you how to structure teams to achieve great flow efficiency.

EngineerBetter are often asked to help organisations figure out how to deliver value faster. One of the most frequent inhibitors of value delivery is poor flow efficiency - more time is spent waiting rather than working. Separating the development and operations activities into different silos is a common cause of these waits. To then name this team by abusing the very term that should fix the issue is salt into the wound!

## So, should we actually kill them?

No. (Unless they're time-travelling robots sent from the future to slow human productivity whilst artificial intelligence beavers away on becoming sentient and enslaving the human race, in which case I'd argue that more assertive action may be justified.)

Let's kill the notion of _The_ DevOps Team.

Let's **stop calling them The DevOps Team**.

Let's stop _pretending_ we're doing a thing, and instead enable people to _actually_ do the thing.

And if you can't do that, then **stop lying to yourselves** and to the people that pay your wages.

## I've already got a DevOps Team - what do I do now?

Let's ensure that those people are **enabling self-service of developers** by building reusable automation.

_The Team Formerly Known As The DevOps Team_ (TTFKATDT - catchy huh?) should not be doing transactional, one-off, 'business as usual' work.

They should be **building an internal product that gives developers self-service**. In this model TTFKATDT are **_enabling_ true DevOps** to be performed by the app developers, giving them the tools they need to operate their applications in production: logging, metrics, lifecycle controls, the works. [We've written about this 'Post-DevOps' model in greater detail in the past](https://www.engineerbetter.com/blog/post-devops/).

<img src="/img/blog/post-devops/post-devops.png" class="fit image">

TTFKATDT don't do fire-and-forget tasks for app developers. They solicit requirements from app developers, and form them into a product backlog. They play stories from this backlog, building **automated and reusable solutions** that allow developers to perform operations tasks. They are making a permanent product, not satisfying ephemeral service tickets.

At EngineerBetter we would choose to call TTFKATDT a **platform team** - although I think the industry is approaching the point at which terms like "platform" along with "service" are being diluted beyond all meaning.

To pre-empt responses to this article - if you _do_ have a 'DevOps Team' that is doing the good things outlined above, then why are you calling them a 'DevOps Team'? Surely they should be named after the product they deliver?

## In Summary

Look beyond the buzzwords and the trends, and understand the terms being used. No amount of expensive DevOps Engineer contractors will improve your value delivery if the organisation isn't focusing on removing wait times and reducing lead-time-to-production.

If you need help delivering value faster, then [get in touch with us at EngineerBetter](mailto:contact@engineerbetter.com). We can use systems thinking techniques to understand your development practice, ascertain the [current reality of the organisation](/blog/current-reality-trees-fog-of-war/) and identify ways to start removing the blockages.

In the meantime, can we all stop using terms incorrectly, and stop suggesting that we're doing virtuous things when we are not?

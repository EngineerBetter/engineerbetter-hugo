---
author: Daniel Jones
date: "2017-09-15"
heroImage: /img/blog/mobbing-window.jpg
title: Intensive, Immersive Training with Mob Programming
---

EngineerBetter recently had the pleasure of delivering a novel training course that **bridges the gap between** the one-to-one mentoring of **pair-programming**, and the more scalable one-to-many knowledge transfer of an **instructor-led training** course.

## Challenge

* Take 6 factory engineers from a global manufacturer with some experience of assembly, C, C# and Visual Basic.
* In **only five days** have them deliver **12-Factor** apps written in Java Spring Boot/JavaScript Node that ingest, store and visualise **IoT data**, and is under **version control**, **test-driven**, built using **BDD** stories, and **continuously deployed** to **Cloud Foundry**
* The above are all things the **developers had never done before**
* Achieve the above with only two folks from EngineerBetter

Did our students achieve their goal? Of course! So how did we help them do it?

<!--more-->

Before we take any credit, I need to point out that working with these folks was an _absolute pleasure_. They were bright, motivated, enthusiastic, and keen to learn.

## Preparation

The students decided what it was that they wanted to build. This meant that they would be working on something meaningful to them, in a domain that they were familiar with.

Ahead of their arrival, we expressed their ideas as stories in a backlog, taking care to make sure that we struck a balance between delivering their desired app whilst still covering all the learning outcomes.

<img src="/img/blog/mobbing-stories.png" class="image">

## Mobbing

The key to transferring so much knowledge was our use of **mob programming**. Whilst the first day mostly consisted of orientation, covering the wide range of tools and techniques we’d be using, by the afternoon we split into two mobs: three students, and one EngineerBetter team leader. From then on, it was coding all-the-way.

<img src="/img/blog/mobbing-in-room.jpg" class="fit image">

Each team occupied their own room, with a single computer, mouse, keyboard, and one very large screen.

In the mobbing process, one team member is appointed '**driver**', and the rest of the team act as '**navigators**'. The driver’s job is to do exactly as instructed by the navigators, who do the decision making. **Every ten minutes we rotate** the role of driver, meaning everyone gets lots of keyboard time.

That the driver can only follow instructions means that **every implemented idea must be vocalised**. In order to get some code written, someone has to say something, thus allowing the team to discuss it. The driver is of course allowed to have ideas, but they’re not allowed to put them into the code without getting a navigator to tell them to - again, forcing discussion. This process **makes all decisions transparent** and explicit, and **every member** of the team **is part of the thinking process**.

<img src="/img/blog/mobbing-java.jpg" class="fit image">

Each of our teams worked from an **ordered backlog** in Pivotal Tracker, which is exactly how we work and exactly how we recommend that product teams work. The backlog was populated with stories created ahead-of-time from the customer’s requirements, in the form “As a factory owner, I can see the data dashboard” with step-by-step acceptance criteria. The students were enthused about this aspect of our working practice - they were excited that clearly stating a thing that a user can or cannot do as a small batch of work would make for big improvements on their prior model of working from long, wide-ranging requirements documents.

## Benefits

By working on a real set of apps **our students were constantly exposed to the ‘core loops’ of sustainable development**, repeating fundamental practices in a way that we’re sure they’d remember them. Write the test, run the test, write the code, repeat; git add -p, git commit, git push; YAGNI-thinking when making engineering decisions; the list goes on.

Another benefit of delivering actual apps instead of traditional slide-based training was that **we encountered real problems**. Both teams hit obscure issues with their frameworks, which gave the students an insight into what experienced engineers do in such circumstances.

## Results

**Both teams created continuously-delivered apps** (a data service and a web UI) that ingested IoT data and displayed it in JavaScript charts. Admittedly the features were fairly bare-bones, and one team got further than the other. Regardless, it was a massive achievement of the students to get this far.

They left with working apps deployed on Cloud Foundry, code in GitHub, and a CI pipeline running on Concourse. All of these could then be demonstrated upon the students' return to their workplace.

Did our students come away as fluent, self-sufficient cloud native developers? Absolutely not, and that was never the intention. We inundated them with information, which they were excited to take back to their workplace. If they remembered as much of 20% of what they experienced, then they’ll have done very well - but recall isn’t the point of this type of training.

Intensive immersive training is about **enthusing students**, giving them the **confidence** that comes from having done new things ‘for real’, **exposing them to the breadth of what they don’t yet know**, and showing them a **holistic way of working** that is more than the sum of its parts.

We can’t credit our students enough. They worked hard every day, swimming hard when their feet couldn’t reach the bottom. We took them out of their comfort zones, and they rose to the challenge admirably with a great work ethic and boundless curiosity.

The students covered a vast array of material:

* Node and npm or Java, Spring Boot and Maven
* Writing BDD specs, and Jasmine or JUnit
* Git on the CLI, patch-adding, committing, pushing, and even interactive rebasing
* Sustainable engineering - doing the simplest thing, managing technical debt
* Small, incremental changes for continuous delivery that don't break the build
* Concourse CI
* Pivotal Tracker, how to write stories, and the differences between stories, bugs and chores
* Pushing apps to Cloud Foundry
* CORS
* Bootstrap and Chart.js

## The Future

We stressed the importance of continuous learning in sustainable engineering, and _we_ learnt from our students too. In our next intensive, immersive training course we'll be running 'show and tell' sessions at the end of each day so teams can compare notes.

At EngineerBetter we're really excited to deliver more of this intensive, immersive training. We can see great potential for giving experienced enterprise developers a shot-in-the-arm, giving them the confidence to lead the charge in larger digital transformations.
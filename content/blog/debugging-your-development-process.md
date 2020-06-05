---
author: Daniel Jones
date: "2020-06-30"
heroImage: /img/blog/tug-tanker.jpg
title: Debugging Your Development Process
heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
draft: true
---

By debugging your development process as well as your technology, you can deliver features into production more quickly, safely and often. By performance-tuning your organisation, you can be more productive without having to increase headcount. In this post we'll explain the Organisational Healthcheck service that EngineerBetter offers, and how it can help you to achieve better outcomes.

Over the course of this post, we'll talk about some of the tools we use from Liberating Structures and Systems Thinking, and give examples from customer case studies.

## Who is this for?

EngineerBetter have worked with Developers, Development Managers, and CTOs to help software delivery in a number of ways. The service scales from helping individual teams over a few days, to helping continent-spanning departments over weeks and months.

We've helped global corporations address poor lead-time-to-production and low staff morale. We've also helped experienced tech leaders in new positions and new organisations by holding a mirror up to their departments, identifying the practices that they should double-down on whilst also pointing out previously unidentified improvements.

## What is it not?

This process isn't a maturity model, or a bunch of tickboxes. With each and every customer we take the time to understand their people, processes and purpose in great detail. We involve their staff in the journey, and guide them to discover and implement the solutions that only they, as subject-matter experts, can identify.

## Steps in the Development Reality Check

We'll briefly go over each of the common steps in the process, before talking about them in more detail.

Customers invite us in to perform detailed fact-finding exercises, so that we can truly understand how development there works - not how it _should_ work, but how it _actually_ works. A key component of this is individual **interviews with staff**: engineers, testers, product managers, project managers, leaders, and anyone else we can get our hands on.

As well as speaking to individuals in private, it's vitally important that we use **group facilitation** techniques to crowd-source the details of problems and solutions in a fun and engaging way. Activities like this are great for off-site meetings, or internal tech conferences. This approach has **significant benefits to staff engagement** that should not be underestimated, and will be explained in more detail later.

Either as part of the interviews or the group sessions, we build a **value stream map** that plots the course that an idea takes from conception to production, how long it takes to flow through those stages, and at what stages it can revert to an earlier stage. This alone is often an enlightening exercise, with people surprised at how long even the best case is for getting changes into production.

Once we've found out as much as we can, our engineering consultants go back to carefully construct a **Current Reality Tree** (CRT). This causal diagram is like '5 Whys' on steroids - it maps out undesired symptoms, the chain of intermediate causes, and root causes of these problems. The CRT is an invaluable tool in understanding not only the state of the development process as it stands, but also the inter-relatedness of issues and the feedback loops that exist between them and that are responsible for preventing the system from improving. Most importantly, it presents the issues in context so that the customer can clearly see which remedies are quick and temporary fixes, and which are large but permanent solutions.

Whilst the CRT is the heart of understanding the organisation that we're helping, a traditional **report is produced** to provide a narrative to the model, along with a description of each of the problems and causes, and most importantly a **full set of remedies**. We pride ourselves on identifying as many remedies as possible, in order to give the customer choice. We can't possibly help with all of them, and we see it as a matter of credibility that we'll recommend things that we can't help with. Almost all remedies will require the customers' engagement, and some remedies are actionable by the customer alone.

The report and CRT can be a lot to digest, so we deliver them alongside a **presentation** to go through key findings and recommendations. We encourage those present to challenge the assumptions we've made, and debate our findings.

Inevitably folks need time to digest our findings, and to decide which of the menu of remedies they'd like to enact. **Follow-on work** may involve EngineerBetter, or it may be something the customer either can or _has_ to tackle on their own. With our customers we identify **key metrics** to measure, track and improve upon, in order to ensure that they can double-down on successful experiments, and avoid repeating unsuccessful ones.

### Interviews

We arrange to meet folks face-to-face for chats that can vary between 30 minutes and a few hours. It's important to let folks know that we won't be passing on specific comments, and that everything said is done so in the spirit of trying to make the organisation better. People giving us their time and their honest thoughts need to know that they're in a safe space.

These chats don't _have_ to be on-site. Whilst being in-person helps with non-verbal communication, video calls work nearly as well. We've had experience of this when working with international teams all contributing to the same codebase.

Speaking to either like-minded groups or individuals seems to work best, as folks are then more candid with their feedback. That said, in sessions where there have been disagreements in the room we've seen viewpoints get exchanged for the first time, leading to increased levels of understanding.

Whilst there are standard questions that every interview features, we make the conversations as natural and free-flowing as possible. Often we'll want to dig into areas that came up in earlier interviews, slowly piecing together a puzzle of the course of many chats.

Typical questions include:

* How does work arrive in your team?
* What gets in the way of your team being successful?
* If you had a magic wand, what one thing would you fix?

Copious notes are taken - in the last two such engagements, I clearly remember exhausting a fresh ball-point pen!

Typical comments from interviewees are something like "this is really cathartic," "I feel so much better just having someone ask the questions and listen to my answers," and unsurprisingly "this is great - it's like organisational therapy! Can you come again next month?"

### Group Facilitation

Group facilitation might take one of many forms, often one of the Liberating Structures such as 1-2-4-All. The intention is to get _everyone_ together, especially those from different teams who might not speak that often.

The exercises are deliberately fun and high-energy - my experience as a martial arts instructor certainly helps with running around the room occasionally bellowing instructions! We invite everyone present to think and share ideas about what isn't right, and what _they_ could do in order to make things better.

There are three key benefits to this approach.

**Ideas come from the experts**. A bunch of consultants are _never_ going to understand an organisation as well as those living in it. Sure, we might have outside perspective, but there will inevitably things that only those working in an organisation can bring to the conversation.

**Empathy is built between individuals**. It's one thing to know that the people that submit service tickets aren't happy with your team, but it's something quite different to see the people behind the GitHub usernames on the pull requests that go unreviewed. Speaking face-to-face invokes pro-social instincts that cause criticisms to be more level and balanced, and feedback to be listened to with more understanding.

**People start the improvement journey**. We invite folks to think of one small thing thatthey could do tomorrow, without anyone's permission, to make things better. No only does this start moving the needle, but the crowd-sourcing of ideas means that people are already drawing the same conclusions that are likely to appear in the report that EngineerBetter provide. Rather than some detached consultancy dropping a report that says the company should adopt the Spotify model, the people involved were part of the journey and know that they'll be part of the solution. They've had a glimpse of how things could be, and what the way forward is - so they feel less threatened when changes to the status quo are later suggested.

### Value Stream Mapping

Either as part of the interviews or the group facilitation (sometimes both!) we build a value stream map. This details all the steps that an idea takes on the way from someone's head to production. Each transition is labelled with a probability distribution of how long it takes to get to the next stage. We also identify points where work can go backwards (eg. "QA rejects the release"), with a rough probability of how often this happens.

The value stream map then gives an upper and lower bound for how long it takes to make changes, otherwise known as the **lead-time-to-production**. This is a key metric for agility in a competitive marketplace, and evermore importantly for developer morale. Increasingly we're seeing business struggle to retain the best engineers when they become frustrated and not seeing the fruits of their labour.

The value stream map can also help us to calculate **flow efficiency**, or the ratio between time spent working versus waiting. Low flow efficiency is indicative of a wasteful development process that spends cash ensuring everyone on the boat is busy paddling, without checking that they're all paddling in the same direction.

It's crucially important to investigate the value stream before coding starts. It's often here that we uncover issues in the product, project and programme management practice. How is work formulated? Is quality defined as a feature? Are these stories actionable?

### Current Reality Tree

[We've blogged about Current Reality Trees before](/blog/current-reality-trees-fog-of-war/). They're a crucial tool in understanding the complexity of the organisation and for explaining this in a way that is simply impossible in a linear written report. We use all the information that we've gathered so far to build the causal model that underpins the CRT.

Each box on the diagram represent either an undesired symptom (it takes too long to get changes into production), an intermediate cause (CI pipeline takes too long), and a small number of root causes (the organisation incentivises hero culture). The boxes are linked by arrows of causation - an arrow going from one box to another represents a cause (from) and effect (to).

Sometimes the causal links form feedback loops. They might be tight in scope, such as _Code is hard to test_ and _Developers don't believe in TDD_. Other times these loops span the entire diagram, wherein they reveal the forces that keep the organisation in its current rut: _Throughput of the department is neither known nor visualised_ causing _Unbounded amounts of work enter the backlog_, which through a series of intermediate causes means that no-one has the time to visualise the throughput capabilities of the department.

It is of great importance that the CRT represents _a model_. This means that it is refutable - if we've made an incorrect assumption, then a part of the diagram can be changed, and folks can then see which other assumptions might be incorrect. Because it represents a model, our reasoning can be checked and verified. Whilst it's out of scope of this article, I'd love to investigate using [Judea Pearl's causal calculus](https://link.springer.com/chapter/10.1007/978-1-4612-2404-4_3) to present these models more formally.

It tends to be the case that root causes (especially those that are part of a feedback loop) are daunting to change. Those near the top are often much simpler to address, often as quick fixes that will have immediate but limited impact. The CRT presents issues in full context, giving our customers the ability to decide how much change they're willing to sustain in order to fix an issue. EngineerBetter might recommend one thing, but perhaps the customer has political reasons we're not privy to for wanting to avoid certain changes.

The CRT is visual and engaging. When we present our findings we often bring a CRT printed on A1 or A0 paper, stick it to a wall, and invite everyone to gather around.

### Report

Whilst the causal model that underlies the CRT is the most important output of the process, the CRT benefits greatly from summarisation and narration in a traditional written report. Naturally this can be a bit tricky given the inter-related nature of the issues, but we give it a jolly good go!

The report typically includes:

* An executive summary, because it wouldn't be a _business_ report without one, right?
* Description of the methodology we used
* A list of _all_ of the causes and effects in the model
* Suggestions of key metrics to measure, track and improve upon
* A list of all of the remedies for problems in the model, generated by us and including those suggested by staff in the group facilitation
* EngineerBetter's recommendations for which remedies should be run as experiments
* Ways that EngineerBetter can help
* An appendix of pertinent anonymised quotes
* An appendix of anything that we think you should know, but we weren't asked for

It's important that we highlight key metrics that can be the 'guiding light' for improvements. That's because all the remedies should be run as experiments - measure this, try that, and if the numbers get better, stick with it.

The remedies shouldn't _all_ be tried, and certainly not all at once - hence why we make our suggestions as to what should be prioritised. Our goal is to empower the customer to make their own improvements. The chances are that the customer knows their own circumstances better than we do, and it's more important that improvements are made than our suggestions are followed.

For similar reasons we list many more remedies than we can help with. It would be dishonest and unethical to suggest only improvements that we can help with. We've never wanted to be a 'land and expand' consultancy and we hope that, by offering people a plethora of ways to help themselves that we don't financially benefit from, we can demonstrate our trustworthiness.

Finally, we have often included a section of things that we think the customer should know, that we haven't been asked to look at. Our job is to tell people what they need to know in order to be successful, and not to tell them what they want to hear, or to win a popularity contest. As CEO I would much rather lose business by telling people what I think will help them most than by biting my lip for fear of causing offence. Naturally, all feedback is offered with empathy and tact.

### Presentation

Some folks want to see the report first and meet after digesting it, but generally we find it works better to guide people through the findings in a presentation meeting. The subject matter is complicated, and CRTs are unfamiliar tools to most people.

One of the more satisfying moment of my career has been presenting these findings to customers, only to see them reach the conclusions that we have made in a later part of the document that they haven't read yet. Seeing the lightbulb go on is immensely gratifying, as is seeing a room of people energised and re-enthused about their work lives.

### Follow-on Work

As mentioned previously, there's plenty more to do than EngineerBetter can help with. Sure, we can help you with all sorts of challenges relating to continuous delivery, cloud infrastructure and organisational change. There's much more though that customers can do for themselves, and so they should.

We invite folks to adopt the Current Reality Tree as a living document. Update it as things change. Solicit feedback from staff to see if it is accurate.

We encourage folks to look at key metrics like lead-time-to-production and flow efficiency, and keep tracking them. Run experiments, and if the metrics improve, then keep going! Don't waste time on something that isn't really helping, no matter if we told you to do it, or if it's the latest development craze.

## Case Studies

We've been very fortunate that some of our customers have been happy for us to share the ways that we've helped them. Our approach is a perfect reality check for technology leaders in new positions, either by way of promotion or changing companies. These folks don't have any significant underlying dysfunction, and instead just want and honest appraisal from an outside source.

Other customers (who have, to use a British colloquialism _been in a bit pickle_) have quite understandably not been so keen on sharing their dirty laundry. Suffice to say that some of our more interesting work has been in organisations where things have not been great.

### Case Study - Index Labs

Index Labs is the company behind [Football Index](https://www.footballindex.co.uk/), a revolutionary fintech company that allows its users to treat soccer players like financial instruments. The company has grand plans to be a disruptive force in finance, reaching demographics uninterested in finance and giving them the tools to improve their fortunes via subject matter they're familiar with.

[Akash Gharu](https://www.linkedin.com/in/akash-gharu/) had recently joined Index Labs as CTO, and was pumped full of ambition (if you've spoken to him, you'll know he's a force of nature) to help take Index Labs to the next level. He was absolutely determined that engineering culture was the top priority, as it is crucial to being able to hire the best talent. The company already had a successful product and well-functioning development organisation, and Akash invited EngineerBetter to help identify any blindspots or 'unknown unknown' improvements that could be made.

We were asked to help take part in the first IndexLabs internal tech conference, which brought together their distributed team for meetings, talks, pizza and drinks. EngineerBetter chatted to engineers, testers, product people and more, delivered presentations and facilitated group discussions.

Here's what Akash had to say:

> We had an immediate meeting of minds with the EngineerBetter team, they recognised that we needed an elevation of process and culture rather than a transformational retrofit. All the important ingredients of an agile workplace were already in our wheelhouse, we just needed to breathe a fresh lease of life into them and inspire our engineering team to think and go forward with solid ideals. EngineerBetter took us on 2 days of high-energy team facilitation which laid a sound basis for our team members to debate and clarify their expectations of a high performing fintech. EngineerBetter also followed up with some well-articulated recommendations, many of which have become part-and-parcel of our ways of working. In terms of engineering culture and quality of output, we are firmly in a new stage of our growth. We remain partners with EngineerBetter as we continue to grow.

### Case Study - R3

[R3](https://www.r3.com/) are part of the [Corda Foundation](https://corda.network/), producing the Corda platform for blockchain apps that is in use in numerous financial enterprises. As such, they have some ferociously smart engineers working on very complex and novel problems.

[Dave Hudson](https://www.linkedin.com/in/davejh/) had recently been appointed Chief Engineering Officer when EngineerBetter were initially asked by one of the R3 engineers for some help with [Concourse CI](https://concourse-ci.org/) (which is another speciality of ours). Whilst it became clear that Concourse wasn't causing an issue, R3 were about to expand their development efforts internationally and wanted to ensure that things would go as smoothly as possible, as Dave explains:

> The EngineerBetter team worked with us for a couple of days as we were planning to scale up from a single development site to having two. They provided us with an incredibly valuable external perspective that have helped us articulate and prioritise improvements to our engineering culture. One recommendation was that we adopt a "remote by default" approach. This gave us a different way to think about what we were already doing and was readily embraced by our development team. When we found that we needed to embrace working remotely for everyone, we were much better prepared to make that happen. We look forward to working with them in the future.

## How EngineerBetter Can Help You

We're eternally grateful to Akash and Dave for sharing their positive experiences with EngineerBetter, and we look forward to continue to working with them and their teams.

EngineerBetter's Development Reality Check can help you if you want to:

* understand the current state of your development practice
* performance-tune the teams you already have, to increase productivity without increasing headcount
* find out why development is getting slower when you keep adding more developers
* become truly cloud native by deploying regularly into production with zero downtime
* decrease time-to-production, become a learning organisation, and achieve better business outcomes

If you need help with the above then please [get in touch](mailto:contact@engineerbetter.com). EngineerBetter doesn't have sales people - just experienced experts willing to have a chat to see if we can assist you.

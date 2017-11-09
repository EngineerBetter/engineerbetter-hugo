---
author: Daniel Jones
date: "2017-05-05"
heroImage: /img/blog-img-4.png
title:  The Anthropic Sympathy of Platforms
---

The way **most enterprises** operate is **wasting both the time and money** that they are made from. By learning from cognitive psychology and neuroscience we can find better, more productive ways of working.

The commonly-accepted working practices of today are born of the industrial revolution and the post-war era of mass production. It's no surprise that these methods are best suited to <em>paperwork factories</em> and not the creative endeavour of solving business problems with software.

<figure class="retain-aspect-ratio">
  <iframe src="https://www.youtube.com/embed/QWMUYl0BkEI" frameborder="0" allowfullscreen></iframe>
  <figcaption>Anthropic Sympathy delivered as a keynote at Cloud Foundry Summit Europe 2016</figcaption>
</figure>

<!--more-->

_**Warning: this post is 4,000 words long**, and is a loose transcription of my keynote. If you've watched the video, then you won't gain much more by reading this._

## TL;DR Summary

* Platforms allow self-sufficient product teams, which are more empathic and more productive
* Self-service platforms allow us to move to small-batch feature-based workflows, exploiting the present bias
* Deadlines make people less smart, less disciplined, and more forgetful
* Continuously delivering the most important thing in the simplest way reduces technical debt and increases motivation

Right, that's the provocative bold statements out of the way. Let's start this proper.

## Silos Breed Apathy

Many enterprises' technology activities are structured into silos - functional teams, each with a particular speciality. These teams typically don't sit together, and often communicate via the dreaded _service ticket_ system.

<figure>
  <img src="/img/blog/as/as.004.jpeg" class="fit image">
  <figcaption>Silo'd functional teams on the critical path to business value</figcaption>
</figure>

Very often members of one team don't feel like the people in other teams really care about their frustrations and problems. Why is this? They're all part of the same company, so they should be working together... Right?

<img src="/img/blog/as/as.005.jpeg" class="fit image">

It turns out there might be an explanation for one silo's apathy to the problems of another. [David Eagleman et al conducted an experiment](https://www.amazon.co.uk/Brain-Story-You-David-Eagleman/dp/1782116613/) whereby a control group of subjects were placed into a Functional Magnetic Resonance Imaging (fMRI) scanner, which infers levels of activity in areas of the brain over time.

Subjects in the fMRI scanner were shown videos of a person's hand either being touched with a cotton-wool bud or painfully stabbed with a hypodermic needle. The subjects' levels of activity in neural networks associated with pain and empathy were measured.

<img src="/img/blog/as/as.007.jpeg" class="fit image">

The experiment was repeated; this time subjects had to identify their religious beliefs before entering the scanner. Additionally, this time the videos were also labelled with the religious identity of the person being dabbed or stabbed.

When subjects shared the same religious identity as those being hurt, they demonstrated a <em>larger</em> empathic response. When the religious identity of the person being hurt was different, the subjects showed a <em>smaller</em> empathic response - smaller even than when no labels had been used.

This experiment suggests that **we care less about outgroups**. We do not feel their pains and frustrations as readily.

Cast your mind back to our enterprise operating in silos. **Organisations dividing up their staff in this way are creating outgroups**: my team, your team; my tribe, your tribe. The **teams do not _see_ each other's pains** and frustrations because they don't work alongside one another, and **even when they do see that pain, they will not care** as much.

## Product Teams Encourage Empathy

Thankfully we can do something about this. Instead of working in functional teams, we can instead work in cross-functional product teams that have all the skills we need to deliver value. This is much easier to achieve if you have a Platform-as-a-Service to reduce the breadth and depth of skills needed to push apps into production.

<figure>
  <img src="/img/blog/as/as.017.jpeg" class="fit image">
  <figcaption>Skills required to deploy apps on a PaaS are highlighted in blue</figcaption>
</figure>

Compare the skills that are on the critical path of a feature delivering business value in an old, manually-deploying organisation, and one with a self-service platform. The **problem space is smaller**, allowing us to concentrate resources into a cross-functional product team.

**Creating product teams gives people a shared identity and common purpose**, solving the out-group problem. "_We're all in this together, working towards the same goal. My loyalty is to the product, not the Technology X Architectural Guidelines document on Sharepoint._"

A common half-way step towards product teams is to create virtual teams - members of functional teams assigned to particular projects. Staff still sit with the team of their function (eg all the DBAs together) and report into the line manager for their function, but are each assigned to one or more virtual teams for a product or project. If the virtual team is _really_ lucky, the dedicated resource will expedite work coming from their 'virtual' colleagues.

Anyone who has worked in a virtual team, especially one which communicates by email or service requests, will know that they don't feel terribly productive. Co-locating team members can help them be more productive.

## Empathy begets Sociability begets Productivity

[A trio of European scientists performed a study](http://homes.chass.utoronto.ca/~agreve/Greve-Benassi_soc&hum.pdf) of consultancies that explored the correlation between productivity and human capital (the experience and expertise of staff), and between productivity and social capital (how frequently staff communicate, and with how many others).

In all three cases, **social capital correlated positively with productivity**. In two out of three consultancies, the human capital - the **education and experience of staff - did _not_ correlate with productivity** at all.

<figure>
  <img src="/img/blog/as/as.028.jpeg" class="fit image">
  <figcaption>A network's value is determined by the number of nodes and connections</figcaption>
</figure>

This all makes perfect sense if you compare an organisation to an economic network. An economic network's value is determined by the number of nodes it has, and the number of connections between those nodes. A transport network with only two depots is not as valuable as one with two hundred. A transport network where you can't get from one depot to certain others isn't as useful as one where every destination is reachable from every other.

The **more we communicate with each other**, and so the more social we are, the **more opportunity for creativity and innovation** is created. Mistakes get corrected more quickly. People reach out for help more readily.

Now consider our network to be a communications network. We can make a communications network more reliable and thus more valuable by increasing the success rate of messages sent upon it - if we can avoid messages being misinterpreted or corrupted, then we waste less time and energy on resending them.

## Human Contact Improves Communication Efficiency

It turns out that humans appear to possess some pretty sophisticated mechanisms for adding redundancy to communications, and for ensuring that messages are understood as the originator intended.

<figure>
  <img src="/img/blog/as/as.029.jpeg" class="fit image">
  <figcaption>Did your eyebrows raise when looking at this picture?</figcaption>
</figure>

Picture the scene: you're walking through a busy train station, and ahead of you two friends are bidding each other farewell with a firm handshake and shared laughter. One of them turns towards you, still laughing, and makes eye contact. Before you know it, you realise you've inexplicably smiled at the person, despite not being in on their joke. This happened to me on the morning I wrote this paragraph.

This sort of facial mimicry may be down to mirror neurons, which are brain cells which exhibit the behaviour of firing both when an action is performed, and when it is perceived. They were first discovered by accident when researchers were exploring the brain activity of monkeys picking up peanuts. Electrodes were inserted into these monkeys' brains, detecting the impulses of supposed motor neurons when the monkeys moved. The equipment was left rigged up, and when a monkey observed a researcher picking up a peanut, the very same neurons fired.

<img src="/img/blog/as/as.030.jpeg" class="fit image">

Mirror neurons are not proven to exist in humans as there have been very few individuals volunteering for the invasive brain surgery required. Hence in human neuroscience the term 'mirror system' is used, which gives rise to something called the 'mirror hypothesis'.

The mirror hypothesis suggests that when we see someone else's facial expression, our mirror system fires, causing us to automatically mimic that expression. Through a phenomenon called embodied cognition, physiological feedback about the state of the body is fed back into the brain as another source of information for use in the decision-making process.

For example: when you see another person smiling, your mirror system fires making you smile too. The state of your body is fed back to your brain, immersing you in the same context as the person you're looking at. So you don't just know the semantic fact that 'smiling people are often happy', your brain puts itself in the same context so as to experience first-hand what the other person is experiencing. The mirror hypothesis is contested, but is supported by some compelling experimental evidence.

<img src="/img/blog/as/as.031.jpeg" class="fit image">

[A finding](http://spp.sagepub.com/content/early/2011/04/21/1948550611406138.abstract) that supports the mirror hypothesis is that people who have had botox injections are less able to correctly identify the emotions expressed in photographs of others. But why?

There's no reason to expect that botox users know less about the meaning of facial expression. Rather the suggestion is that as botox users have voluntarily paralysed their facial muscles for cosmetic reasons, the feedback system is broken - they can't put their body in the same state, thus denying their brain additional information.

Understanding the intent of others and **being able to empathise** with them **is a key enabler of sociability**. We all know that online written media are narrow-band and easy to misinterpret (otherwise the emoji would not have emerged), but did you realise that we're foregoing some extremely sophisticated human abilities by using these media?

By **co-locating collaborating team members**, we can **decrease the latency** in their communications and more importantly **increase their empathy** for one another and allow them to better understand each others' intent. This allows them to be more social, which in turn allows them to **be more productive**.

None of this is new, by the way. Cross-functional product teams might be the term that's in vogue now, but NASA were talking about [tiger teams](https://en.wikipedia.org/wiki/Tiger_team) back in the 1960's.

## Silos Create High Transaction Costs

So now we know to have a co-located product team with a shared identity and sense of purpose, but how many of their working practices are now no longer fit for purpose?

When working in silos, communications were <em>slow</em>. There was a high latency when sending emails between departments, and trying to schedule time of any one department with time-consuming in itself - let alone _all_ the silos one needs to deliver any value! The **high transaction costs in dealing with each silo** is apparent in the observation that most Project Managers spend their time trying to co-ordinate activities.

When faced with a high transaction cost it makes sense to have fewer transactions and larger batches. This combined with the specialisation of each silo means that organisations tended to work on large batches of <em>aspects</em> of features, rather than individual features themselves. "_It took me a month to get the database team's time, so now we've got a slot we'll get them to do the stored procedures for all of this quarter's features._"

<img src="/img/blog/as/as.038.jpeg" class="fit image">

Each batch gets bigger, each bar on the Gantt chart gets longer, and activities at the end of the project become more distant. Typically in these situations something like load testing fails right at the end of the project.

"_But this is waterfall! There was a requirements document that everybody signed!_" Why would **things at the end of the project** be more **likely to fail**?

## The Present Bias

You may have heard of the **present bias**, which is a well-observed psychological phenomenon whereby **people value things that are close to them more highly** than things that are distant.

It's why people buy furniture on 'buy now, pay later' deals - the further away the cost is, the more discounted it is by the brain. It's also the same reason why you're more likely to give up a &pound;3 sandwich for a starving child you walk past than to make a donation to Comic Relief (powered by Cloud Foundry!) for a starving child 5,000 miles away.

[An interesting finding](http://www.jneurosci.org/content/30/16/5498.full.pdf) shows that the present bias may be explained by some remarkably clear neural activity.

<img src="/img/blog/as/as.040.jpeg" class="fit image">

Rhesus monkeys were given a choice between a little bit of sugar-water immediately, or a larger amount in a few seconds' time. By varying the size of the larger amount and the delay with which it would be delivered scientists were able to record the behavioural prefences of the monkeys. For example, how much bigger would a drop of sugar water need to be for it to be worth waiting 5 seconds for?

Sure enough, the monkeys valued equivalent amounts of sugar-water less if they had to wait for it, so demonstrating the present bias in action.

The same monkeys then had electrodes inserted into the intra-parietal areas of their brains. The researchers found that specific neurons appeared to encode the value of the options they were considering: the faster a neuron fired, the more attractive the option; the slower it fired, the less attractive.

Astoundingly researchers observed a near-exact mapping between the behavioural preferences displayed by the monkeys, and the firing rates of the sampled neurons. This demonstrated that the **present bias has an unusually clear neurological mechanism underpinning it**.

If the **present bias is part of our neural make-up**, then there is no escaping it. **We can't get away from it**. We can reason about it, but we're always going to be susceptible to it.

Given that we can't escape the present bias, can we instead turn it to our advantage?

## Continuous Delivery Exploits the Present Bias

Let's think back to our Gantt chart. It's a wonder that load testing ever succeeds when it's so far away from the development upon which it depends. The engineering decisions being made during development are being made by people with different and more pressing concerns (such as a looming deadline that affects only their silo).

**If we're using a platform** then we have a smaller problem space to worry about and **half the bars on the project plan can disappear** entirely. A cross-functional product team now has all the skills it needs to do , and with a self-service platform it can do that work _when it needs to_, without delays.

Self-service access to resources on demand changes the economics of our team. Our **transaction costs have shrunk by several orders of magnitude** (getting hold of a database takes **seconds instead of weeks**), which makes it **economical to work on individual features** rather than aspects.

<figure>
  <img src="/img/blog/as/as.047.jpeg" class="fit image">
  <figcaption>Use of a platform causes most of the tasks to disappear altogether</figcaption>
</figure>

Working on individual features means that **everything that is important to that feature is important <em>now</em>** - not in three months' time.

Self-service platforms like Cloud Foundry raise the level of abstraction, create smaller problem spaces, and allow teams access to resources on-demand. All this combined enables **per-feature workflows** that **allow us to exploit the present bias** rather than fall victim to it.

An automated platform allows teams to deploy into production with a single command and zero downtime, which is a far cry from antiquated practices like scheduled downtime and weekend releases. Now that deployments need not be painful, they can become increasingly frequent - our teams can move to a continous delivery model that gets features into the hands of users sooner.

## Deadlines Make Developers Dumb, Forgetful and Ill-Disciplined

Continuous delivery isn't just good for delivering business value more quickly, or allowing faster feedback from customers. It turns out that **continuous delivery can help us reduce technical debt**.

The [book _Scarcity_](https://www.amazon.co.uk/Scarcity-True-Cost-Having-Enough/dp/0141049197/) describes a large amount of original research into the psychological effects of being aware that one doesn't have enough of something that is important.

A [representative study](http://www2.warwick.ac.uk/fac/soc/economics/staff/amani/mani_science_976.full.pdf) asked shoppers in a New Jersey mall a hypothetical question.

"_You've been involved in a car accident, and your insurance company isn't going to cover the costs of repairs to your car. How are you going to fund the repairs to your car?_"

Respondents were categorised by their income into two groups: rich and poor. Half of each group was asked a slightly different version of the question: either they had to cover a $300 (three hundred dollar) repair bill, or a $3,000 (three _thousand_ dollar) repair bill.

<figure>
  <img src="/img/blog/as/as.054.jpeg" class="fit image">
  <figcaption>An example of Raven's Progressive Matrices, in which the objective is to identify the next pattern</figcaption>
</figure>

After answering the quandry on financing the car repairs, the respondents were given a fluid intelligence test. The test in question was an example of Raven's Progressive Matrices, which is often used to measure IQ.

The **rich respondents' IQ scores were not impacted by whether they were posed the $300 or the $3,000 question** - they scored about where you'd expect them to. The poor respondents who were posed the $300 dollar question did not demonstrate a noticable difference in their expected IQ score.

The **poor people who were asked to find $3,000** to repair their car showed a **drop in effective IQ of 13 to 14 points**. All this, just from a fictional exercise that reminded them that they didn't have enough money in their real life.

A drop in fluid intelligence isn't the only effect of scarcity. **Other effects** include **diminished executive control**, which is the category of mental ability that includes functions such as **self-control**, and **prospective memory** (remembering that you need to do something in the future).

This scarcity effect was demonstrated again and again throughout the research detailed in the book, and was controlled for across cultures and demographics.

It wasn't just demonstrated for a scarcity of money though: people showed its effects when they didn't have enough social contact, for example. Most importantly for us, **people demonstrated these negative psychological effects when they didn't have enough time**.

Just think for a moment what happens in an engineer's head if you remind them that they've got a deadline looming:

* You're **reducing their effective IQ**, making them less able to solve abstract problems
* You're **reducing their self-control**, making them more likely to cut corners and incur technical debt to hit the deadline
* You're **inhibiting their prospective memory**, making them less able to remember that they need to patch the corners they just cut!

Why would we do such a thing?

## Waterfall and Scrum are Harmful

If you're practicing waterfall, there would have been knock-on effects for being late - the next silo's activity would be delayed, causing a cascade of rescheduling costs. With a self-service platform and cross-functional team, we don't have that problem.

**If you're practicing Scrum, you're doing this _every two weeks_**. Why? Because **Scrum is a methodology for low-trust environments**. Management insist that engineers make commitments to deliver things by the end of the sprint. Without the stick of a deadline, how will management know that people will do their work?

There's a better way to deliver software that **replaces the stick of deadlines with the carrot of instrinsic motivation**, thereby avoiding the artificially-imposed scarcity effect.

Continuous delivery of complete features allows us to _demonstrate_ progress, rather than predict the future. [No-one can predict the future](https://www.amazon.co.uk/Black-Swan-Impact-Highly-Improbable/dp/0141034599/), and if they could then I'm sure they'd be busy buying lottery tickets rather than achieving Scrum Master accreditation.

**If you want to know how fast a team is going, look at what we've delivered into production in the last two weeks**. Look at how much business value is now in the hands of customers. I can't predict the future, and nor can you. A continuously-delivering team can however point to recent past performance.

## Doing the Most Important Thing in the Simplest Way

The lack of trust intrinsic to Scrum can be addressed by two very simple and powerful ideas.

<img src="/img/blog/as/as.063.jpeg" class="fit image">

**Each product team should work from a single, ordered, public backlog**, which is prioritised by the product owner. 'The business' decide the priority, and the engineering team never over-rule this (although they might discuss the assigned priorities).

The **engineers only ever pick stories from the top of the backlog**, and never skip down to find something that's perhaps more interesting. **Stakeholders can see progress any time they like** by viewing the backlog or looking at what's been delivered to production.

By always **doing the most important thing**, engineers are always focused. They're **never goofing off**.

The **engineers always implement a story in the simplest way** possible. They're **not over-engineering** things, architecting for a future that may never happen. The implementations are as lean as they could possibly be - we can't trim any fat off of the task.

By always doing the **most important thing in the simplest way that works**, we're always taking the **shortest possible route to the most critical business value**.

At this point **deadlines become meaningless**.

If we're already doing the most important thing in the simplest way, **sticking a date on a calendar isn't going to make the blindest bit of difference**.

It's a little like shouting at a satellite to orbit the Earth faster - we can either add more kinetic energy (equivalent to adding more resource to our team) or reduce the mass of the satellite (equivalent to making the tasks less complex). **Hollering at it won't change either of the key variables that determine velocity**. The work will get done when the work gets done.

Continuously delivering the most important thing in the simplest way allows us to **escape the tyranny of deadlines**, and the technical debt that scarcity of time causes.

## Continuous Delivery Increases Motivation and Reduces Technical Debt

When working with a platform that enables continuous delivery we can **replace the stick of deadlines** with the **carrot of intrinsic motivation**.

<img src="/img/blog/as/as.065.jpeg" class="fit image">

An oft-reported study performed in jails found that prison inmates were more likely to be granted parole if their hearing was held just after lunch. Inmates whose hearing was held at the end of the day stood a 20% chance of being granted parole, whilst those who had their hearing after the board had returned from a lunch break stood a 65% chance of success.

For a long time people supposed that this discrepancy was down to the parole board eating lunch, ingesting glucose, metabolising it into lysine, which is then used in the pre-medial frontal cortex - an area of the brain associated with inhibiting impulses and thus self-control.

It turns out that there may be more to it than this.

<figure>
  <img src="/img/blog/as/as.066.jpeg" class="fit image">
  <figcaption>An illustration of a test that provokes <a href="https://en.wikipedia.org/wiki/Stroop_effect">the Stroop effect</a></figcaption>
</figure>

A [more-recent study](http://pss.sagepub.com/content/early/2012/10/19/0956797612450034.extract) asked subjects to perform an exhaustive Stroop test, wherein a person observes the names of colours printed in a different colour, and has to name the written word rather than the colour it's printed in. This exercises self-control, as the subject has to inhibit more immediate responses.

<img src="/img/blog/as/as.067.jpeg" class="fit image">

After performing the Stroop test to failure point, the subjects were then asked to gargle a sweet drink, and spit it out. Immediately afterwards they were then presented with another willpower test, this time squeezing a grip-exerciser for as long and as hard as possible.

One half of the subjects were given a sugary drink to gargle. The other half were given an artificially-sweetened drink.

On average, those that had gargled the sugary drink did better on the subsequent willpower test. But why? They spat the drink out, so they can't have ingested any glucose. The grip-exerciser test was immediately afterwards too, so they wouldn't have had time to digest and metabolise the glucose even if they had swallowed some.

It is supposed that the glucose in the sugary drink was binding to chemical receptors on the tongue, which in turn activated the reward network in the brain. It was this **sense of reward** that **replenished people's self-control**, and not the chemical energy locked into the sugar.

Anecdotally this makes perfect sense (to me, at least) and explains why good days are self-fulfilling, and bad days tend to get worse. When you've been rewarded you're more able to resist temptation and stick to a rewarding path; when you're feeling unrewarded you lack the self-control to resist temptation, and so let yourself down by seeking the rewards you're not getting elsewhere.

Continuous delivery allows engineers to get reward of completing a task on a daily basis. Despite the common beliefs of middle-managers, people are motivated more by a job well done, and by [seeing people benefit from their labour](http://www.sciencedirect.com/science/article/pii/S0749597806000641). These rewards are _so_ delayed in waterfall projects that they hardly make an impression, and in Scrum they're at best delayed by two weeks.

**Frequent rewards** for a behaviour make that behaviour **more compelling**. This is the psychological hook that gambling machines and free-to-play video games leverage so effectively.

**Continuous delivery gives engineers a sense of reward daily**, and perhaps even several times a day. This **increases their self-control**, reducing technical debt, and also makes the act of getting a feature into production more compelling.

## (Not) Wasting People's Lives

When Daniel Young and I founded EngineerBetter we spent time working out what we wanted to achieve and why.

<img src="/img/blog/as/as.077.jpeg" class="fit image">

We observed that businesses are fundamentally made of only two things: the hard-earned money of shareholders, and the easily-spent time of employees. Whenever an organisation does something inefficient, it's wasting one of these two resources.

Sam Ramji, then-CEO of the Cloud Foundry Foundation, once pointed out to me that time is not measured in seconds. **Time is measured in heartbeats**. You're spending them reading this, and you're not going to get a refund. You have a finite supply, you're not getting any more, and knowingly wasting other people's heartbeats is immoral.

We all know though that time is money. And if time is money, then **money is measured in heartbeats too**.

<img src="/img/blog/as/as.081.jpeg" class="fit image">

Someone had to exchange heartbeats for money. They gave up some of their time on this Earth to earn money, which they saved for their families, which was invested in a pension fund, or handed down to their children.

**If we knowingly do things that are inefficient, when we _know_ there's a better way, then we're knowingly wasting people's heartbeats.**

It's easy to trivialise the absurdity of enterprise processes, and to grow numb to the tedium of waiting two weeks for a change request to be satisfied. But at a fundamental level, what we do is important.

Regardless of whether you're wasting a business' money or its employees' time, you're wasting people's lives.

I for one can't contribute to this, and nor can I idly sit by the sidelines pretending it's someone else's problem.

"_That's the way it is here_" and "_everyone else does it_" are not acceptable excuses.

"_It's a people problem_" and "_cultural change in enterprises is hard_" are not reasons for inaction.

Damned right it's a people problem. Damned right cultural change is hard. It's time to get started.

<img src="/img/blog/as/as.082.jpeg" class="fit image">

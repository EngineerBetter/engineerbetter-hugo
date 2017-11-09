---
author: Daniel Jones
date: "2016-07-01"
heroImage: /img/blog/brain.jpg
title: Brain-Aligned Delivery Notes
---

I'm giving a talk entitled [Brain-Aligned Delivery](http://sparkthechange.co.uk/sessions/brain-aligned-delivery/) at [Spark The Change](http://sparkthechange.co.uk/). The presentation is an aggregration of various cognitive psychology and neuroscience findings that apply to working practices, and this post serves as accompanying notes, with links to its many **references**.
<!--more-->
Explaining the talk in a blog-style format is a large undertaking, and something that I may consider later. In the meantime I've written this to save attendees taking notes. There are some ideas in here that likely didn't make the final cut of the talk, or I didn't have time for.

The [slides are available online](http://www.engineerbetter.com/brain-aligned-delivery), but won't make a huge amount of sense without these notes.

## The Problem

I make the case that the Western world is in the midst of a productivity crisis, perhaps caused by its financial and human capital being tied up in the incumbent enterprises that were born of the industrial revolution, the baby-boom generation, mass production, and assured growth.

<section class="wrapper style2 special boxout">
  <p>"[...] the future of productivity is highly uncertain"</p>
  <a class="button special" href="https://www.oecd.org/eco/growth/OECD-2015-The-future-of-productivity-book.pdf">OECD - The Future Of Productivity</a>
  <p>"Up to 25% of the productivity gap may be explained by "resource allocation to less efficient uses" and "higher firm survival"</p>
  <a class="button special" href="http://www.bankofengland.co.uk/publications/Documents/quarterlybulletin/2014/qb14q201.pdf">Bank Of England - The Productivity Puzzle</a>
</section>

It is my belief that a great many organisations use their human resources inefficiently. I liken this to the way software is written not to be sympathetic to the strengths of the machines running it, but instead to the humans who need to understand and maintain it. I make the argument for anthropic sympathy, whereby the processes and structures of our organisations are realigned to exploit the capabilities of the wetware that embodies them.

<section class="wrapper style2 special boxout">
  <p>LMAX created a high-throughput system by adopting mechanical sympathy.</p> <a class="button special" href="https://lmax-exchange.github.io/disruptor/">LMAX Disruptor</a>
</section>

## Reward

Reward and motivation are key to getting humans to do the 'right thing'. Giving people financial rewards in return for doing something they ought to enjoy (work!) has been demonstrated to reduce their motivation to do that thing in the long-term. Similarly financial punishments have been shown to be counter-productive, increasing the disincentivised behaviour perhaps by replacing a strong social contract with a weak monetary one.

<section class="wrapper style2 special boxout">
  <p>Extrinsic rewards reduce the likelihood of repeating the incentivised behaviour, and extrinsic motivators break social contracts.</p>
  <a class="button special" href="https://www0.gsb.columbia.edu/mygsb/faculty/research/pubfiles/5133/GneezyMeierRey_JEP.pdf">When and Why Incentives &#40;Don’t&#41; Work
to Modify Behavior</a>
</section>

## Organising Activities

Planning is a large part of cooperation and achieving complex goals. In this section I discuss various findings that explain why several planning activities should be considered anti-patterns.

I believe that estimating the duration of a task is at best a fruitless waste of resources, and at worst a dangerous and misleading practice that diverts focus away from the really important issues. I make the case that 'prediction addiction' is a result of operant conditioning, and duration estimation becomes a compulsive self-fulfilling positive feedback loop.

It is my opinion that humans are compelled to interact with things that they can't quite predict, as demonstrated by video games and most gambling activities.

<section class="wrapper style2 special boxout">
  <p>B.F Skinner's research on operant conditionining and the effect of random rewards on rats can be found in The Behaviour of Organisms, although he produced many works on the topic.</p>
  <a class="button special" href="http://s-f-walker.org.uk/pubsebooks/pdfs/The%20Behavior%20of%20Organisms%20-%20BF%20Skinner.pdf">The Behaviour of Organisms</a>
</section>

Duration estimation is ultimately pointless because we cannot predict the future. One of the reasons that we cannot predict the future is because the workplace (and indeed the world) is a complex system, and demonstrates emergent behaviour. Although simple rules can be understood in isolation, a combination of simples rules and (approximately three or more) positive feedback loops gives rise to _unpredictable_ emergent behaviour, as described by Complexity Theory. Whilst we might know all of the variables that contribute towards how long a task is going to take, it is the _interaction_ between these that creates unpredictable behaviour.

Gamers may be intrigued by the opinion that the act of playing video games is in some large part the act of trying to reverse-engineer the simple rules that belie a complex system.

<section class="wrapper style2 special boxout">
  <p>We can't predict the future.</p>
  <a class="button special" href="https://www.amazon.co.uk/Black-Swan-Impact-Highly-Improbable/dp/0141034599/">Black Swan</a>
  <p>Systems featuring more than three feedback loops create emergent behaviour.</p>
  <a class="button special" href="https://www.amazon.co.uk/Game-Mechanics-Advanced-Design-Voices/dp/0321820274/">Game Mechanics: Advanced Game Design</a>
</section>

The present bias is an observed phenomenon whereby humans value things more highly the closer they are, and discount both value and cost the further away they are. This explains why people often purchase items they cannot afford on credit, and why you'd give your sandwich to a starving child that you walk past but not donate to a charity.

The present bias has a neurological basis in the firing rate of neurons that signify value in the decision-making process. Whilst we can rationalise about our present bias, we cannot ever escape it. We would do better to harness the present bias than to ignore it.

<section class="wrapper style2 special boxout">
  <p>The present bias has a neurological basis.</p>
  <a class="button special" href="http://www.jneurosci.org/content/30/16/5498.full.pdf">Separating Value from Choice: Delay Discounting Activity in the Lateral Intraparietal Area</a>
</section>

I refer to Paul Glimcher's model that predicts that humans are more willing to accept an expensive thing becoming more expensive, than abandon plans and switch to a equally-valuable but cheaper alternative. It is my view that this maps entirely to the difference between waterfall project planning, and just-in-time decision-making that is characteristic of agile practices.

The reasons behind this tendency to accept the default becoming more expensive are many. Firstly, humans tend to value things in relative terms. The Endowment Effect means that we value what we have, both things and plans, more highly than things we do not have. Finally, we experience regret more strongly when we reject the status quo and turn out to be wrong.

<section class="wrapper style2 special boxout">
  <p>Humans accept an expensive default becoming more expensive.</p>
  <a class="button special" href="https://www.amazon.co.uk/Foundations-Neuroeconomic-Analysis-Paul-Glimcher/dp/0199744254/">Foundations of Neuroeconomic Analysis</a>
  <p>Fewer people would choose to save $35 on a $1,000 purchase than a $100 purchase, even though the absolute effort required to make that saving is the same.</p>
  <a class="button special" href="http://gradworks.umi.com/33/05/3305760.html">Decisions under poverty: A behavioral perspective on the decision making of the poor</a>
  <p>We kick ourselves harder when erring by rejecting the default.</p>
  <a class="button special" href="http://www.jneurosci.org/content/31/9/3320">A Regret-Induced Status Quo Bias</a>
</section>

Reminding teams that they have deadlines by which they must have achieved a certain amount of work reduces their effective IQ and their ability to solve problems creatively, reducing the quality of the solution delivered. What is worse is that this scarcity of time also reduces their willpower, making them more likely to cut corners, and also reduces their ability to remember to do things later, decreasing the likelihood of them remembering to patch the corners that they have cut!

Scrum is particularly insidious in this regard. By committing to fixed deliverables every two weeks, Scrum practitioners are incurring these negative effects constantly. It's no wonder that Scrum has a bad reputation for delivering high-quality software.

<section class="wrapper style2 special boxout">
  <p>Scarcity reduces effective IQ by 13-14 points, and impedes executive control</p>
  <a class="button special" href="https://www.amazon.co.uk/Scarcity-True-Cost-Having-Enough/dp/0141049197/">Scarcity</a>
  <a class="button special" href="http://www2.warwick.ac.uk/fac/soc/economics/staff/amani/mani_science_976.full.pdf">Poverty Impedes Cognitive Function</a>
</section>

Functional teams (silos) reduce the likelihood of team members observing the pain and frustration of their customers, particularly when the interface into that team is some awful work-ticket system. What's more subtle though is that by creating 'in-groups' and 'out-groups', we reduce the ability of team members to _feel_ the pain and frustration of their customers.

<section class="wrapper style2 special boxout">
  <p>Silo'd teams are less empathetic towards other teams.</p>
  <a class="button special" href="https://www.amazon.co.uk/Brain-Story-You-David-Eagleman/dp/1782116613/">The Brain</a>
</section>

The human body appears to have sophisticated mechanisms for allowing us to understand another's emotional state, and by using electronic communications media we are failing to exploit these abilities. The mechanisms described enforce sociable behaviour, which I argue is a subjective term we use to describe positive-sum outcomes for groups of humans. These are the sorts of outcomes we want for our organisations, and so it seems daft not to be making the most of the abilities we have.

The mirror system (mirror neurons are not proven to exist in humans because such proof would require invasive procedures) may facilitate a feedback loop whereby a person sees a facial expression, the mirror network mimics that expression, physiological feedback is then fed into the brain, and we come to understand their emotional state: in essence, we 'try on' their face. By foregoing face-to-face communication, we are failing to exploit this mechanism.

<section class="wrapper style2 special boxout">
  <p>Botox users are on average less able to identify the emotion expressed by a face.</p>
  <a class="button special" href="http://spp.sagepub.com/content/early/2011/04/21/1948550611406138.abstract">Embodied Emotion Perception</a>
</section>

Blushing can be argued to be another biological mechanism that exists solely for the purpose of interaction with other humans. When a person shows shame by blushing after unsociable behaviour, it is a signifier that they are at some level conflicted by their actions, and thus less likely to be a sociopath. I suggest that this is the involuntary physiological equivalent of saying "forgive me."

<section class="wrapper style2 special boxout">
  <p>Game participants are more likely to trust a betrayer if they blushed.</p>
  <a class="button special" href="http://psycnet.apa.org/journals/emo/11/2/313/">Saved by the blush: Being trusted despite defecting</a>
</section>

Emotions and 'gut reactions' help to tip the balance of decision-making beyond the rational, and are therefore useful tools in the workplace. If you feel bad when making a decision, the chances are you are making a poor choice.

<section class="wrapper style2 special boxout">
  <p>Tammy Myers is unable to assimilate physiological state, making decision-making a distressing experience.</p>
  <a class="button special" href="https://www.amazon.co.uk/Brain-Story-You-David-Eagleman/dp/1782116613/">The Brain</a>
</section>

Symdrome E is a term for a collection of symptoms that accompany genocide. It features normal levels of activity in areas of the brain responsible for reasoning, planning, logic and memory. It features reduced levels of activity in the areas responsible for empathy and emotion. To be clear, I'm not saying that a lack of empathy _causes_ genocide, but there's a clearly an association.

<section class="wrapper style2 special boxout">
  <p>Reduced empathy is a symptom that accompanies genocide.</p>
  <a class="button special" href="http://www.thelancet.com/journals/lancet/article/PIIS0140-6736(97)09385-9/abstract">Syndrome E</a>
</section>

Emotions help us make decisions with sociable outcomes. Our physiological responses help ensure sociable outcomes from our interactions. Our neurological responses allow us to better understand the emotional state of others, making the first step to ensuring a sociable outcome. If we contrast all of this with 80s management philosophy of zero-sum games, winning at all costs, and treating business as war, it is no surprise that we have a status quo of sociopathic corporations pursuing profit at the cost of humanity.

I highlight a study that correlated social connectedness more positively with productivity than did staff experience or education.

<section class="wrapper style2 special boxout">
  <p>It can be argued that human culture, and life as known on Earth, are both emergent as the result of positive-sum games playing out on ever-larger scales.</p>
  <a class="button special" href="https://www.amazon.co.uk/Nonzero-History-Evolution-Cooperation-Destiny/dp/0349113343/">Non-Zero</a>
  <p>Social capital correlates with productivity.</p>
  <a class="button special" href="http://homes.chass.utoronto.ca/~agreve/Greve-Benassi_soc&hum.pdf">Exploring the Contributions of Human and Social Capital to Productivity</a>
</section>

## The Alternative

Having discussed various business practices that create friction between work and the human brain, I go on to suggest some practices that align better with our biology.

Research has shown that extrinsic motivators can be counter-productive, so instead we should focus on _instrinsic_ motivators: things that people _like_, rather than _want_. The SCARF model is a proprietary attempt to codify this, although I'm not its biggest fan and think "Status" in particular is dangerous.

I suggest bestowing _recognition_ rather than status, and in particular having recognised 'go-to' experts in your teams. Those recognised experts will feel rewarded by this, and they also get the opportunity to help others, which is another intrinsic motivator in adults. In practical terms, knowledge disseminates to new starters more easily.

Seeing the beneficiaries of one's work is also demonstrated to be both motivating and rewarding in a study featuring scholarship fund-raisers. If you can connect your team with the people who benefit from their work, they will be more motivated.

<section class="wrapper style2 special boxout">
  <p>The SCARF model is a (proprietary) lens through which to view intrinsic motivation.</p>
  <a class="button special" href="http://www.your-brain-at-work.com/files/NLJ_SCARFUS.pdf">SCARF: a brain-based model for collaborating with and influencing others</a>
  <p>Helping others is intrinsically rewarding.</p>
  <a class="button special" href="http://ftp.iza.org/dp1045.pdf">Is Volunteering Rewarding in Itself?</a>
  <p>Seeing the beneficiaries of one's work increases effort and efficacy.</p>
  <a class="button special" href="http://www.sciencedirect.com/science/article/pii/S0749597806000641">Impact and the Art of Motivation Maintenance</a>
</section>

Humans also find problem-solving intrinsically rewarding, and this is why the video games industry exists. Video games are nothing more than exercises in learning, formed as problem-solving exercises of ever-increasing difficulty wrapped up in snazzy graphics and fantasy worlds. I highlight research in _The Kids Are Alright_ which observes that the gamer generation _expects_ autonomy and problem solving.

<section class="wrapper style2 special boxout">
  <p>Workers who grew up playing video games expect to solve problems rather than follow instructions.</p>
  <a class="button special" href="https://www.amazon.co.uk/Kids-are-Alright-Generation-Workplace/dp/1422104354/">The Kids Are Alright</a>
  <p>The video games industry is worth around $91,000,000,000.</p>
  <a class="button special" href="http://ukie.org.uk/research">UKIE</a>
</section>

Given that we now know the correct sort of rewards to offer, we can focus on making them more frequent (to increase the compulsion to receive that reward). Working in small batches features this as a side-effect, along with increased certainty per task, and increased granularity and visibility of work.

Of interest to teams to whom ongoing quality is important is a finding that suggests, contrary to popular opinion, that willpower may be replenished by reward, rather than by consumption of food. By structuring work to offer frequent rewards, we can increase the willpower of our teams.

Anecdotally I'd offer that this is why it's much easier to let yourself down when you're having a bad day, and why good days become self-reinforcing. In the absence of rewards we lack the willpower to resist the sorts of rewards we should avoid such as sugary food, cigarettes, or alcohol.

<section class="wrapper style2 special boxout">
  <p>Rewards replenish willpower.</p>
  <a class="button special" href="http://pss.sagepub.com/content/early/2012/10/19/0956797612450034.extract">The Gargle Effect: Rinsing the Mouth With Glucose Enhances Self-Control</a>
</section>

Too much of a good thing can be beneficial. Whilst having a scarcity of desired resources causes people to tunnel and think about the bigger picture, instead having an abundance of things makes people more relaxed.

A study showed that people somewhat counter-intuitively prefer to work when there are many options to recreate, as opposed to when there is only one option. I opine that this is because when there is only a single option, it seems rare and though it must be seized whilst the going is good. When there are many options, it feels as though there's a plentiful supply, so it's okay to wait until a more appropriate time. We can leverage this in the workplace and increase the likelihood of people choosing to work, by giving them many opportunities to relax. Whilst this seems like an unethical way of increasing productivity, I believe that this abundance makes people more relaxed and content, leading them to _choose_ to work.

<section class="wrapper style2 special boxout">
  <p>Having an abundance of ways to recreate reduces the likelihood of a recreational choice being taken.</p>
  <a class="button special" href="http://www.ncbi.nlm.nih.gov/pubmed/7815657">Medical Decision Making in Situations that Offer Multiple Alternatives</a>
</section>

Finally I make the point that business are made of the hard-earned money of shareholders, and the easily-spent heartbeats of the people working in them.

Whilst it's easy to be glib about wealth and privilege in what is arguably the most unequal society in history, it's worth bearing in mind that the money invested in businesses was earned by the exchange of heartbeats at some point, by someone.

If we choose to continue doing things that we now know are wrong, merely because it's 'the done thing' or 'what everyone else does', we are putting those heartbeats to waste.
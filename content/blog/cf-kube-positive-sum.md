---
author: Daniel Jones
date: "2018-05-08"
heroImage: /img/blog/kubecon-eu-2018.png
title: Cloud Foundry + Kubernetes is Positive-Sum

heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

Cloud Foundry's sweet spot has always been making stateless twelve-factor apps as easy to deploy as they _should be_. This functionality is as needed now as it's ever been - if not more so.

There is a huge potential to bring the benefits of Cloud Foundry to those folks handcrafting their own platforms on Kubernetes, saving them vast amounts of time and money as a result. As Cloud Foundry's [dear friend Sam Ramji would likely say: **this is a positive-sum game**](https://www.youtube.com/watch?v=qvvwAUZYdNk).

Kubernetes presents a lower-level abstraction than Cloud Foundry, from which folks can make their own platforms. It offers a container-scheduling _lingua franca_, and the ability for more granular concerns such as ensuring GPUs are available to a running process.

Hundreds of organisations are making [mind-boggling money savings](https://youtu.be/V8w4jf5clJk?t=1314) through the agility that Cloud Foundry brings. Some people have invested months of effort in building successful Kubernetes platforms; if each of those months was costing them $6m in lost efficiencies, I wonder if they would have made the same decision.

## CF Summit, JAX, KubeCon, oh my!

I've spent the last three weeks at conferences - first Cloud Foundry Summit NA 2018, then JAX DE, before finally co-chairing, MCing, moderating a panel at CF Day at KubeCon Europe 2018, and also staffing the Cloud Foundry booth.

At Cloud Foundry Summit I was amongst my CF ecosystem pals, where it seemed every other talk was about Kubernetes. At JAX I was surrounded by developers just trying to get on and write app code, caring more about libraries and functionality than trivial details like container scheduling.

At KubeCon I helped facilitate the Cloud Foundry Day, where we saw:

* Abby Kearns, Julz Friedman, Sanjay Patil and Caleb Miles discuss if and how Cloud Foundry and Kubernetes should blend
* Julz showed us the newly-renamed [Project Eirini](https://github.com/Andrew-Edgar/cube-release), which allows CF to deploy apps to Kubernetes instead of using the Diego runtime
* Dr. Max demonstrated Cloud Foundry deployed to Kubernetes using the [BOSH Kube CPI](https://github.com/bosh-cpis/bosh-kubernetes-cpi-release)

I spent hours with the awesome Cloud Foundry Foundation and Grape Up folks on the Cloud Foundry booth, explaining to Kubes fans what Cloud Foundry is, how it works, and what value it can offer.

I spent time talking to those using Kubernetes and considering using it. Many of them were interested very much in the technical details, and relishing the challenge of building their own platform that does _all the cool things_. Many of them didn't share [Alexis Richardson's cryptomnesic reference](https://youtu.be/qUK-F40oLVQ?t=572) of [Onsi Fakhouri's famous haiku](https://twitter.com/onsijoe/status/598235841635360768?lang=en).

Yet a good few realised that they didn't want to build their own platform, and just wanted to deploy apps. One person in particular was desperate to not have to reinvent the wheel and spend months on platform plumbing. For these folks with an eye on the bigger picture, Cloud Foundry offers enormous value.

## Runtime versus CI/CD

My ex-colleague [Daniel Bryant](https://twitter.com/danielbryantuk), who is a very articulate and likable chap, wrote a book called [Containerizing Continuous Delivery in Java](https://www.safaribooksonline.com/library/view/containerizing-continuous-delivery/9781491986851/) that details how to write CI/CD pipelines to enable continuous delivery of Java apps on Kubernetes. It's a great book, six chapters long, and I seem to recall he showed us some physical copies at London Continuous Delivery Meetup.

If you implemented the ideas in Daniel's book you'd have a great solution.

Or, you could just use a platform that leverages _buildpacks_. Oh, and wouldn't it be lovely if they worked more nicely with OCI images?

Cloud Foundry has a number of CI/CD challenges _solved_ as runtime concerns. Without buildpacks, everyone has to solve the same problems in every CI/CD pipeline.

## "Our Problem is Special"

When I joined the IT industry in the early 2000s, every business insisted it needed its own custom content-management system. Each business had its own workflow, and its own special requirements. There was no end of post-bubble developers eager to give them what they wanted, earning a pretty penny in the process. It would be years of natural selection and collaborative effort before someone gave them _all_ what they needed: WordPress.

We stand a great risk of thousands of organisations wasting their money and time building their own platforms atop Kubernetes. We already have a thing that caters for the vast majority of real business apps, and it's called Cloud Foundry. If it is not easy, simple, and natural for Kubernetes users to leverage the years of effort that have gone into Cloud Foundry, [we are allowing a great waste of time and money to occur. And you know how I feel about that.](https://youtu.be/QWMUYl0BkEI?t=1167)

Those of us who have worked on Cloud Foundry _know_ how much effort it is to create an enterprise-grade platform. It's not something that should be undertaken lightly, and is definitely not something that should be undertaken if your core line of business is _anything other_ than building platforms.

There are plenty of use-cases where 'dropping down' to Kubernetes makes perfect sense: one should not run monoliths nor machine learning on Cloud Foundry. Having a common abstraction that Cloud Foundry can sit upon whilst allowing the full flexibility of Kubernetes will reduce complication by merit of a smaller diversity of technology.

## CFF Projects and CNCF Projects

It is perfectly right that the Cloud Foundry ecosystem develop their own tools as and when they're needed. **Diego predates a stable and mature Kubernetes**. There was a pressing need for a massively-scalable container scheduler, and Diego delivered.

It is also perfectly right and reasonable that the Cloud Foundry Foundation should adopt Cloud Native Computing Foundation projects when they mature.

Cloud Foundry users want a _whole platform_ that _just works out of the box_. They do not want to waste time building their own from components. They realise that their time is better spent on enabling their business.

The CNCF's approach to incubating many projects, often with competing aims, allows a best-of-breed to appear through natural selection. Cloud Foundry needs things to work from the get-go, and can't wait for projects to slowly mature and offer enterprise features (**multi&#8209;tenancy,&nbsp;anyone?**).

As [Simon Wardley pointed out in his excellent talk at KubeCon](https://www.youtube.com/watch?v=xlNYYy8pzB4) (which I've seen three times at three events, and still elicits laughs) technology goes from being novel to being commoditised. Container scheduling has been commoditised, and so now is the time for Cloud Foundry to replace its own technical debt with a mature alternative. This is a rational engineering decision.

_(I use the term "technical debt" here with endearment. Every line of code you write is a future liability.)_

This pattern is well-established. It's that of acquisition. Successful incumbent enterprises let the frothy, effervescent world of startups produce a winner, and then acquire it.

## The Future

The collection of tools currently known as Cloud Foundry should continue to exist. Some people will want to deploy direct to IaaSes like vSphere, Openstack, AWS, GCP et al without an intermediate layer of Kubernetes. BOSH is peerless for this use-case.

Cloud Foundry should be easily-deployable atop Kubernetes, and should eventually leverage Kubernetes primitives for the sake of reducing complication. This does not diminish its raison d'etre: it is merely another way of achieving it.

Kubernetes does not displace Cloud Foundry. They are different projects, with different aims. If Kubernetes displaces anything, it's BOSH. Kubernetes offers us an abstraction _above_ all the various IaaSes that BOSH hides away for us, but _below_ that of the application.

Projects like [Eirini](https://docs.google.com/document/d/1qs6UQQDWMkfOpY19XqS3CfvI00jCns876TjplJ6E95s/edit#heading=h.poicq8c1xfqn) and [SCF](https://github.com/SUSE/scf) are blazing the trail towards this. I gather that Pivotal always wanted other Cloud Foundry Foundation members to contribute to Cloud Foundry. Now BOSH may no longer be the lynchpin, will their wish be granted with IBM, SAP and SUSE leading the Kubernetes charge?

## Non-zero

Some of my friends, who I have great admiration and respect for, have seen the overlap between Kubernetes and the Cloud Foundry ecosystem of tools, and talked about "wars" and "battles". This is nothing of the sort. **This is a positive-sum game** where end-users' productivity benefits.

* The Cloud Foundry ecosystem gets to adopt new mature implementations of its innards, freeing developers to work on new user-facing problems.
* The Kubernetes ecosystem will benefit greatly from having a ready-made solution for the vast majority of apps.

**This is not a playground argument** of _Sega vs Nintendo_ (or, if you're old and from the UK like me, _Spectrum vs Commodore 64*_ ). This is a matter of seeing how we can apply technology to **make our organisations, nations, and ultimately our lives more productive**.



_*Clearly the Sinclair Spectrum was best. It had the best games, hi-res graphics be damned!_

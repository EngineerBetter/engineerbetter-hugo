---
author: Eva Dinckel
date: "2018-08-31"
heroImage: /img/blog/manifest_pipeline.jpg
title:  Concourse-Up Manifest for beginners

heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

Concourse-Up was born in May 2017 and is a project that keeps on being nurtured by our team. We're proud to make a difference to our users working on a tool that makes their lives easier, because life is too short for worrying about your Concourse deployments!

To understand Concourse-Up, it is important to acknowledge the value of the Concourse-Up manifest, which is how we describe the exact combination of components that Concourse-Up deploys. This manifest used to be bundled as part of the tool, but we recently decoupled it and now maintain it as an independently deployable unit.

To make Concourse-Up as easy as possible to use, we've built a lot of opinions and default settings into the manifest. This post will attempt to explain what the Concourse-Up manifest is (and how we create it) in simple terms.

Using the metaphor of a set menu in a restaurant might help comprehend the flow of activity in our Concourse-Up Manifest pipeline. So here is the story:

- Picture yourself in a **restaurant**. An amazing restaurant that prides itself in always serving the freshest recipes by continuously updating them, to stay on top of its game.
- We will also need a **restaurant manager**, which in our situation will be the Concourse-Up manifest **pipeline**: the manager streamlines the whole process; it is in charge of orchestrating the flow of recipe updates by constantly keeping an eye on our **recipe book** of reference, called Bosh.io
- Our restaurant has a **menu** of dishes, which is in this case the Concourse-Up manifest.
	For the purpose of the explanation, let’s say that our menu only contains 5 **dishes**, corresponding to **releases** (or simply software). These releases include things like Concourse itself, but also things like Credhub, Grafana and UAA.
	Each dish is produced according to a list of ingredients and instructions taken from Bosh.io, our ‘bible’ as mentioned above.
- Let’s say that in the course of time, a Bosh.io release (=recipe in our menu) gets updated: we will need to react accordingly!

<img src="/img/blog/Boshio_recipe_book.jpg" class="image fit">

- In our kitchen, our manager will ask our **cook**, aka the **Bosh Director** to cook the new recipe for us (=get us the latest version of a release).

<img src="/img/blog/manager_tells_cook_new_recipe.jpg" class="image fit">

- Great, the recipe that needed to be updated has been cooked accordingly, it is now ready to go back on the menu. Before the restaurant makes the recipe available to customers, we need it to be approved by critics…
- Recipe approved? (=tasty enough to be sold to customers?) Great, they have passed what we call the **smoke tests**!

<img src="/img/blog/smoke_test_passed_new_menu.jpg" class="image fit">

- Our dishes (releases) are now at their freshest (latest version), are back on the menu, and ready to be enjoyed by our customers!

The value of continuously building the Concourse-Up manifest is to always have the ‘freshest’ version of our menu available (releases always at their latest version to prove the compatibility of these components).

We believe these recipes (or releases), work best when combined altogether to create our fantastic menu. But to make sure we have the best menu, our recipes need to be tested as combined altogether for a harmonious result.

And that is the magic of the Concourse-Up Manifest pipeline!


Well, all of this made me hungry! 😋
I hope the sketches will help (made with love, not with talent).

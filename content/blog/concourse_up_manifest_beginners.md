***Concourse-Up Manifest for beginners***



Concourse-Up was born a few years ago and is a project that keeps on being nurtured by our team of engineers. EngineerBetter is proud to make a difference by working on a CI tool that makes the life of our users easier, because life is too short for long Concourse and BOSH deployments!

To understand Concourse-Up, it is important to acknowledge the value of the Concourse-Up manifest, which is in charge of important testing.
This post will attempt to explain what the Concourse-Up manifest is in simple terms; the analogy below might help comprehend the flow of activity in our Concourse-Up Manifest pipeline. So here is the story:

- Picture yourself in a **restaurant**. An amazing restaurant that prides itself in always serving the freshest recipes by continuously updating them, to stay on top of its game.
- We will also need a **restaurant manager**, which in our situation will be the Concourse-Up manifest **pipeline**: the manager streamlines the whole process; it is in charge of orchestrating the flow of recipe updates by constantly keeping an eye on our **recipe book** of reference, called Bosh.io
- Our restaurant has a **menu** of dishes, which is in this case the Concourse-Up manifest.
	For the purpose of the explanation, let’s say that our menu only contains 5 **dishes**, corresponding to **releases** (or simply software)
	Each dish is produced according to a list of ingredients and instructions taken from Bosh.io, our ‘bible’ as mentioned above.
- Let’s say that in the course of time, a Bosh.io release (=recipe in our menu) gets updated: we will need to react accordingly!

![Bosh recipe Book](/img/Boshio_recipe_book.jpg)

- In our kitchen, our manager will ask our **cook**, aka the **Bosh Director** to cook the new recipe for us (=get us the latest version of a release).

![Cook new recipe](/img/manager_tells_cook_new_recipe.jpg)


- Great, the recipe that needed to be updated has been cooked accordingly, it is now ready to go back on the menu. Before the restaurant makes the recipe available to customers, we need it to be approved by critics…
- Recipe approved? (=tasty enough to be sold to customers?) Great, they have passed what we call the **smoke tests**!

![Smoke tests pass](/img/smoke_tests_passed_new_menu.jpg)


- Our dishes (releases) are now at their freshest (latest version), are back on the menu, and ready to be enjoyed by our customers!
- This is the appeal of the Concourse-Up manifest: to always have the ‘freshest’ version of a menu available (releases always at their latest version to enable continuous integration with relevant dependencies). These recipes (or releases), work best when combined altogether to create our fantastic menu. But to make sure we have the best menu, our recipes need to be tested as combined altogether for a harmonious result
- And that is the magic of the Concourse-Up Manifest pipeline!


Well, all of this made me hungry! 😋
I hope the sketches will help (made with love, not with talent).

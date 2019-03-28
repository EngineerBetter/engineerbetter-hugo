---
author: Eva Dinckel and Dan Young
date: "2019-03-25"
heroImage: /img/blog/control-tower-photo.jpg
title: Concourse-Up becomes Control-Tower
heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

<figure>
    <figcaption style="font-size: 8pt">
    Photo by <a href="https://unsplash.com/photos/Wc4WBReAMUw?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Cassie Matias</a> on Unsplash
    </figcaption>
</figure>

## What happened?

Concourse-Up has changed its name to **[Control Tower](https://github.com/EngineerBetter/control-tower) for Concourse**. The repo and release naming has changed, along with all mention of concourse-up in the codebase, and the resources that Control Tower creates. In all other ways, Control Tower is the same thing as Concouse-Up.


## Why have we done this?

The main reason for doing this is the [Concourse CI trademark guidelines](https://concourse-ci.org/trademarks.html). By meeting these guidelines, we now have more freedom over the direction we can take Control Tower as a product, including how we distribute or commercialise it in the future.


## What else is new?

As well as containing a collection of bug fixes and improvements, Control-Tower also supports the long awaited [Concourse 5.0](https://concourse-ci.org/download.html#v500), which introduces a number of improvements and the first steps towards Role Base Access Control (RBAC).

Control Tower [supports deployments on GCP](/blog/concourse-up-gcp/) as well as AWS. As part of our new IaaS-provider agnostic direction, we now *require* users to provide the ```--iaas``` flag when deploying.

## How do I upgrade to Control Tower?

We are currently looking at ways to provide a smooth, automated process to migrate your *Concourse-Up* deployment to a *Control Tower* deployment. If this is very important to you, please let us know your thoughts. In the meantime, Colin Simmons from our team has written a post describing [how we migrated our own deployment](/blog/migrating-to-control-tower/).

## What's next?

We're still committed to providing support for Azure users, so stay tuned for that. We're also working on providing Control Tower via channels other than Github, to reach a wider set of users and would be interested to get your feedback on issues such as commercial support or other useful enterprise features.


To chat with our team and other users about Control Tower, please join our community on Slack [Concourse-Up User Slack](https://join.slack.com/t/concourse-up/shared_invite/enQtNDMzNjY1MjczNDU3LTA1NzIxYTZkYjFkMjA2ODBmY2E2OTM3OGE3YTc2OGViNTMxYTY4MjYwNGNjOTAxNDNiOGE5NzhmMTQ2NWVhNzQ) and share your thoughts!

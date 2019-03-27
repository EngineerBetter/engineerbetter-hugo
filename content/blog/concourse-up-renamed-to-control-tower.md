---
author: Eva Dinckel and Dan Young
date: "2019-03-18"
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

Concourse-Up has changed its name to [Control Tower](https://github.com/EngineerBetter/control-tower) for Concourse. This means that all mention of concourse-up has also been removed from the codebase, and the resources that Control Tower creates.


## Why have we done this?

The main reason for doing this is the [Concourse CI trademark guidelines](https://concourse-ci.org/trademarks.html). By meeting these guidelines, we now have more freedom over the direction we can take the product, including how we distribute or commercialise it in the future.


## What else is new?

Control-Tower supports the long awaited [Concourse 5.0](https://concourse-ci.org/download.html#v500), which introduces a number of improvements and the first steps towards Role Base Access Control (RBAC).

As well as AWS, Control-Tower supports deployments on GCP [as of recently](/blog/concourse-up-gcp/). To demonstrate our new IaaS-provider agnostic stance, we now *require* users to provide the ```--iaas``` flag when deploying.

## How do I upgrade to Control Tower?

We are currently looking at a smooth, automated process to migrate your *Concourse-Up* deployment to a *Control Tower* deployment. In the meantime, Colin Simmons from our team has written a post describing [how we migrated our own deployment](/blog/migrating-to-control-tower/).

## What's next?

We're still committed to providing support for Azure users, so stay tuned for that. We're also working on providing Control Tower via channels other than Github, to reach a wider audience and would be interested to get user's feedback on commercial support or other useful enterprise features.


To chat with our team and other users about Control Tower, please join our community on Slack [Concourse-Up User Slack](https://join.slack.com/t/concourse-up/shared_invite/enQtNDMzNjY1MjczNDU3LTA1NzIxYTZkYjFkMjA2ODBmY2E2OTM3OGE3YTc2OGViNTMxYTY4MjYwNGNjOTAxNDNiOGE5NzhmMTQ2NWVhNzQ) and share your thoughts!

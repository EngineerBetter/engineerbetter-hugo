---
author: Eva Dinckel and Dan Young
date: "2019-01-31"
heroImage: /img/blog/gcp-logo.png
title:  Announcing Concourse-Up for GCP
draft: true
heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

## Going Multi-Cloud

In 2017 we [announced Concourse-Up](/blog/introducing-concourse-up) - the fastest way to go from nothing to a fully working production Concourse CI, using just a single command. 

Since then, we added a lot of operational features to help folks spend as little time as possible thinking about CI administration. This includes the ability for a [Concourse-Up](https://github.com/EngineerBetter/concourse-up) deployment to automatically upgrade itself when new versions of Concourse-Up are released, keeping you up to date with Concourse and all the components (UAA, Credhub, Grafana, etc).

Last year our team made the decision to pursue multi-cloud support, to serve a wider range of users.  Concourse-Up used to be an AWS-specific tool, but now we're bringing the same fire-and-forget experience to the other major public clouds.

**Today we are pleased to announce GCP support for Concourse-Up, including all the same features we offer on AWS.**

## Set up Concourse on GCP, in one command

First make sure Concourse-Up knows [where to find your GCP credentials](https://github.com/EngineerBetter/concourse-up). Then get yourself a new Concourse CI on GCP by running the following:

`concourse-up deploy <deployment-name> --iaas gcp` 

This will create a new deployment in the default region (`europe-west1`). Add `--region` to choose a region.

If you have a DNS zone configured in Cloud DNS, then you can deploy with a custom domain name. Concourse-Up will generate you a CA-signed certificate using Let's Encrypt for any domain you provide.

`concourse-up deploy artichoke-ci --iaas gcp --domain artichoke-ci.yourdomain.com`

Go grab a cup of coffee, then come back to find your Concourse ready to use at https://artichoke-ci.yourdomain.com

Of course, you still get the usual out-of-the-box integrations including the Grafana dashboard for viewing metrics and Credhub for storing your secrets.

Since multi-cloud is still an experimental feature, for now the `--iaas` deploy option is not mandatory, meaning Concourse-Up will default to AWS deployment unless told otherwise. We expect to change this soon once GCP support has been thoroughly tested in the field.


## Operating your Concourse on GCP

Our goal is to bring feature partity across all the IaaS platforms we support. Once you're up and running on GCP, you may want to do things like this:

* Scaling out workers with `--workers`
* Scaling up the Concourse database with `--db-size`
* Changing worker size with `--worker-size`
* Apply firewall policy using `--allow-ips`
* Providing a TLS cert rather than letting Concourse-Up generate it
* Resource tagging (coming soon!)

By default, Concourse-Up will deploy your Concourse on GCP preemptible instances for cost efficiency, but you can disable this with `--preemptible=false`.

## What gets deployed?

The deployment looks remarkably similar to what you get on AWS. The high level picture looks like this:
<img alt="Concourse-Up on GCP Diagram" src="/img/blog/concourse-up-gcp.svg" class="image fit">

## Testing, Testing, Testing

We do *a lot* of system testing. In fact, this is one of the ways we work towards our vision of being the world's easiest way to run your own Concourse in production. We think it should *just work* first time, and you should never have to worry about it again.

Whichever IaaS you choose, by the time you receive a `concourse-up` release we've already created, upgraded, modified and deleted many Concourses over many hours using the same code. We do this on our own Concourse-Up deployment [ci.engineerbetter.com](https://ci.engineerbetter.com). Optimising our testing is a relentless task, for the point of view of both feedback loops and IaaS costs.

We integrate new releases of Concourse-Up components into [our manifest](/blog/concourse_up_manifest_beginners/) immediately, so sometimes our rigorous testing catches Concourse upstream issues earlier than the rest of the community.

## What next?

We're committed to supporting all three major cloud providers, so next stop for the Concourse-Up team is Azure support. We'll keep you updated on progress on this.

In the meantime, please let us know your feedback on how Concourse-Up for GCP by joining our team on on [Concourse-Up User Slack](https://join.slack.com/t/concourse-up/shared_invite/enQtNDMzNjY1MjczNDU3LTA1NzIxYTZkYjFkMjA2ODBmY2E2OTM3OGE3YTc2OGViNTMxYTY4MjYwNGNjOTAxNDNiOGE5NzhmMTQ2NWVhNzQ).

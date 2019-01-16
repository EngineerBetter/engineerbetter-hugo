---
author: Eva Dinckel and Dan Young
date: "2019-01-16"
heroImage: /img/blog/gcp-logo.png
title:  Announcing Concourse-Up for GCP
draft: true
heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

## Going Multi-Cloud

In May 2017 we [announced Concourse-Up](/blog/introducing-concourse-up) - the fastest way to go from nothing to a fully working Concourse CI using just a single command. Since then, we’ve kept adding operational features to improve the lives of folks running Concourse CI in their organisations, including the ability for Concourse to automatically upgrade itself.

[Concourse-Up](https://github.com/EngineerBetter/concourse-up) has previously only been available for AWS, but last year our team made the decision to pursue multi-cloud support and began thinking about how to bring the same experience to users of other infrastructure platforms like Google Cloud Platform, Azure and vSphere. 

**Today we are pleased to announce GCP support for Concourse-Up, with all the same features we offer on AWS**

## Set up Concourse on GCP, in one command

First make sure Concourse-Up knows where to find your GCP credentials. Then, to get yourself a new Concourse CI on GCP, just run the following:

`concourse-up deploy <name> --iaas gcp` 

This will create a new deployment in the default region (`europe-west1`). Just add `--region` to choose a region.

If you have a DNS zone configured in Cloud DNS, then you can deploy with a custom domain name. Concourse-Up will generate you a CA-signed certificate for any domain you provide.

`concourse-up deploy artichoke-ci --iaas gcp --domain artichoke-ci.yourdomain.com`

Go grab a cup of coffee, then come back to find your Concourse ready to use at https://artichoke-ci.yourdomain.com

Of course, you still get the usual out-of-the-box integrations including the Grafana dashboard for viewing metrics and Credhub for storing your secrets.

Since multi-cloud is still an experimental feature, for now the `--iaas` deploy option is not mandatory, meaning Concourse-Up will default to AWS deployment unless told otherwise. 


## Operating your Concourse on GCP

Our goal is to bring feature partity across all the IaaS platforms we support. Once you're up an running on GCP, you may want to use Concourse-Up to perform these operations:

* Scaling out workers with `--workers`
* Scaling up the Concourse database with `--db-size`
* Changing worker size or instance type with `--worker-type`
* Apply firewall policy using `--allow-ips`
* Providing a TLS cert rather than letting Concourse-Up generate it
* Resource tagging (coming soon!)

By default, Concourse-Up will deploy your Concourse on GCP preemptible instances for cost efficiency, but you can disable this with `--preemptible false`.

## What next?

We're committed to supporting all three major cloud providers, so next stop for the Concourse-Up team is Azure support. We'll keep you updated on progress on this.

In the meantime, please let us know your feedback on how Concourse-Up for GCP by joining our team on on [Concourse-Up User Slack](https://join.slack.com/t/concourse-up/shared_invite/enQtNDMzNjY1MjczNDU3LTA1NzIxYTZkYjFkMjA2ODBmY2E2OTM3OGE3YTc2OGViNTMxYTY4MjYwNGNjOTAxNDNiOGE5NzhmMTQ2NWVhNzQ).
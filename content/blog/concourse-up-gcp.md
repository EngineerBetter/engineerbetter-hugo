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

## Going multi-cloud

In May 2017 we announced Concourse-Up - the fastest way to go from nothing to a fully working Concourse CI using just a single command. Since then, we’ve kept adding operational features to improve the lives of folks running Concourse CI in their organisations, including the ability for Concourse to automatically upgrade itself.

Concourse-Up has previously only been available for AWS, but last year our team made the decision to pursue multi-cloud support and began thinking about how to bring the same experience to users of other infrastructure platforms like GCP, Azure and vSphere. 

**Today we are pleased to announce GCP support for Concourse-Up, with all the same features we offer on AWS**

## Set up Concourse on GCP, in one command

First make sure Concourse-Up knows where to find your GCP credentials. Then, to get yourself a new Concourse CI on GCP, just run the following:

`concourse-up deploy <name> --iaas gcp` 

This will create a new deployment in the default region (europe-west1). Just add `--region` to choose a region.

If you have a DNS zone configured in Cloud DNS, then you can deploy with a custom domain name. Concourse-Up will generate you a CA-signed certificate for any domain you provide.

`concourse-up deploy artichoke-ci --iaas gcp --domain artichoke-ci.gcp.engineerbetter.com`

Go grab a cup of coffee, then come back to find your Concourse ready to use at https://artichoke-ci.gcp.engineerbetter.com

Of course, you get the usual out-of-the-box integrations including the Grafana dashboard for viewing metrics and Credhub for storing your secrets.

Since multi-cloud is still an experimental feature, for now the `—iaas` deploy option is not mandatory, meaning Concourse-Up will default to AWS deployment unless told otherwise. 


## Operating your Concourse on GCP

Our goal was to allow GCP users to enjoy all the same features as AWS users. Common operational tasks include:

* Scaling out your workers 
* Scaling up your database
* Changing worker size or instance type
* Apply firewall policy using —allow-ips
* Provide your own TLS cert
* Disable use of preemptible instances (default option)
* Resource tagging (coming soon!)

## What next?

We're committed to supporting all three major cloud provides, so next stop for the Concourse-Up team is Azure support. We'll keep you updated on progress!

In the meantime, please let us know your feedback on how Concourse-Up for GCP by joining our team on on [Concourse-Up User Slack](https://join.slack.com/t/concourse-up/shared_invite/enQtNDMzNjY1MjczNDU3LTA1NzIxYTZkYjFkMjA2ODBmY2E2OTM3OGE3YTc2OGViNTMxYTY4MjYwNGNjOTAxNDNiOGE5NzhmMTQ2NWVhNzQ).
---
title:  Bringing Perpetual Motion to System Upgrades - Self-Upgrading Concourse CI
---

<img src="/update/images/blog/perpetual-motion.jpg" class="image fit" />

We've recently been working on adding functionality to [Concourse-Up](https://github.com/EngineerBetter/concourse-up), based on feedback from users in the community and our own teams who've been using it in production with customers. Being able to deploy a Concourse cluster using a single command was great, but not ideal; you still had to run it again to upgrade. What if you could just run a single command, and then _never have to think about it again_? In pursuit of this goal, we added a self-update feature.

<!--more-->

## Self-update

<img src="/update/images/blog/self-update.png" class="image fit" />

When Concourse-up deploys Concourse, it now adds a pipeline to the new Concourse called `concourse-up-self-update`. This pipeline continuously monitors our Github repo for new releases and updates Concourse in place whenever a new version of Concourse-up comes out.

This means that our own [ci.engineerbetter.com](https://ci.engineerbetter.com) not only continuously builds, tests and releases new versions of `concourse-up` whenever it finds a new component or stemcell on [bosh.io](https://bosh.io), but that same CI server then continuously upgrades *itself* using the `concourse-up` releases it has built.

This approach embodies **what we believe about enterprise software updates**. They aren't a point in time activity - **they should be transparent, continuous and utterly boring, just like updates to apps on your phone**.

## How Self-update Works

It hurts my head to think about how this actually works for more than five minutes at a time but I'll do my best to explain it here.

Internally, Concourse-up runs the following tasks idempotently when deploying:

1. Build AWS infrastructure using Terraform
1. Deploy a bosh director and Concourse deployment
1. Set the self-update pipeline

Let's say we release an update that updates some code on the Concourse worker VM. This will result in BOSH taking down the worker node during step 2 in order to update the code running on it. Which would result in downtime for the Concourse. Now if this update was triggered by a self-update job running on the Concourse _itself_, we're going to run into trouble as BOSH will try and update the VM that is running the job that triggered BOSH to update the VM in the first place (this is where my head starts to hurt).

When you run a task in BOSH like a deployment, typically BOSH streams the output back to you. But BOSH also lets you background the task and it will keep going by itself until it finishes. This is what the Concourse-up self-update pipeline does to ensure that the CI job that triggers the update finishes so that BOSH can drain the worker and update the VM.

But if you look at our 3 tasks above, you can see that if we exit early during task 2, we'll never get to do task 3 — set the self-update pipeline. This means if we wanted to update our self-update pipeline (meta, I know) we wouldn't be able to. Therefore in self-update mode, Concourse-up changes the order and runs the tasks this way:

1. Build AWS infrastructure using Terraform
1. Set the self-update pipeline
1. Deploy a bosh director and Concourse deployment (and exit early to let BOSH do it's thing)

This ensures that any new self-update pipelines get set, and that the CI job can safely exit know BOSH is upgrading Concourse in the background.

In addition to self-update, we also added a whole bunch of other features:

## Metrics

<img src="/update/images/blog/ci-metrics.png" class="image fit" />

Concourse-up now automatically deploys Influxdb, Riemann, and Grafana on the web node. You can access Grafana on port 3000 of your regular concourse URL using the same username and password as your Concourse admin user. We put in a default dashboard that tracks

* Build times
* CPU usage
* Containers
* Disk usage

## Scale your RDS database

One of our teams was having performance issues on their Concourse-Up deployment, once they reached a certain number of pipelines. Concourse-up used to use a non-configurable `t2.small` RDS instance. It turns out a [t2.small](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/t2-instances.html) can consume 20% CPU over time before it starts to lose CPU credits. If >20% CPU utilisation continues, it eventually loses all its accumulated credits, and starts to be throttled. This was happening on one of our customers, which slowed down everything that accesses the DB, including the UI and builds themselves.

We wanted to be able to vertically scale the database, just like the workers. If you need a bigger database, you can now change the size of your RDS instance using the `--db-size` flag.

## Cost efficiency

We realised we were being too generous with infrastructure. By reducing instance sizes of the bosh director, Concourse web node, RDS and by removing the unnecessary ELB, we've saved about $90/mo in AWS costs on the default deployment.

## All Regions

We were using m3 instance types for some jobs — these aren't supported in all AWS regions. We've updated Concourse-up to only use instances available in all AWS regions.

## NAT Gateway

Many enterprise users need to give Concourse access to their internal services. This usually involves white-listing IP addresses but can be tricky when the workers use ephemeral IPs. We've added a NAT gateway so that there is a single persistent IP for outbound traffic. It also adds an extra layer of security by preventing the workers from being directly addressed.

## DB Encryption by default

Concourse has the option to encrypt its database, but it isn't enabled by default. Concourse-up now enables encryption of the Concourse DB. Run `concourse-up info --json <YOUR DEPLOYMENT NAME>` if you need to recover your DB encryption key.

And that's the latest news on Concourse-up! If you have any feedback or suggestions please feel free to get in touch with us or create a [github issue](https://github.com/EngineerBetter/concourse-up).

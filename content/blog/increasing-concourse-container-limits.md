---
author: Andy Paine
date: "2020-08-21"
heroImage: /img/blog/container-limits/container-limits.jpg
title:  Increasing Concourse worker container limits

heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

Concourse runs all pipeline processes inside containers providing isolation, security and customisability. By default each Concourse worker allows only 250 containers to run concurrently, leading to the dreaded **`max containers reached`** error message. Thankfully this limit can be **increased with two simple flags**. How can you do this, _should_ you do this, and why was the limit 250?

## Hitting the limit
Concourse/Garden is quite clear about what is happening when the container limit is reached, turning the job orange (the colour for "something within Concourse has failed") and providing the error message `max containers reached`.

<figure>
  <img src="/img/blog/container-limits/max-containers.png" class="fit image">
  <figcaption>Concourse UI when a job cannot run due to the max-containers limit being reached</figcaption>
</figure>

The worker that attempted to run the job was already busy running other containers. In situations where the container limits are dominated by a fixed number of resource `check` containers or small `job`s, this can start to happen frequently, even when **the worker has spare CPU, free memory** etc.

Concourse supports volumes that are shared between workers. Workers will stream these volumes between themselves when a job that was previously run on one worker has been scheduled onto a different worker. This can lead to additional network traffic and even [additional cost](https://aws.amazon.com/ec2/pricing/on-demand/#Data_Transfer), which can be alleviated by **running fewer, more powerful worker instances**. The more powerful an instance is, the more likely it is to reach the container limit before exhausting all available resources.

<section class="boxout">
<p>When workers start to hit their container limit without hitting any resource limits, it may be worth increasing the max-containers per worker</p>
</section>

## Increasing the limit
Concourse exposes a flag or environment variable for configuring the number of max containers (`--garden-max-container` or `CONCOURSE_GARDEN_MAX_CONTAINERS`) which defaults to 250 when not explicitly provided. Increasing this number beyond 250 quickly raises another error: `insufficient subnets remaining in the pool`.
<figure>
  <img src="/img/blog/container-limits/insufficient-subnets.png" class="fit image">
  <figcaption>Concourse UI when a job cannot run due to not having enough available subnets</figcaption>
</figure>

When creating a container, Garden allocates that container a set of IP addresses. The range these addresses can be selected from is provided by the `--garden-network-pool` flag or the `CONCOURSE_GARDEN_NETWORK_POOL` environment variable, and defaults to `10.254.0.0/22` - a range of 1024 available addresses. As Garden allocates a `/2` subnet for each container, this range gets exhausted at 256 running containers - barely more than the 250 max-container limit. By **setting the network pool to `10.254.0.0/16`** to allow for 65,536 potential addresses, which corresponds to 16,384 potential containers, the max-container option can be used by itself to cap the number of containers running per-worker.

## How high?
Given the above tweaks - just how many container _can_ a Concourse worker run? We tested a few scenarios using a Concourse deployed by [Control Tower](https://github.com/EngineerBetter/control-tower) to see if the ~~sky~~ instance size was the limit or if Concourse would trip up before then. Control Tower uses [Telegraf](https://www.influxdata.com/time-series-platform/telegraf/) for sending metrics data for monitoring jobs which we found to struggle under high loads and so was removed for some tests.

* AWS `m4.xlarge` instance ~720 containers
* AWS `m4.4xlarge` instance ~1200 containers
* AWS `m4.4xlarge` instance without `telegraf` ~2000 containers
* AWS `m4.4xlarge` instance without `telegraf` using experimental Concourse `containerd` backend ~1700 containers

These tests were all performed using jobs that ran `sleep 1200` and all tests eventually concluded due to being limited by available CPU. Running so many containers likely meant that eventually the overhead of performing so many process swaps started to dominate the CPU usage. This is obviously not a realistic workload as real Concourse jobs will be significantly more CPU intensive and would hit contention far before this. The experimental `containerd` backend seems to perform similarly well as the existing Garden integration and the Concourse team plan on [comparing the performance of the two](https://github.com/concourse/concourse/issues/5545).

<section class="boxout">
<p>Concourse can support significantly more than 250 containers per-worker and is limited only by the available processing resources</p>
</section>

## Why 250 containers?
Concourse uses the same default provided by the [garden-runc-release](https://github.com/cloudfoundry/garden-runc-release) of 250 containers maximum per-worker. Historically, Garden has mainly been used in [Diego](https://docs.cloudfoundry.org/concepts/diego/diego-architecture.html) for running user workloads in Cloud Foundry where features such as disk quotas are an important part of the platform. To implement these disk quotas, fixed-size loop devices were used which are limited to 255 by the kernel itself. Things have moved on since then and Garden now uses an overlay + xfs approach to disk quotas, removing the need for the 255 limit. Diego continues to use this old default due to **not needing to increase the limit** and thus **not having tested beyond 250 containers**.

## Concourse vs. Diego
Concourse has a different usage pattern compared to Diego in that Concourse containers are generally short-lived, and when they are running, they're usually doing some work. Diego is used for running customer sites as well as background processing which can spend significant periods idle. However, **Concourse containers often require fewer resources** than their Diego counterparts - as a pipeline grows and the number of resources increases, a significant number of the available containers are dedicated to **running cheap resource `check`s** rather than expensive `job`s. This is particularly true when jobs are triggered infrequently but resources continue to be checked at a constant rate.

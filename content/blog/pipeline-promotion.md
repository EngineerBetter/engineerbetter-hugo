---
author: Colin Simmons
date: "2019-08-07"
heroImage: /img/blog/promotion/flow.png
title: Properly Promoting Pipelines
heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

At EngineerBetter we spend a lot of time building Concourse pipelines to deploy complex systems such as Cloud Foundry. Here is an example of one of these pipelines:

<figure>
  <img src="/img/blog/promotion/basic.png" class="fit image">
  <figcaption>Deploying Cloud Foundry the right way</figcaption>
</figure>

It is simple, easy to understand, and it gets the job done. For most customers, however, the objective is rarely to deploy just one foundation. Usually there is a need for multiple deployments in multiple regions and possibly even on a multitude of IaaSes. Getting updates through this multi-dimensional labyrinth without breaking anything is the real challenge.

Our recommendation to customers is to always run at least three "levels" of foundations.

1. Sandbox where the platform team can test new releases without worrying about causing downtime.
1. Pre-Production where developers can test changes.
1. Production where the end users are.

The general idea is that any change or update to the platform is sequentially made then tested in each level before being promoted to the next.

<figure>
  <img src="/img/blog/promotion/flow.png" class="fit image">
  <figcaption>Promoting between foundations for safer deploys</figcaption>
</figure>

## Problems with Promotion

This strategy is good in theory but once you start planning an implementation a number of questions start to appear.

{{% boxout %}}

- How do you figure out what versions of all the resources have passed the pipeline?
- How do we pin versions of any resource type?
- How can all of this happen without manual interaction?

{{% /boxout %}}

This topic quickly becomes 🤯 once you dive into it so it helps to tackle each question individually.

## What versions did my pipeline use?

The first problem we need to tackle is how to determine the versions of resources that have passed through the pipeline successfully. Logically the best time to determine this is at the end of the pipeline. Therefore our first change is to [pass][passed] each resource all the way through the pipeline from wherever it is first used to the end. We'll also add a placeholder job called promote-versions to the end which `get`s all of these versions.

Our pipeline now looks like this:

<figure>
  <img src="/img/blog/promotion/pipe-1.png" class="fit image">
  <figcaption>Pass all the resources all the way to the end</figcaption>
</figure>

Next we can flesh out the implementation of this new job. The goal is that we input all the versions and output a file containing their versions.

Here is a task that does this:

```yaml
---
platform: linux
 inputs:
  - name: pipeline-promotion
  - name: build-metadata
 outputs:
  - name: resource-versions
 params:
  CONCOURSE_URL:
  CONCOURSE_USERNAME:
  CONCOURSE_PASSWORD:
 run:
  path: bash
  args:
  - "-euc"
  - |
    fly --target ci \
      login \
      --insecure \
      --concourse-url "$CONCOURSE_URL" \
      --username "$CONCOURSE_USERNAME" \
      --password "$CONCOURSE_PASSWORD"

    fly -t ci sync

    export ATC_BEARER_TOKEN=$(bosh int --path /targets/ci/token/value ~/.flyrc)

    PIPELINE_NAME=$(<build-metadata/build-pipeline-name)

    team=$(cat build-metadata/build-team-name)

    job=$(cat build-metadata/build-job-name)

    stopover.v2 \
    ${CONCOURSE_URL} \
    $team \
    ${PIPELINE_NAME} \
    $job \
    $(cat build-metadata/build-name) \
    > resource-versions/versions.yml
```

The secret sauce in this task is [stopover][stopover] which is a Golang CLI we made for this exact purpose. Essentially stopover uses the [metadata resource][metadata] and the [Concourse Go client][go-concourse] to grab all the resources that were gotten in the job running the task.

In our case the outputted `versions.yml` file looks like:

```yaml
resource_version_bosh-deployment:
  ref: ef486c57bb2a1139d2caa1c548cb8e952c30aad6
resource_version_build-metadata:
  random: "13192"
resource_version_cf-deployment:
  id: "17959355"
  tag: v9.3.0
  timestamp: 2019-06-13T02:50:15Z
resource_version_cf-smoke-tests:
  ref: 8f6d750879fecebfc8104a2848ddcfff55526053
resource_version_pcf-ops-image:
  digest: sha256:f5f55baeaf22cab8032d553aa4db01c6b77098b73d7fd30203a8a49bc1728ca5
resource_version_pipeline-promotion:
  ref: d8e32d793d97658a6736ad77f42b2cb94ea65990
```

## Using the stopover output file

So now we have a new YAML file. What do we do with it?

When you set a pipeline you can provide a vars file with `--load-vars-from`. So we can use our new YAML file to fill in placeholders on every resource pinning them to these specific versions. In order to pin resources of any resource-type (even bosh-deployment) we can use the [`version` option on `get`][get-version]. This lesser known option lets you specify a specific version to `get` _in the format that the resource presents versions to Concourse_. Coincidentally this is the format that `stopover` produces.

Since this is a feature of Concourse rather than part of a specific resource implementation it will work the same way for any resource type.

So the first time we get each resource we just need to add a `version` placeholder. For example, the start of a `terraform` job would look like:

```yaml
- name: terraform
  plan:
  - in_parallel:
    - get: pipeline-promotion
      version: ((resource_version_pipeline-promotion))
      trigger: true
    - get: pcf-ops-image
      version: ((resource_version_pcf-ops-image))
```

### How do we set sandbox?

You may have noticed that we now need a versions file from `stopover` to set our pipelines. Sounds great but how do we set the first pipeline in the chain since there is no stopover output to use? Generally the first pipeline in the chain is for deploying the sandbox foundation where we just want to use the latest available version of everything.

The easiest approach is to create a static versions file for this pipeline with `latest` as every version. The placeholder version file in our case would look like:

```yaml
resource_version_bosh-deployment: latest
resource_version_build-metadata: latest
resource_version_cf-deployment: latest
resource_version_cf-smoke-tests: latest
resource_version_pcf-ops-image: latest
resource_version_pipeline-promotion: latest
```

## Tying it all together

Now we've got a list of all the resource versions that have passed each pipeline and we know how to use this file to pin the resource versions in the next environment(s).

The next step is to make these links between pipelines happen without manual intervention. The final approach for automating environment promotion varies greatly from customer to customer. For an example of how we helped [Unit 2 Games](https://unit2games.com/) do this check out [our blog post on Continuous Infrastructure on GCP][unit2]

[passed]: https://concourse-ci.org/get-step.html#get-step-passed
[stopover]: https://github.com/EngineerBetter/stopover
[metadata]: https://github.com/mastertinner/build-metadata-resource
[go-concourse]: https://github.com/concourse/concourse/tree/master/go-concourse
[get-version]: https://concourse-ci.org/get-step.html#get-step-version
[unit2]: /blog/continuous-infrastructure-google-cloud

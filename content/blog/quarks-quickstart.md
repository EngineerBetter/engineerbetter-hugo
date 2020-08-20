---
author: Jessica Stenning
date: "2020-08-20"
draft: true
heroImage: tbc
title: Quarks - a quickstart guide to deploying a BOSH release on K8s

heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

As the CF community moves towards the Kubernetes era of dominance, a few possible solutions for deploying CF on Kubernetes have surfaced, one such solution is the combination of Quarks and KubeCF. KubeCF is a Cloud Foundry Application Runtime (CFAR) distribution for Kubernetes working with Quarks to deploy and manage cf-deployment releases. Beyond this however, Quarks has introduced a wider method for deploying BOSH releases on K8s -> BOSH releases are converted to Docker Images and the BOSH deployment manifest is converted to a custom `boshdeployment` resource.

However, when learning how to get your BOSH releases deployed on Kubernetes, the end-to-end process isn't documented in any one place - this blog post brings together a step-by-step guide to deploying a BOSH release on Kubernetes with Quarks.

## What is Quarks?
When we refer to Quarks we're largely referring to the deployment of the `cf-operator` (soon to be renamed the `quarks-operator` to reflect it's broader functionality). The `cf-operator` brings with it custom resource definitions (CRDs) that extend the Kubernetes API. Once deployed, the `cf-operator` watches for the creation of the custom `boshdeployment` resource, then works its magic to translate the sum into a desired manifest and ultimately a running BOSH deployment on K8s.

For more information on how Quarks utilises Kubernetes controllers to handle the complete workflow from a custom `boshdeployment` resource through to the translation and creation of Kubernetes native StatefulSets, Pods etc., it's worth taking a look at the [documentation]() - the controller diagrams are especially helpful.

## Steps for deploying a BOSH release with Quarks

It's worth noting that Helm Charts aready exist for the deployment of some BOSH releases, e.g. [KubeCF]() and [Concourse CI](https://github.com/concourse/concourse-chart). If you're looking to deploy a BOSH release on Kubernetes, it's worth checking that there isn't already an upstream Helm Chart published for that release, as that will likely be more straightforward deployment process.

### 1. Install the `cf-operator` in your cluster
This is fairly straight forward and can be completed with Helm. There are a few customisations that can be set by passing additional values to the install command, but broadly you'll want to make sure the namespace you place the cf-operator in is sensibly named and dedicated. The example below also sets the namespace that the cf-operator will 'watch' for the creation of custom resources.

```
helm repo add quarks https://cloudfoundry-incubator.github.io/quarks-helm/

helm install cf-operator quarks/cf-operator \
  --namespace cf-operator \
  --set "global.singleNamespace.name=mydeployment"
```

For a full list of customisations that can be passed to the cf-operator installation take a look at the [Helm Chart](https://hub.helm.sh/charts/quarks/cf-operator).

### 2. Do you have a Docker Image?

   Do you need to convert your you BOSH release into a Docker Image, or does this exist already? If the answer is 'yes, I have a Docker Image of my release', then you can go ahead and skip the rest of this section.

   If you're still reading then the first step is to convert your BOSH release to a Docker Image; Quarks recommends Fissile for this purpose.

   **A quick word on Fissile:**
   It's not documented on the Fissile github page, but rather than building Fissile yourself, builds can be retrieved from an this S3 Bucket: `s3://cf-opensusefs2/fissile/develop/`.

   As a binary, Fissile was originally designed for use with SCF, and as a result, a lot of its functionality isn't relevant for this use case. The only command that we need to run to create a Docker Image is the `build images` command. A fully constructed version of this command looks like this:

   `fissile build release-images --stemcell="${STEMCELL_REPOSITORY}" --name="${RELEASE_NAME}" --version="${VERSION}" --sha1="${SHA1}" --url="${RELEASE_URL}"`

   You can then tag and push this image to dockerhub or a private registry to be used in your deployment.

### 3. Get your resources ready
   For these sections it's useful to have an example open for reference, this [redis deployment](https://github.com/cloudfoundry-community/redis-boshrelease/blob/master/quarks/deployment.yaml) from Dr Nic is a good example.

   #### The BOSH Manifest
   This will look similar to the BOSH deployment Manifest you're used to, but in this case it's a [ConfigMap]() - a first class Kubernetes resource. Some translation does need to be done from an original BOSH deployment manifest, this is explained in detail in the [documentation](https://quarks.suse.dev/docs/core-tasks/from_bosh_to_kube/#example-deployment-manifest-conversion-details).

   **Note: Quarks requires that a BOSH release uses [BOSH Process Management (BPM)](https://bosh.io/docs/bpm/bpm/)**, without this your deployment fail. However, BPM _can_ be added via an ops-file at runtime, so doesn't need to be written into the release itself - more on Ops Files next.

   #### Ops Files
   Another BOSH native concept implemented as a ConfigMap. Ops files are utilised to overwrite, add, or remove aspects of the BOSH Manifest, allowing a single centralised Manifest to be customised for different environments and requirements.

   Ops Files are also a means to satisfy the Quarks BPM requirement without writing BPM into the release.

   #### Services
   Services can be used to expose your deployment so that it can be accessed outside of the cluster, in these test instances the ClusterIP service has been used as the simplest way to expose the ___ deployment, but this could be substituted for other [implementations]().

   #### The `boshdeployment` Resource
   This is the one that the cf-operator is looking for, and is the culmination of all of the above. This resource tells the cf-operator which ConfigMap to use for the BOSH Manifest, which Ops File ConfigMaps to include, any additional objects like Services need not be referenced here - they'll be created alongside.

### 4. Pull the trigger

Once you've got all of your resources defined you can go ahead and `kubectl apply -f mydeployment.yml` to the namespace your `cf-operator` is watching.

If you run a `watch kubectl get all -n mynamespace` you'll be able to see your resources being created by the cf-operator, and eventually your deployment running happily.

< gif of deployment >

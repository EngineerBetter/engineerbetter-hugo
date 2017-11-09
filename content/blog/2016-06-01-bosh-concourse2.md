---
author: Dan Young
date: "2016-06-01"
heroImage: /img/blog/phoenix-sky-harbor.jpg
title:  Up and running with BOSH and Concourse - Part 2
---

In [Part 1](/bosh-concourse.html) of this tutorial we set up a new BOSH director from scratch on AWS. Now it's time to deploy Concourse!

## What will we do next?

- Create a deployment manifest for Concourse
- Upload stemcells and releases, then deploy using BOSH
- Install and get started with the fly cli
- Try a more complex deployment
<!--more-->
## Setting up

The terraform configuration in [Part 1](/bosh-concourse.html) will have already created the necessary security groups, subnets and ELB. Set the Concourse URL and a password for postgresql in these environment variables. Your public `$CONCOURSE_URL` should match the `ci_hostname` terraform variable that you used earlier, to configure Route53. For example, https://ci.engineerbetter.com.

```bash
$DB_PASSWORD
$CONCOURSE_URL
```

In this example we're going to use GitHub to authenticate our Concourse users, but you could also use basic authentication. First, create a new [OAuth application](https://github.com/settings/applications/new) in GitHub and set your authorisation callback URL to `https://<your CONCOURSE_URL>/auth/github/callback`. Also, create a 'CI' team containing the users who are authorised to access Concourse.

Then set your GitHub organization, client_id and client_secret:

```bash
$GITHUB_ORG
$GITHUB_CLIENT_ID
$GITHUB_CLIENT_SECRET
```

## Create a manifest and upload stemcells & releases

Now you're ready to create a concourse manifest for a simple, single server deployment:

`./bin/make_manifest_concourse.sh`

You should now have a new `concourse.yml` manifest in your working directory. Have a look at this and note the stemcells and releases sections. To run your BOSH deployment, you'll need those stemcells and releases on your BOSH Director.

Go ahead and upload the latest versions of the necessary stemcell & releases:

```shell_session
$ bosh upload stemcell https://bosh.io/d/stemcells/bosh-aws-xen-hvm-ubuntu-trusty-go_agent
$ bosh upload release https://bosh.io/d/github.com/concourse/concourse
$ bosh upload release https://bosh.io/d/github.com/cloudfoundry-incubator/garden-linux-release
```

The commands `bosh stemcells` and `bosh releases` will let you know what the BOSH director has in its blobstore.

## Deploy

You're ready to deploy concourse.

```shell_session
$ bosh deployment concourse.yml
$ bosh deploy
```

Watch while BOSH compiles packages, creates the VMs and runs the jobs defined in the manifest. Keep an eye on EC2 to see instances being used for the deployment. My BOSH Director already has the packages in its blobstore, so I see the following output.

<img src="/img/blog/bosh-deploy-concourse.png" class="image fit">

Congratulations, you should now be able to see your new CI server at https://your-concourse-url.

If you can't see anything yet check your AWS ELB - it's probably that your new instance is not yet `InService`, due to the polling interval.

<img src="/img/blog/no-pipelines-configured.png" class="image fit">

## Install `fly` cli and log in

Now, it's time to get familiar with the `fly` cli tool if you're not already. You'll find the download link on landing page of your new Concourse GUI (known as the ATC/Air Traffic Control). Put it somewhere suitable in your path like `~/bin`.

The `fly` tool uses the concept of targets to ensure that you're always being explicit about *where* commands should be executed. Choose a name for your new CI server target and then run the following:

```shell_session
$ fly -t target_name login -c https://<your-concourse-url>
```

If you haven't already looked at the excellent Concourse documentation, you'll find they have a great [hello world tutorial](http://concourse.ci/hello-world.html)

## What next?

Try replacing your single instance with a cluster, allowing you to run a scalable deployment. An example manifest can be generated with the script `bin/make_manifest_concourse-cluster.sh`. Notice how this manifest uses multiple instance groups to distribute the BOSH jobs across a cluster of instances.

Running a clustered concourse deployment with multiple ATCs will allow you to upgrade your CI environment without users experiencing an outage. You may find this particularly useful, given the pace at which Concourse is evolving.

---
author: Daniel Jones
date: "2015-08-19"
heroImage: /img/blog/overflowing-rubbish.jpg
title: Overflowing buildpack_cache

heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

Between versions 206 and 211 of Cloud Foundry a bug causes `buildpack_cache` files to be orphaned, increasing persistent disk usage unless manual remedial action is taken.

Users will get the error message `Staging error: cannot get instances since staging failed` when trying to push or restage apps. Depending on your setup you could get higher AWS S3 bills, or you may run out of persistent disk on your Cloud Controller or NFS Server VMs.
<!--more-->
Are you sitting comfortably? Then I'll begin.

Monday morning on-site at a client, I came in to find that continuous acceptance tests for the 'app push' workflow were failing. They weren't just failing on one Cloud Foundry; they were failing on three quarters of all environments being tested.

Here's an example of what happened on push:

```shell_session
Using manifest file manifest.yml
OK

Updating app push-test in org -snip!- / space -snip!- as -snip!-...
OK

Uploading push-test...
Uploading app files from: target/connectivity-tester-app-0.0.1-SNAPSHOT.war
Uploading 356.8K, 33 files

Done uploading
OK

Stopping app push-test in org -snip!- / space -snip!- as -snip!-...
OK

Starting app push-test in org -snip!- / space -snip!- as -snip!-...
-----> Downloaded app package (11M)
       -----> Java Buildpack Version: -snip!- | -snip!-
-----> Downloading Open Jdk JRE 1.8.0_51 from -snip!- (0.9s)
       Expanding Open Jdk JRE to .java-buildpack/open_jdk_jre (0.9s)
-----> Downloading Open JDK Like Memory Calculator 1.1.1_RELEASE from -snip!- (0.0s)
       Memory Settings: -Xmx269854K -Xms269854K -XX:MaxMetaspaceSize=64M -XX:MetaspaceSize=64M -Xss1003K
-----> Downloading Spring Auto Reconfiguration 1.7.0_RELEASE from -snip!- (0.0s)
-----> Downloading Tomcat Instance 8.0.18 from -snip!- (0.2s)
       Expanding Tomcat to .java-buildpack/tomcat (0.3s)
-----> Downloading Tomcat Lifecycle Support 2.4.0_RELEASE from -snip!- (0.0s)
-----> Downloading Tomcat Logging Support 2.4.0_RELEASE from -snip!- (0.0s)
-----> Downloading Tomcat Access Logging Support 2.4.0_RELEASE from -snip!- (0.0s)


FAILED
Server error, status code: 400, error code: 170001, message: Staging error: cannot get instances since staging failed
```

A quick poke around the state of VMs in the deployment showed that the NFS Server had maxed out its persistent disk usage. The NFS Server's sole responsibility is to host some persistent storage that the Cloud Controller can then map onto. In other deployments this storage area may be on the Cloud Controller itself or an S3-compatible blobstore.

The PaaS Ops team had increased the size of the NFS Server's persistent disk only last week, bumping it by another 50%. That it ran out so quickly was rather surprising.

Initially I'd jumped to the conclusion that maybe droplets were getting orphaned. Droplet deletions are delayed jobs that are placed in a queue in the Cloud Controller DB (CCDB).

I couldn't see any logs suggesting that these jobs were being picked up and executed by the Cloud Controller, but in this case that work was being done by a Cloud Controller Worker job (so _that's_ what a Cloud Controller Worker does!). A quick poke around the CCDB's `delayed_jobs` table showed no immediately curious patterns.

Back on the NFS Server VM I had a poke around `/var/vcap/store/shared/cc-droplets/`. I used `du --max-depth=1` to try and find which droplets were taking up the most space. Instead I discovered that the `buildpack_cache` directory was using up way more than all the droplets combined.

Some GitHub sleuthing led me to discover that whilst making [a change to the naming strategy for `buildpack_cache` files](https://github.com/cloudfoundry/cloud_controller_ng/commit/60021a2146f742892015eab19b9565cd540a2666), a bug was introduced in `cf-release` 206 that meant that these files were no longer deleted along with the app they belonged to.

The `buildpack_cache` files used to be stored in subdirectories matching their app GUID. This was changed to be subdirectories based on the stack, with app GUID as a suffix. On the Cloud Foundry instances I was looking at the `cflinuxfs2` stack was in use, meaning all the offending files were in `buildpack_cache/cf/li/*`.

The bug was [fixed in 211](https://www.pivotaltracker.com/n/projects/966314/stories/95474242) and an [endpoint added to the CF API](http://apidocs.cloudfoundry.org/211/blobstores/delete_all_blobs_in_the_buildpack_cache_blobstore.html) to give you a way to purge these through the front door. The Cloud Foundry instances I was dealing with did not have that fix.

Knowing that later versions of the API would allow you to purge the cache implied that it was read-through, and that bad things would _not_ follow if I cleared it.

Just to be sure I did some tests on a BOSH Lite Cloud Foundry, and observed the files getting recreated if an app was restaged or re-pushed. Hurrah!

A quick...

```shell_session
rm -rf /var/vcap/store/shared/cc-droplets/buildpack_cache/cf/li/*
```

...on each NFS Server and all was well with the world again.

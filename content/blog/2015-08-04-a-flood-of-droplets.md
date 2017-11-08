---
author: Daniel Jones
date: "2015-08-04"
heroImage: /img/blog/droplets.jpg
title: A Flood of Droplets
---

If you play the dangerous game of scaling Cloud Foundry DEAs up instead of out, make sure you have plenty of headroom in the CPU department to start with. If you don't then there's a good chance you'll see a heap of `no available stagers` errors upon `cf push` and `insufficient resources to start` errors upon `cf start`. This will last for an hour before magically fixing itself.

Why is this? What causes all these errors, and what can be done if one gets it wrong?

<!--more-->

First a little background. A PaaS operations team I work with received customer reports that apps could no longer be pushed, citing a `no available stagers` error message.

Upon investigation we realised that we had let our CF usage exceed the load that was reasonable for our DEAs and that they had started running out of ephemeral disk.

No problem - we'll just use BOSH to give them all another few gigabytes of disk, and all will be well with the world. Right?

Wrong. After the update had finished, our first app push worked. Shortly afterwards our continuous acceptance tests tried pushing apps, and received `no available stagers`. Wasn't that the problem we were trying to fix? Had BOSH not updated the DEAs properly? Was there some lag in the DEAs reporting their available resources? Soon, other continuous acceptance tests started failing restarting apps with `insufficient resources to start`.

All of the above happened on a non-production environment towards the end of the working day. We agreed to remedy the problem in the morning, but one of the team noticed some time later that the errors had all cleared without any intervention.

The next day we started sleuthing, and found the following:

* `bosh task` showed the update finished had successfully
* The DEAs reported the correct amount of disk
* The continous acceptance tests were failing for about an hour
* The DEA logs in `/var/vcap/sys/log/dea_next` (in their cursed JSON format) didn't show anything particularly interesting
* The CloudController logs also didn't show much interesting, only failed push/start requests
* `/var/vcap/data/dea_next/db/instances.json` on the DEAs showed a large number of `CRASHED` apps. At the time the DEAs had 48GiB of disk, and there were 43 `CRASHED` apps.
* The crash logs on the DEAs in `/var/vcap/data/dea_next/crashes` showed that the app were not in a state of distress; there were no exceptions or errors. They had just stopped dead.

It was then that we stumbled across an old Cloud Foundry mailing list thread that mentioned that the **DEA retains crashed apps** for a configurable amount of time, defaulting to one hour. The memory used by these retained apps is not subtracted from the available total, but the **disk used by the retained apps _is_ subtracted from the available total**.

This meant crashed apps were taking up 43GiB out of the 48GiB available.

One of the team suggested that perhaps BOSH had not shut down the DEAs cleanly, and that all the apps had been hard-stopped somehow marking them as `CRASHED`. This didn't hold up to the way that BOSH drain scripts behave, as BOSH will wait indefinitely if a drain script tells it to. The DEA drain script does indeed tell BOSH to come back later if it hasn't cleanly shut down all apps.

Whilst looking for hints in the crash logs an `ls` in `var/vcap/data/dea_next/crashes` yielded a clue - **all the app crash directories had been created within a few minutes** of each other, and also that this was **_after_ the DEA started** up.

So what had happened?

1. BOSH executes the drain script of the first DEA in order to scale up its ephemeral disk
1. The drain script evacuates all apps
1. Cloud Foundry starts those on other DEAs (can you see where this is heading?)
1. DEA comes back online with bigger disk
1. BOSH calls drain script on the next DEA
1. Our first DEA now has to try and start 43 apps all at once, within 180 seconds
1. This fails miserably, marking all the apps as crashed, reserving vast amounts of the available disk
1. Repeat for all DEAs until you have a Cloud Foundry that can't push or start apps
1. An hour later the DEAs reap all the crashed apps, and good times resume

The real solution? Scale out, and not up.

Sadly in this case we couldn't scale out because there were concerns about increasing the number of DEAs without being able to tie them to individual hosts - the thinking being that the more DEAs there are, the more likely all of any app's instances will all end up on the same physical host.

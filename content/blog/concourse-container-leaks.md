---
author: Daniel Jones
date: "2016-10-27"
heroImage: /img/blog/containers.jpg
title:  Concourse Container Leak
---

A customer of ours recently had trouble with their Concourse instance which resulted in us raising a [GitHub issue](https://github.com/concourse/baggageclaim/issues/6) describing how containers may get orphaned and that users may experience the error message `insufficient subnets remaining in the pool`.

This can mostly easily be remedied by performing `bosh recreate` on the Worker VM, or if you're not sensible enough to have deployed your Concourse with BOSH, by locating and killing all the orphaned container processes. The debugging journey was rather fun and exposed some of the innards of Concourse and Garden, so we've decided to share it.
<!--more-->
Before going any further I should point out that all of the Bash-fu is the work of my colleague [Jonathan Matthews](https://twitter.com/jpluscplusm).

Our first instinct was to check `fly containers` to see how many were in existence. We only saw 14 in total, which shouldn't be enough to starve Concourse of any resources. So we then used `fly workers` to get a second view of how many containers were active:

```shell_session
$ fly -t target workers
name                                  containers  platform  tags  team
0a04d3fd-d485-4976-b4a0-84e12c37c05c  242         linux     none  none
```

<section class="boxout">
  <h3>Lesson 1</h3>

  <p><code>fly containers</code> is scoped to teams, and there is no way to get a global view of containers, even if you _are_ in the 'main' team.</p>
</section>

A quick bit of Googling (other search engines are available) led us to [a GitHub issue citing the same error message](https://github.com/cloudfoundry/guardian/issues/53), but with no conclusive resolution. The issue pointed out that there's a hard limit in the defaults of Garden (the underlying container-running implementation behind Concourse) of 250 containers, and that there's also a limit on the subnets that can be assigned to those containers. This at least explained why the error message was about subnets.

<section class="boxout">
  <h3>Lesson 2:</h3>

  <p>Garden defaults to 250 concurrent containers.</p>
</section>

Our next question was: "_What are all these containers doing?_" This Concourse instance has around 10 modest pipelines, each with no more that 5 resources to be polled. A quick survey of the teams yielded that no-one had set `check_every` on their resources to anything other than the default, so we were able to rule out a user DoSing Garden with excessive resource polling.

We `bosh ssh`'d onto the Worker VM to investigate further, first poking around in the Garden logs in `/var/vcap/sys/log/garden`. We then downloaded the very-handy [`gaol` CLI](https://github.com/contraband/gaol) to interact with the Garden server running on the Worker - it connected automatically, presumably defaulting to conventional settings for the server.

<section class="boxout">
  <h3>Lesson 3:</h3>

  <p>`gaol` is invaluable for poking around Garden.</p>
</section>

We used `gaol list` to have a look at the containers this Garden instance was running, and found a very long list of UUIDs. All of the UUIDs from `fly containers` appeared in `gaol list`, which would have to be a Universe-breaking coincidence if Concourse wasn't exposing Garden UUIDs via its UI. We're rather glad that it does, as this made debugging a little easier.

<section class="boxout">
  <h3>Lesson 4:</h3>

  <p>Concourse container UUIDs are Garden container UUIDs.</p>
</section>

`gaol properties` revealed that our containers had a `grace-time` of `300000000000`. The only snafu is that there are no _units_ specified, so we had to trawl through the Garden and Concourse code to try and find out what the default unit of measurement was. Sadly it was quicker to work out that 5 minutes is equal to 300,000,000,000 nanoseconds than it was to find any conclusive proof, so we made the assumption that Concourse was setting the grace time of Garden containers in line with its advertised TTL.

At this point we know that Concourse says its Worker has many containers, possibly more than we think it should. Garden concurs with this point of view. Because of the limitations of `fly` we can't see all containers across all teams.

We needed to try and determine whether the containers alive in Garden were 'valid' or not: should they be there? Are they for active running tasks?

`gaol shell` allowed us to get a shell session in any given container. The first few we picked at random seemed quite innocuous, mostly Concourse resources being checked. New containers were being spun up as others were being torn down, which made investigating them all a game of whack-a-mole. We needed to instead do coarse-grained diff over the containers - how many would still be alive after the stated TTL of 5 minutes? We knew that few jobs in any of the teams' pipelines lasted longer than a few minutes, so we were unlikely to see hours-long tasks.

```shell_session
$ gaol list > containers-before
# 15 minutes later...
$ gaol list > containers-after
$ diff --side <(sort containers-before) <(sort containers-after) | grep -c -e '<' -e '>' -e '|'
```

This yielded the fact that the majority of containers were living longer that 15 minutes. It only then dawned on us that we could simply use `ps` to see how long some of these processes had been kicking around for:

```shell_session
$ ps aux | grep run[c]
```

Some of these containers had been kicking around for a week! What's more is that the `ps` output included the UUID of each of them, so we could use `goal shell` to get inside and see what was happening. Or so we thought.

```shell_session
$ gaol shell a65b0643-4e41-4081-634c-0256fe4e91e8
error: hijack: Backend error: Exit status: 500, message: {"Type":"","Message":"unable to find user root: no matching entries in passwd file","Handle":""}
```

The long-living containers seemed to be in some state of distress. Were their volumes missing? `gaol properties` tells us the UUIDs of volumes mounted into each container, and we happen to know that those volumes are managed by Baggage Claim and live in `/var/vcap/data/baggageclaim/volumes/`.

```shell_session
$ gaol properties eb8f2bbf-86e1-4603-4881-548c9133aa62
# lots of stuff...
concourse:volumes ["88914c83-fc71-4358-4f3f-b886429f9013","1a657656-9647-4bee-54be-8505eb323b9e"]
# lots of stuff...
```

We now had a place to go hunting for further information:

```shell_session
$ ll /var/vcap/data/baggageclaim/volumes/live/88914c83-fc71-4358-4f3f-b886429f9013
total 8
drwxr-xr-x 1 root root    58 Oct 19 19:07 ./
drwxr-xr-x 1 root root 17424 Oct 27 15:58 ../
-rw-r--r-- 1 root root   461 Oct 19 19:08 properties.json
-rw-r--r-- 1 root root    36 Oct 21 14:29 ttl.json
drwxr-xr-x 1 root root   130 Oct 19 19:08 volume/

$ cat properties.json
{
   "initialized":"yep",
   "resource-params":"04f8ff2682604862e405bf88de102ed7710ac45c1205957625e4ee3e5f5a2241e453614acc451345b91bafc88f38804019c7492444595674e94e8cf4be53817f",
   "resource-source":"262e6b8d86067f0f96a98611e89a05a5e28632790cadca4853976260860a02342e93a7bc8b0a0ddf2577654ff03dac5c2cc64a4c7497eafa35edfefd161e946d",
   "resource-type":"docker-image",
   "resource-version":"{\"digest\":\"sha256:869f748b9399b1650abe41108c11d2817bc5d4c2b226799b3041ca74bf3f88ca\"}"
}

$ cat ttl.json
{"ttl":0,"expires_at":1477060154}
}

$ date -d @1477060154
Fri Oct 21 14:29:14 UTC 2016
```

So here was a container that definitely should have died off a long time ago - it was Thursday 27th when we were doing this investigation. But what about the other volume?

```shell_session
$ stat /var/vcap/data/baggageclaim/volumes/live/1a657656-9647-4bee-54be-8505eb323b9e
stat: cannot stat ‘/var/vcap/data/baggageclaim/volumes/live/1a657656-9647-4bee-54be-8505eb323b9e’: No such file or directory
```

Checking the Baggage Claim logs in `/var/vcap/sys/log/baggageclaim` showed that the volume had been intentionally deleted:

```shell_session
$ grep -e 1a657656-9647-4bee-54be-8505eb323b9e baggageclaim.std*
baggageclaim.stdout.log:{
   "timestamp":"1477596534.502955675",
   "source":"baggageclaim",
   "message":"baggageclaim.tick.reaping",
   "log_level":1,
   "data":{
      "handle":"1a657656-9647-4bee-54be-8505eb323b9e",
      "session":"69393",
      "ttl":300
   }
}
```

There was however no mention of the container in the ATC logs:

```shell_session
$ zgrep eb8f2bbf-86e1-4603-4881-548c9133aa62 * | wc -l
0
```

...and so ends the trail. We've not been able to figure out exactly what was going on. We had originally theorised that this was a one-off event caused by a Worker restart a week previously, whereby the Worker didn't connect to the TSA on the ATC for a good hour (again, we don't know why, but the debug session for that is a whole other blog post complete with voodoo exorcism). This theory didn't hold up to scrutiny however, as when we looked at the start times for processes relating to our containers we saw that 'orphans' had been being created up until the present:

```shell_session
# Ran at about midday
$ ps -ef --sort=start_time | grep "/proc/self/exe"
# SNIP!
root     30704     1  0 Oct27 ?        00:00:00 /proc/self/exe init
root      5486     1  0 Oct27 ?        00:00:00 /proc/self/exe init
root     21706     1  0 Oct27 ?        00:00:00 /proc/self/exe init
root     32505     1  0 Oct27 ?        00:00:00 /proc/self/exe init
root      1629     1  0 04:10 ?        00:00:00 /proc/self/exe init
root     20108     1  0 09:48 ?        00:00:00 /proc/self/exe init
root     20853     1  0 09:48 ?        00:00:00 /proc/self/exe init
root     22398     1  0 09:48 ?        00:00:00 /proc/self/exe init
root     31571     1  0 09:51 ?        00:00:00 /proc/self/exe init
root      1366     1  0 09:51 ?        00:00:00 /proc/self/exe init
root      8974     1  0 09:53 ?        00:00:00 /proc/self/exe init
root     10608     1  0 09:54 ?        00:00:00 /proc/self/exe init
root     13974     1  0 09:54 ?        00:00:00 /proc/self/exe init
root     24614     1  0 09:57 ?        00:00:00 /proc/self/exe init
root     27895     1  0 09:58 ?        00:00:00 /proc/self/exe init
root     30103     1  0 09:59 ?        00:00:00 /proc/self/exe init
root     30769     1  0 09:59 ?        00:00:00 /proc/self/exe init
```

It's a little odd how there are nearly no orphans overnight but as soon as office hours start, we see them being created every few minutes.
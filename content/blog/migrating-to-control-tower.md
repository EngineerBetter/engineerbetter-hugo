---
author: Colin Simmons
date: "2019-03-26"
heroImage: /img/blog/migrating.jpeg
title: Migrating from Concourse-up to Control Tower
heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

### Catch your connecting flight

We recently announced that we are replacing Concourse-Up with [Control Tower](/blog/concourse-up-renamed-to-control-tower). 

You can see the other blog post for more details on what this change means from a product perspective. If you are currently running a Concourse using Concourse-up and are wondering how to migrate over to Control Tower then keep reading.

Under the hood Control Tower is Concourse-up with the name word-replaced and a handful of bugfixes/updates. Unfortunately due to some changes such as bucket name changes, deploying with Control Tower over top of Concourse-up will not work. 

We are looking at an automated self-update process to migrate users to Control Tower, but since this is non-trivial and we're keen to hear feedback from users on how valuable this would be.

I recently transitioned our own Concourse over at [https://ci.engineerbetter.com](https://ci.engineerbetter.com) from Concourse-up to Control Tower using some backup tooling that we wrote. These are the steps I followed.

### Step 1 - Know your Concourse 
If you don't have it written down, figure out all the deployment flags you used with Concourse-Up. You'll want these to create your Control Tower deployment.

### Step 2 - Deploy with Control Tower on a different domain
Deploy a new Concourse using Control Tower using the deployment flags used in your Concourse-up deployment _**with a different domain**_. For example, for our deployment I ran:

```sh
control-tower deploy ebci --region eu-west-2 \
--web-size large \
--domain ci2.engineerbetter.com \
--worker-size 2xlarge
```

### Step 3 - Backup your data from your Concourse-Up deployment
Clone down our backup tooling from [https://github.com/EngineerBetter/ct-backup](https://github.com/EngineerBetter/ct-backup).

From `ct-backup` run the following to extract all the pipelines, teams, and credhub secrets from your Concourse. Take note of the encryption key in the output as this will be needed to decrypt your Credhub secrets when you import them into Control Tower.

```sh
eval "$(concourse-up info --iaas <your-iaas> --env <your-deployment>)"
export ADMIN_PASSWORD=<your-concourse-up-admin-password>
export CONCOURSE_URL=<your-concourse-up-domain> # i.e. https://ci.engineerbetter.com
fly -t <target> execute -c examples/backup.yml -o out=./out
```

### Step 4 - Import your data to your Control Tower deployment

Open a new terminal window (to get a fresh environment) and run the following from `ct-backup` to import all the pipelines, teams, and credhub secrets to your new Control Tower Concourse.

```sh
eval "$(control-tower info --iaas <your-iaas> --env <your-deployment>)"
export ADMIN_PASSWORD=<your-control-tower-admin-password>
export CONCOURSE_URL=<your-control-tower-domain> # i.e. https://ci2.engineerbetter.com
export ENCRYPTION_KEY=<encryption-key-from-previous-step>
fly -t <target> execute -c examples/restore.yml -i backup_source=out --include-ignored
```

**Warning: From this point there will be disruption to anyone using your old Concourse**

### Step 5 - Record existing pipeline status and pause them

Make a note of the pipelines that are unpaused/exposed in each team

```sh
# From ct-backup directory
# Log in to each team and run
fly -t <target> pipelines --json > pipelines-<team>.json
```

Pause all pipelines in each team on old Concourse

```sh
# Log in to each team and run
fly -t <target> pipelines --json | jq -r '.[].name' | xargs -I {} fly -t <target> pp -p {}
```

### Step 6 - Liberate your domain from Concourse-Up

Deploy the old Concourse with a third domain. For example, I ran

```sh
concourse-up deploy --iaas aws --region eu-west-2 --domain=https://ci3.engineerbetter.com ebci
```

This domain swapping is needed because terraform deletes the A record on change even if the record is pointing to a different IP that terraform originally set it to. So if you were to deploy with Control Tower to the same domain as your Concourse-up deployment, it would intially swap the A record over to your new Concourse but then as soon as you delete the Concourse-up deployment it would delete the record for your new Concourse.

### Step 7 - Move your Control Tower deployment to the correct domain

Deploy the new Concourse with the original domain. For example, I ran

```sh
control-tower deploy --iaas aws --region eu-west-2 --domain=https://ci.engineerbetter.com ebci
```

## Step 8 - Unpause and expose the correct pipelines

From `ct-backup` run the following to unpause + expose pipelines on the new Concourse to match what the old Concourse was set as

```sh
# For each team
fly -t target login
examples/unpause_expose.rb target pipelines.json
```

At this point your original domain is pointing to the new Concourse and all the teams, pipelines, and Credhub secrets have been moved across. Pipelines have been unpaused and exposed according to what was configured on your old Concourse. All pipelines on your old Concourse have been paused. The ATC password will have changed but password rotation is a good thing right?

## Step 9 - Clean up

If you are happy with your new Control Tower deployment, you can use `concourse-up` one final time to destroy your old Concourse.

To chat with our team and other users about Control Tower, please join our community on Slack [Concourse-Up User Slack](https://join.slack.com/t/concourse-up/shared_invite/enQtNDMzNjY1MjczNDU3LTA1NzIxYTZkYjFkMjA2ODBmY2E2OTM3OGE3YTc2OGViNTMxYTY4MjYwNGNjOTAxNDNiOGE5NzhmMTQ2NWVhNzQ) and share your thoughts!
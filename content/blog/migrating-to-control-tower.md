---
author: Colin Simmons
date: "2019-03-26"
heroImage: /img/blog/migrating.jpeg
title: Migrating from Concourse-up to Control-Tower
heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

We recently announced that we are deprecating Concourse-up and are [moving over to Control-Tower](/blog/concourse-up-renamed-to-control-tower). 

You can see the other blog post for more details on what this change means from a product perspective. If you are currently running a Concourse using Concourse-up and are wondering how to migrate over to Control-Tower then keep reading.

Under the hood Control-Tower is Concourse-up with the name word-replaced and a handful of bugfixes/updates. Unfortunately due to some changes such as bucket name changes, deploying with Control-Tower over top of Concourse-up will not work. We did discuss creating an automated self-update to migrate users to Control-Tower but a number of roadblocks and complications led us to abondon that option for the time being.

I recently transitioned our own Concourse over at `https://ci.engineerbetter.com` from Concourse-up to Control-Tower using some backup tooling that we wrote. These are the steps I followed.

1. If you don't have it written down, figure out all the deployment flags needed to deploy your Concourse-up deployment.

1. Deploy a new Concourse using Control-Tower using the deployment flags used in your Concourse-up deployment _**with a different domain**_. For example, for our deployment I ran:

    ```sh
    control-tower deploy ebci --region eu-west-2 \
    --web-size large \
    --domain ci2.engineerbetter.com \
    --worker-size 2xlarge
    ```

1. Clone down our backup tooling from `https://github.com/EngineerBetter/ct-backup`

1. From `ct-backup` run the following to extract all the pipelines, teams, and credhub secrets from your Concourse. Take note of the encryption key in the output as this will be needed to decrypt your Credhub secrets when you import them into Control-Tower.

    ```sh
    eval "$(concourse-up info --iaas <your-iaas> --env <your-deployment>)"
    export ADMIN_PASSWORD=<your-concourse-up-admin-password>
    export CONCOURSE_URL=<your-concourse-up-domain> # i.e. https://ci.engineerbetter.com
    fly -t <target> execute -c examples/backup.yml -o out=./out
    ```

1. Open a new terminal window (to get a fresh environment) and run the following from `ct-backup` to import all the pipelines, teams, and credhub secrets to your new Control-Tower Concourse.

    ```sh
    eval "$(control-tower info --iaas <your-iaas> --env <your-deployment>)"
    export ADMIN_PASSWORD=<your-control-tower-admin-password>
    export CONCOURSE_URL=<your-control-tower-domain> # i.e. https://ci2.engineerbetter.com
    export ENCRYPTION_KEY=<encryption-key-from-previous-step>
    fly -t <target> execute -c examples/restore.yml -i backup_source=out --include-ignored
    ```

    >Note: From this point there will be disruption to anyone using your old Concourse

1. Make a note of the pipelines that are unpaused/exposed in each team

    ```sh
    # From ct-backup directory
    # Log in to each team and run
    fly -t <target> pipelines --json > pipelines-<team>.json
    ```

1. Pause all pipelines in each team on old Concourse

    ```sh
    # Log in to each team and run
    fly -t <target> pipelines --json | jq -r '.[].name' | xargs -I {} fly -t <target> pp -p {}
    ```

1. Deploy the old Concourse with a third domain. For example, I ran

    ```sh
    concourse-up deploy --iaas aws --region eu-west-2 --domain=https://ci3.engineerbetter.com ebci
    ```

    > Note: This domain swapping is needed because terraform deletes the A record on change even if the record is pointing to a different IP that terraform originally set it to. So if you were to deploy with Control-Tower to the same domain as your Concourse-up deployment, it would intially swap the A record over to your new Concourse but then as soon as you delete the Concourse-up deployment it would delete the record for your new Concourse.

1. Deploy the new Concourse with the original domain. For example, I ran

    ```sh
    control-tower deploy --iaas aws --region eu-west-2 --domain=https://ci.engineerbetter.com ebci
    ```

1. From `ct-backup` run the following to unpause + expose pipelines on the new Concourse to match what the old Concourse was set as

    ```sh
    # For each team
    fly -t target login
    examples/unpause_expose.rb target pipelines.json
    ```

At this point your original domain is pointing to the new Concourse and all the teams, pipelines, and Credhub secrets have been moved across. Pipelines have been unpaused and exposed according to what was configured on your old Concourse. All pipelines on your old Concourse have been paused. The ATC password will have changed but password rotation is a good thing right?

If you are happy with your new Control-Tower deployment, you can use `concourse-up` one final time to destroy your old Concourse.

To chat with our team and other users about Control Tower, please join our community on Slack [Concourse-Up User Slack](https://join.slack.com/t/concourse-up/shared_invite/enQtNDMzNjY1MjczNDU3LTA1NzIxYTZkYjFkMjA2ODBmY2E2OTM3OGE3YTc2OGViNTMxYTY4MjYwNGNjOTAxNDNiOGE5NzhmMTQ2NWVhNzQ) and share your thoughts!
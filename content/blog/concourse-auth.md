---
author: Colin Simmons
date: "2020-09-07"
heroImage: /img/blog/concourse-auth/airport-security.jpg
title:  "Concourse Teams - Authentication and Automation"
heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

Ever since version 2.0 Concourse has supported dividing a single Concourse installation into one or more teams. These teams can be configured so that only certain individuals can access the pipelines within them. As of now there are multiple [supported auth providers](https://concourse-ci.org/auth.html) and [a variety of RBAC roles](https://concourse-ci.org/user-roles.html) that can be applied.

Over the past few weeks I've found there is a lot of confusion around how Concourse auth works.

To explain Concourse auth lets walk though the addition of GitHub auth at a high level.

## Configuring the Provider

Before configuring any teams using GitHub auth we need to configure the auth provider on the web instance of our Concourse. In essence this involves [creating a new OAuth application](https://github.com/settings/applications/new), setting the `CONCOURSE_GITHUB_CLIENT_ID` and `CONCOURSE_GITHUB_CLIENT_SECRET` environment variables, then redeploying the web instance. The specific mechanism for setting these variables depends on how you are deploying your Concourse (i.e. helm, BOSH, docker, etc).

Once the web instance is started with this new configuration you might think that you wouldn't be able to log into anything until a team has been created to use the GitHub auth provider. You would be wrong.

<figure>
  <img src="/img/blog/concourse-auth/github-no-access.png" class="fit image">
  <figcaption>Concourse UI when logging in with GitHub auth without access to a team</figcaption>
</figure>

As you can see I was able to log in but since I don't have access to any teams the Concourse appears to be empty.

When you configure an auth provider you are effectively saying that any user within that provider can log into your Concourse and they _can_ be given access to a team.

<section class="boxout">
<p>It's worth noting that all basic auth user:password pairs also need to be defined at deploy time.</p>
</section>

## Configuring the Team

Now that we've told Concourse how to talk to GitHub we can create a team that utilises it.

The only way to configure (non-main) teams is through the `fly set-team` command. Thankfully this command can take a yaml config file as an input which lets you keep team auth setup in source control. A good reference for the different keys for each auth type can be found in the `team_config_*` fixtures [in the Concourse source code](https://github.com/concourse/concourse/blob/master/fly/integration/fixtures).

For example this is the GitHub auth fixture:

```yaml
roles:
  - name: member
    github:
      users: ["some-user"]
  - name: viewer
    github:
      teams: ["some-org:some-team"]
      users: ["some-github-user"]
  - name: owner
    github:
      orgs: ["some-other-org"]
```

When applied with

```sh
fly set-team \
  --team-name=github-team \
  --config=team_config_with_github_auth.yml
```

this will create a team called `github-team` with the following roles:

|Role|GitHub Org|GitHub Team|GitHub User|
|---|---|---|---|
|Member|-|-|`some-user`|
|Viewer|`some-org`|`some-team`|-|
|Viewer|-|-|`some-github-user`|
|Owner|`some-other-org`|-|-|

<section class="boxout">
<p>BEWARE: fly set-team is not additive. You must include all previously configured auth when adding new config.</p>
</section>

## Automating Team Configuration

`fly set-team`'s non-additive nature often seems to lead to team owners accidentally removing their own access to the team they manage. This is usually recoverable because owners of the `main` team are effectively owners of every team implicitly. This allows Concourse administrators to restore lost permissions to team owners.

Recently when working with customers I have found that it would be useful to have a system that periodically resets team auth to a configuration from source control. This would make auth configuration more declarative by forcing all changes through source control while also limiting the amount of time team owners can break their own access. Since creating teams and configuring team auth happen through the same `fly` command, this automation could also make bulk team management possible.

With VMWare's excellent [cf-mgmt](https://github.com/vmwarepivotallabs/cf-mgmt) tool in mind I created [concourse-mgmt](https://github.com/EngineerBetter/concourse-mgmt) as an example pipeline for managing auth. The readme in the repo describes how to use the pipeline so I won't repeat it here. If you find it useful with your Concourse installation we'd be interested to hear about it.

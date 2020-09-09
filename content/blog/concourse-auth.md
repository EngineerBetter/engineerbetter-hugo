---
author: Colin Simmons
date: "2020-09-08"
heroImage: /img/blog/concourse-auth/airport-security.jpg
title:  "Concourse Teams - Authentication and Automation"
heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

Configuring authentication providers in Concourse is often a source of confusion, with gotcha's that make it easy for newcomers to remove their colleagues' access. In this post I explain how Concourse auth can be configured, and why I made [concourse-mgmt](https://github.com/EngineerBetter/concourse-mgmt) to make the process more reliable.

Ever since version 2.0 Concourse has supported dividing a single Concourse installation into one or more teams. These teams can be configured so that only certain individuals can access the pipelines within them. As of now there are multiple [supported auth providers](https://concourse-ci.org/auth.html) and [a variety of RBAC roles](https://concourse-ci.org/user-roles.html) that can be applied.

I've helped many companies with Concourse over the past four years. A common point of confusion is around how Concourse authentication is configured and how it relates to teams.

At a high level, the **configuration of authentication in Concourse is split into two different steps**: deployment and team configuration.

A rule of thumb is that you tell Concourse _how_ it can authorise users when you deploy Concourse. This is when you configure one or more auth providers. Once an auth provider is configured you can use `fly set-team` to tell Concourse which users _within an auth provider_ can access a specific team.

I find the GitHub auth provider is a good example. At deployment you tell Concourse how to talk to GitHub and when you configure a team you tell Concourse which users can interact with that team based on the entities (organisations or teams) they are a part of in GitHub.

To understand it further, lets walk though the addition of GitHub auth to a Concourse deployment and how to subsequently use it when creating a team.

## Configuring the Provider

Before configuring any teams using GitHub auth we need to configure the auth provider on the web instance of our Concourse.

This involves:

* [creating a new OAuth application](https://github.com/settings/applications/new)
* setting the `CONCOURSE_GITHUB_CLIENT_ID` and `CONCOURSE_GITHUB_CLIENT_SECRET` environment variables for the web executable
* redeploying the web instance.

The specific mechanism for setting these variables depends on how you are deploying your Concourse (i.e. Helm, BOSH, Docker, etc).

Once the web instance is started with this new configuration you might think that you wouldn't be able to log into anything until a team has been created to use the GitHub auth provider. You would be wrong.

<figure>
  <img src="/img/blog/concourse-auth/github-no-access.png" class="fit image">
  <figcaption>Concourse UI when logging in with GitHub auth without access to a team</figcaption>
</figure>

As you can see I was able to log in, but since I don't have access to any teams the Concourse appears to be empty.

When you configure an auth provider you are effectively saying that any user within that provider can log into your Concourse and they _can_ be given access to a team.


> It's worth noting that **all basic auth user:password pairs need to be defined at deploy time**.

## Configuring the Team

Now that we've told Concourse how to talk to GitHub we can create a team that utilises it.

The only way to configure (non-main) teams is through the `fly set-team` command. The `main` team is a special case in that it can only be configured when deploying Concourse.

Thankfully the `set-team` command can take a YAML config file as an input which lets you keep team auth setup in source control. A good reference for the different keys for each auth type can be found in the `team_config_*` test fixtures [in the Concourse source code](https://github.com/concourse/concourse/blob/master/fly/integration/fixtures).

For example this is the GitHub auth example from the test fixtures:

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
|Member|-|-|some-user|
|Viewer|some-org|some-team|-|
|Viewer|-|-|some-github-user|
|Owner|some-other-org|-|-|
<br>

### Be careful with `fly set-team`

It's quite easy to accidentally revoke your own access to a team when trying to give a new user access. I've seen this a lot and have done it myself a few times. **`fly set-team` is not an additive command**. Suppose you want to add my GitHub user 'crsimmons' as an owner of the `github-team` team created above.

If you assume that `fly set-team` is additive (as I initially did) you would do something like:

```sh
fly set-team \
  --team-name=github-team \
  --github-user=crsimmons
```

However the result of this is:

|Role|GitHub Org|GitHub Team|GitHub User|
|---|---|---|---|
|Owner|-|-|crsimmons|
<br>

All the other permissions are gone. Oops! Someone who was owner before running this command is not an owner anymore. This means they can't undo their mistake. Double oops!

Using the config files instead of imperative commands helps avoid this problem a little bit but `fly set-team`'s non-additive nature still often leads to team owners accidentally removing their own access to the team they manage. This is usually recoverable because owners of the `main` team are effectively owners of every team implicitly. This allows Concourse administrators to restore lost permissions to team owners.

Once a Concourse grows to have multiple teams with decentralized owners this problem can start to consume a lot of the administrators' time. This coupled with the time it takes to configure a new team with `fly` suggests some kind of automation would be useful for team management.

## Automating Teams

From the perspective of automating team configuration it's quite convenient that both team creation and authentication configuration are handled by the same `fly` command.

Based on what I've seen at various companies, the main wants for team automation are:

- having all team configuration stored in source control
- limit the amount of time an errant `fly set-team` can break access to Concourse
- make addition of new teams as easy as possible

Automatic removal of old teams is something that I've proposed but it is usually seen as too dangerous for the first pass by customers.

With VMWare's excellent [cf-mgmt](https://github.com/vmwarepivotallabs/cf-mgmt) tool in mind I created [concourse-mgmt](https://github.com/EngineerBetter/concourse-mgmt) as an example pipeline for managing auth. The readme in the repo describes how to use the pipeline so I won't repeat it here. If you find it useful with your Concourse installation we'd be interested to hear about it.

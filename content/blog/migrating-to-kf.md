---
author: Andy Paine
date: "2021-06-31"
heroImage: /img/blog/moving-containers.jpg
title: Migrating from Cloud Foundry to Kf
draft: true

heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---
There is increasing demand amongst Cloud Foundry users to find a Kubernetes-based platform to run applications on. We recently [compared some of the options](https://www.engineerbetter.com/blog/cf-for-k8s-kubecf-kf/) to achieve this before settling on [Google's Kf](https://cloud.google.com/migrate/kf/docs/latest) for our own workloads.

To make it easier to move from Cloud Foundry to Kf, Google have added some features to the `kf` CLI for automating the migration of many Cloud Foundry resources.  The `kf` CLI can now **audit existing Cloud Foundry environments** and **move apps, spaces, service bindings and more** between Cloud Foundry and a target Kf cluster.

These tools **do the heavy lifting for you**, allowing you to focus on the parts of the migration that **have the highest business impact**.

> These tools expect a Kf cluster to have already been built and configured. For our environments, we have used our [continuous infrastructure](https://www.engineerbetter.com/blog/continuous-infrastructure-google-cloud/) methodology to reliably pave all the GKE and Kf components required.


## Using the tool

### TL;DR

1. `kf plan > my-cf.yml`
1. Make any changes in the plan, removing any issues you wish to ignore
1. `kf apply my-cf.yml`
1. Watch as orgs, spaces, routes, services and apps migrate to Kf

### Overview

Terraform users will find the `plan` and `apply` commands familiar. The `plan` command outputs a YAML plan detailing both the resources the tool would migrate as well as recording any potential incompatibilities between Cloud Foundry and Kf.

The YAML plan is then passed to the `apply` command which migrates the specified resources from the source Cloud Foundry across to the target Kf cluster.

This user-editable plan **gives you the power to control every stage of the migration** whilst taking care of the majority of the work for you. Users can edit the plan file to fine-tune options such as naming or remove any issues that are not relevant.

The tool **protects you from executing any unintended actions** by not making any destructive changes to the source Cloud Foundry as well as ensuring the `apply` command is defensive by default - it will not proceed if there are incompatibility issues present in the plan.

The tool also includes a `--verbose` flag so you can see _exactly_ what it is doing, making debugging simple.

### Plan
The `plan` command accesses the Cloud Foundry  currently targeted by the `cf` CLI to gather information about what resources exist to be migrated. By default, `plan` will search all resources that the user has access to unless the `--org`, `--space` and `--app` flags are used to scope the returned results.

The tool analyses the discovered resources in order to **record any potential incompatibilities** between the Cloud Foundry and Kf. As `apply` will _not_ proceed if there are issues in a YAML plan, the `plan` command optionally takes a `--exclude-unsupported` flag to filter out problematic resources.

All of the information including any discovered issues is output to `stdout` in a YAML format that is both **human and machine readable**, an example of which can be seen below:

```yaml
kfm_version: development
cf_version: 3.74.0
cf_api_url: https://api.sys.my-cloudfoundry.org
running_env_vars_to_migrate: []
staging_env_vars_to_migrate: []
spaces:
- cf_org: marketing
  cf_space: staging
  kf_space: marketing-staging
  domains:
  - name: apps.my-cloudfoundry.org
  - name: apps.internal
    issues:
    - E04 - internal domains are not supported
  routes:
  - route: customer-dashboard.apps.my-cloudfoundry.org
  - route: customers.my-enterprise.com
  applications:
  - name: customer-dashboard
    new_name: customer-dashboard
    guid: f444cf04-1036-4ebf-8f24-2dfbdd18c1c1
    package: /v3/packages/cf65db70-ea99-4709-a337-fe413050b2c7
    state: STARTED
    current_start_command: $HOME/boot.sh
    detected_buildpack_language: staticfile
    kf_manifest:
      applications:
      - name: customer-dashboard
        instances: 2
        memory: 512M
        disk_quota: 1024M
        health-check-type: http
        health-check-http-endpoint: /
        stack: cflinuxfs3
    env_vars_to_migrate:
    - API_TOKEN
    type: buildpack
  service_instances:
  - name: customer-db
    new_name: customer-db
    type: postgres
    plan: 11-7-0
    tags:
    - no-sql
    - relational
  - name: metrics-config
    new_name: metrics-config
    type: user-provided
    credentials: /v2/user_provided_service_instances/4f653f05-83af-44bc-a8b2-74535fd06ada
  service_bindings:
  - name: ""
    new_name: binding-customer-dashboard-customer-db
    app: customer-dashboard
    service: customer-db
    credentials: /v2/service_bindings/1b388442-7902-418f-9928-664200ac761c
  - name: ""
    new_name: binding-customer-dashboard-metrics-config
    app: customer-dashboard
    service: metrics-config
```

Notable parts of the plan YAML include:
* Resources are **grouped by Kf `Space`** - an object that merges the Cloud Foundry concepts of organizations and spaces together and becomes a `Namespace` in Kubernetes
* All resources (such as the `customers.my-enterprise.com` route) are included, even if they are not currently bound to any applications
* Resource **names are transformed** for compatibility with Kf in the `new_name` fields which can be edited to tweak preferred naming
* Annotated **`issues` on resources** such as the `apps.internal` domain indicate where features may not be fully compatible between Cloud Foundry and Kf
* **Sensitive fields do not contain literal values**, for example binding `credentials` and application source code (`package`). Instead the plan contains links to Cloud Foundry API resources, which will be looked up at `apply` time.
* Applications contain information such as `current_start_command` and `detected_buildpack_language` for later validating the success of the app migration
* Kf compatible application manifests based on Cloud Foundry app details for comparing against or replacing existing app manifests

As the plans are **sorted in a predictable way** and **do not contain any secrets** they are safe and easy to compare when committed to source control providing an **ideal point of collaboration**.

### Apply

After the plan has been analysed and adjusted as necessary, it can be passed to the `apply` command to create all the resources in the Kf cluster.

After checking the references in the plan have not changed since it was created, secrets and application bits are pulled from Cloud Foundry and the migrations is applied.

The tool **pushes apps exactly as a human would** using the `kf` CLI before checking that they are healthy and are running with the correct buildpack and command.

By migrating brokered services as user-provided services with custom bindings, the migration tool lets Kf use **existing data services without doing an upfront data migration**. As long as there is network connectivity and hostnames can be resolved, migrated Kf apps will continue to use the **exact same binding credentials** as their Cloud Foundry counterparts.

## Use cases
### Planning and prioritising a migration
During early planning steps of a migration, the `plan` command can be targeted at different areas to highlight where and what `issues` will be faced during the migration. By classifying the issues by both number and impact, individual parts of the migration can be effectively **estimated and prioritised**.

### Operator-owned migrations
A platform team can use the `plan` command to see which platform features may be incompatible and what issues are most common across various foundations. Using this information, the team can understand **how much support other teams will need** whilst migrating and write up docs and guidance for solving the most frequent `issues`. Additionally the `apply` command can be used to do the hard work of **building the org and space structure to match existing foundations**.

### Developer-owned migrations
By using scoped plans, individual teams can take ownership of the migration of an app or space themselves. By running `plan` and `apply` as issues are fixed, a team can **understand when an app is ready to be fully migrated** and when apps are ready for their CI pipelines to push to the new Kf cluster.

### Migrating orphaned apps
By pulling the application source code package directly from Cloud Foundry and builds it in the same way, the migration tool allows for even **orphaned applications to be migrated to a new runtime** even without extensive knowledge of the application or a dedicated CI pipeline.

## What else is left to do?
After running `plan` and `apply`, you'll be left in a state of running applications in both Cloud Foundry and in Kf.

The next steps will involve working out how to start retiring your Cloud Foundry estate such as:

* How should you shift traffic from Cloud Foundry to Kf? Should it be a simple switchover or do you need a weighted transition? This may involve DNS, custom Cloud Foundry routing rules or even forming a service mesh between the two platforms.
* How should you migrate data services to cloud native offerings?
* Should you adopt Cloud Native Buildpacks for improved build times and local development?
* Should you modernise applications that proved difficult during the migration?

These are the questions where the answer will vary between users, so it can help to have partners on-hand to assist with the migration.

> If you are thinking of migrating from Cloud Foundry to Kf, EngineerBetter can help you plan and execute through the entire lifecycle of a migration. As Cloud Foundry experts, Google Cloud partners and Kubernetes Certified Service providers we have the experience to ensure your migration has best possible outcomes.

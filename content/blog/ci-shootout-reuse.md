---
author: Tom Godkin
date: "2021-10-13"
heroImage: /img/blog/gunfight-enchanted-springs.jpg
title: "CI Shootout: Re-use and build monitors"
draft: true

heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

In [the previous blog](/blog/ci-shootout-inputs-and-outputs) reading state from and writing state to the outside world with four self-hosted CI systems: Jenkins, Concourse, Tekton & Argo Workflows. In this post we continue by looking at the re-usability of pipeline resources and build monitors:

* [_First post_](/blog/ci-shootout-getting-started) - 1. **Install** and configure the CI system
* [_First post_](/blog/ci-shootout-getting-started) - 2. **Run** a "Hello, World" task
* [_Second post_](/blog/ci-shootout-inputs-and-outputs) - 3. **Trigger** pipeline runs when external resources (eg Git repos, S3 buckets) change
* [_Second post_](/blog/ci-shootout-inputs-and-outputs) - 4. Use **inputs and outputs to tasks**
* [_Second post_](/blog/ci-shootout-inputs-and-outputs) - 5. Write **outputs externally** (like making a Git commit or pushing a file to S3)
* _This post_ - 6. **Re-use** pipeline configuration
* _This post_ - 7. Use the CI system as a **build monitor**

## 3. Trigger pipeline runs

Writing YAML (or XML) isn't much fun, how re-usable is what we've written? Can we use configuration written by someone else to have my pipeline achieve the same outcomes? In this section we'll evaluate how much of what we've written is re-usable by ourselves and others, and how easy it is to discover the work of others to avoid re-inventing the wheel.

### Jenkins - *Good*

Jenkins reusability comes from plugins, for which there is [a repository of plugins](https://plugins.jenkins.io/) you can look through. Given Jenkins' age it's not surprising that there's a vast array of plugins (~1800 community plugins according to jenkins.io) and we've already used a few ([the Git plugin](https://plugins.jenkins.io/git/) for pushing commits and [Blue Ocean](https://plugins.jenkins.io/blueocean/) which we'll speak more about in section 7 of this blog).

Jenkins plugins were traditionally installed by pointing and clicking through the Jenkins UI, more recently it's possible to install them via the helm chart we used to deploy our Jenkins. It feels a little strange that installing a plugin requires a whole helm install.

Once installed, Jenkins plugins can offer new options in the UI when creating pipelines or new blocks for use in the various pipeline syntax, such as the Git plugin's withCredentials extension.

```groovy
withCredentials([gitUsernamePassword(
  credentialsId: 'my-credentials-id',
  gitToolName: 'git-tool'
)]) {
  sh 'git fetch --all'
}
```

Since Jenkins declarative pipelines support sprinkling in Groovy code, you're able to define functions that may be re-used within your own pipelines.

```groovy
def hello = {
  sh "echo hello"
}

pipeline {
  ...

  stages {
    stage("Hello"){
      steps {
        script { hello() }
      }
    }
  }
}
```

&nbsp;

### Concourse - *Good*

Concourse has two ways to re-use the work of others: [resource types](https://concourse-ci.org/resource-types.html) and [tasks](https://concourse-ci.org/tasks.html).

Resource types are the definition of the resources we've already encountered in previous blogs in this series. Resources we're already familiar with, such as the Git resource, have a corresponding resource type and is made available by Concourse by default. Including another resource type that isn't default in our pipeline trivial - we define the required resource type in our pipeline such as with the Terraform backend resource type below.

```yaml
resource_types:
- name: terraform
  type: docker-image
  source:
    repository: ljfranklin/terraform-resource
    tag: latest

...

resources:
  - name: terraform
    type: terraform
    source:
      env_name: staging
      backend_type: s3
      backend_config:
        bucket: mybucket
        key: mydir/terraform.tfstate
        region: us-east-1
        access_key: {{storage_access_key}}
        secret_key: {{storage_secret_key}}
      vars:
        tag_name: concourse
      env:
        AWS_ACCESS_KEY_ID: {{environment_access_key}}
        AWS_SECRET_ACCESS_KEY: {{environment_secret_key}}
```

Tasks are definitions for executable units of a concourse pipeline that optionally receive inputs and produce outputs. Each task defines what is to be executed in a YAML file and tasks are referenced in pipelines. We could define a Task in another Git repository and use it in my pipeline as long as the repository has a corresponding `get` step in our concourse job.

Tasks may be provided with variables that are interpolated into the task config and parameters that are set as environment variables when the task is executed. Below is an example task and its usage in a pipeline.

```yaml
platform: linux

inputs:
- name: iac-example-concourse

run:
  path: bash
  args:
  - -euo
  - pipefail
  - -c
  - |
    cd iac-example-concourse
    make ((target))
```

```yaml
jobs:
- name: build
  serial: true
  plan:
  - get: iac-example-concourse
    trigger: true
  - task: build
    file: task-make.yaml
    vars: {target: build}
  - task: test
    file: task-make.yaml
    vars: {target: test}
    params: {VERBOSE: true}
```

One killer feature of Concourse - *you can override task inputs using artefacts local to your own machine*. Why would you do that? You can execute a task and see if it worked *before you `git push` .*

```bash
fly execute --config task.yaml --input=iac-example-concourse=.
```

&nbsp;

### Tekton - *Great*

Tekton Hub is a repository of re-usable Tekton tasks - we used one in the previous blog post to clone a git repository.

The Hub was delightfully simple to use to install the git-clone task, and it's great that there's a hosted community place to publish your own tasks and discover others. Unlike with Concourse where we had to use Google to find custom resource types, we found re-usable Tekton tasks by browsing the hub. Although we didn't use this feature, the hub can also share pipelines - I could imagine this being a fantastic way to share CI configuration to open source contributors for your projects.

```bash
tkn --namespace tekton-pipelines hub install git-clone
```

&nbsp;

### Argo Workflows - *Mediocre*

You can imagine Argo Workflows template or workflow reusability as basically the same as Tekton but you don't get the hub - which is disappointing. Argo Workflows templates and workflows are just YAML files so sharing them is trivial - if you know where to find them. Without a central repository of these like Tekton Hub or a clear abstraction like Concourse's resource types - you're essentially left to copy and paste pre-written templates from Stack Overflow or other similar places.

&nbsp;

### Summary

Argo Workflows offers nothing that assists in code re-use other than finding and copying YAML from the internet. Jenkins has a rich ecosystem of plugins available but installation of them feels little old-fashioned. There's also no guarantees that each plugin will work for different flavours of pipeline syntax. Concourse has fantastic resource types available that are easy to use but discovery of them is lacking. Tekton ships with marketplace integration to the Hub build in to the CLI and installation is seamless.

&nbsp;

## 7. Using the pipeline as a build monitor

Build monitors are enormously useful to teams writing software to solve problems. They should be in your face, making it very difficult to ignore problems and allow teams to "stop the line". Failures left in a failure state can at best rot and become more difficult to solve later and at worst they prevent further work. In this section we evaluate whether the UIs provided out of the box are appropriate as build monitors and if not, how much work is involved to use them as one.

### Jenkins - *Good*

Most of the value you can get from using Jenkins in a build monitor comes from plugins rather than Jenkins itself. With a vanilla Jenkins, you can see your pipelines represented compactly with a colour indicating their current state. One feature of this view I enjoyed is Jenkins renders a progress bar once you click into a pipeline's build history to give you a rough estimate of when you can expect a pipeline run to finish - it's the only CI system we looked at here that maintains an inter-job level awareness of performance.

<img src="/img/blog/ci-shootout/jenkins-aggregate.png" class="image fit" alt="Jenkins aggregate view" />

The build logs for jobs are difficult to read. The entire output of the build is placed into a single stream of text in the Console Output and it's difficult to reason about which stages are causing issues at a glance.

Things got better once we installed [Blue Ocean](https://www.jenkins.io/projects/blueocean/). It renders your pipeline in such a way that's it clear which order things are executed it and which things are parallel jobs.

<img src="/img/blog/ci-shootout/jenkins-pipeline.png" class="image fit" alt="Jenkins pipeline view" />

There are two downsides to using Blue Ocean as a build monitor. Firstly, you'll only get the view above if you click into a specific run of the pipeline, otherwise you get a view that is essentially a re-skin of the default Jenkins pipeline list. Secondly, Blue Ocean is reportedly difficult to maintain and there's low appetite to continue doing it when there are alternatives appearing such as the [Pipeline Graph View Plugin](https://github.com/jenkinsci/pipeline-graph-view-plugin).

### Concourse - *Great*

Concourse ships with a UI that is used to visualise flows of inputs and outputs through pipelines. It presents aggregate views of pipelines that give you information on which has failing jobs and more detailed views of individual pipelines that give an indication of what's running right now for a particular pipeline.

Software delivery teams with a single path to production would benefit most by displaying the individual pipeline on their build monitors. The view shows jobs, inputs, outputs and what triggers what with colours indicating the current state of each job.

<img src="/img/blog/ci-shootout/concourse-pipeline.png" class="image fit" alt="Concourse pipeline view" />

The aggregate view of the pipeline is suitable for folks that maintain many pipelines and shows a general indication of the health of each.

<img src="/img/blog/ci-shootout/concourse-aggregate.png" class="image fit" alt="Concourse aggregate view" />

The Concourse UI both looks great and is genuinely useful for at a glance indications of what's happening in CI right now. Jobs and tasks can be clicked into to see logs and a description of which inputs each job was triggered with. It's great at answering the question "which things were used to build this artefact?".

### Tekton - *Great*

In an earlier blog we mentioned we'd installed Tekton with `tekton-dashboard` included. The dashboard provides us with a fairly thin UI over what can be achieved via the `kubectl` or `tkn` CLIs, but it has some use as a build monitor.

In the dashboard you can view any Tekton related resources you've created such as Tasks or Pipelines. Below we show the tasks we've created for an earlier code snippet which includes one task we installed from the hub, git-clone.

<img src="/img/blog/ci-shootout/tekton-tasks.png" class="image fit" alt="Tekton tasks view" />

Displaying the PipelineRuns on a build monitor would provide an overview of the most recently executed pipelines and their status (passed or failed).

<img src="/img/blog/ci-shootout/tekton-aggregate.png" class="image fit" alt="Tekton aggregate view" />

For teams interested in a single pipeline, there's no way to watch runs of that pipeline without clicking into each individual run, as with Jenkins and unlike Concourse each PipelineRun's definition is a moment in time snapshot of a Pipeline which makes it great for auditing "what was the Pipeline definition when this ran?" which is possible with Concourse but more difficult.

Finally, by clicking into a PipelineRun we were able to see the stages involved in that run and their status and logs.

<img src="/img/blog/ci-shootout/tekton-run.png" class="image fit" alt="Tekton run view" />

### Argo Workflows - *Great*

Argo Workflows' default installation includes a UI that is functionally similar to Tekton's.

In the workflows view we can see a list of recently executed workflows and each of these can be clicked through to the details for that workflow execution.

<img src="/img/blog/ci-shootout/argo-aggregate.png" class="image fit" alt="Argo Workflows aggregate view" />

Unlike Tekton, argo renders the structure of the DAG we'd previously defined, clearly showing which templates depend on which. Clicking on individual templates in this view we can see more details related to the execution of that template such as logs.

<img src="/img/blog/ci-shootout/argo-pipeline.png" class="image fit" alt="Argo Workflows pipeline view" />

As with Tekton, there is no way to keep watching individual pipeline runs without clicking into a specific run first so teams that work with a single workflow will have to be content with the workflow list view shown at the beginning of this section.

### Summary

In terms of presentation of the CI system as a build monitor - all four options performed well *within their limitations and design philosophies.*

Concourse does not track "pipeline runs" as a concept, the pipeline is only ever a snapshot of right now and so displaying that snapshot on a build monitor is completely reasonable.

Jenkins, Tekton and Argo Workflows are better presented by their summary view, even for single-pipeline teams since the pipelines can simultaneously take more than one shape at once - pipeline runs remember the shape of the pipeline *when it ran*.
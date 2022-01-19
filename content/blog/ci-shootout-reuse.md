---
author: Tom Godkin
date: "2021-10-28"
heroImage: /img/blog/shootout-third-person.jpg
title: "CI Shootout: Re-use and build monitors"

heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

In [the previous blog](/blog/ci-shootout-inputs-and-outputs) we compared the act of reading state from, and writing state to, the outside world with four self-hosted CI systems: Jenkins, Concourse, Tekton & Argo Workflows. In this post we continue by looking at the re-usability of pipeline resources, and how well each serves as a build monitor.

* [_First post_](/blog/ci-shootout-getting-started) - 1. **Install** and configure the CI system
* [_First post_](/blog/ci-shootout-getting-started) - 2. **Run** a "Hello, World" task
* [_Second post_](/blog/ci-shootout-inputs-and-outputs) - 3. **Trigger** pipeline runs when external resources (eg Git repos, S3 buckets) change
* [_Second post_](/blog/ci-shootout-inputs-and-outputs) - 4. Use **inputs and outputs to tasks**
* [_Second post_](/blog/ci-shootout-inputs-and-outputs) - 5. Write **outputs externally** (like making a Git commit or pushing a file to S3)
* _This post_ - 6. [**Re-use** pipeline configuration](#6-composability-of-tasks)
* _This post_ - 7. [Use the CI system as a **build monitor**](#7-using-the-ci-system-as-a-build-monitor)
* [_Final post_](/blog/ci-shootout-conclusion) - 8. Conclusion

## 6. Composability of tasks

We'll evaluate how much of what we've written is re-usable by ourselves and others, and how easy it is to discover the work of others to avoid re-inventing the wheel.

### Jenkins - *Good*

Jenkins' reusability comes from plugins, for which there is [a repository](https://plugins.jenkins.io/) that you can browse through. Given Jenkins' age it's not surprising that there's a vast array of plugins (~1,800 community plugins at the time of writing) and we've already used a few: [the Git plugin](https://plugins.jenkins.io/git/) for pushing commits, and [Blue Ocean](https://plugins.jenkins.io/blueocean/) which we'll mention later in this post.

Jenkins plugins were traditionally installed by pointing and clicking through the Jenkins UI. More recently it become possible to install them via the Helm chart that we used to deploy our Jenkins. It feels a little strange that installing a plugin requires a whole `helm install`.

Once installed, Jenkins plugins can offer new options in the UI when creating pipelines or new blocks for use in the various pipeline syntax, such as the Git plugin's `withCredentials` extension.

```groovy
withCredentials([gitUsernamePassword(
  credentialsId: 'my-credentials-id',
  gitToolName: 'git-tool'
)]) {
  sh 'git fetch --all'
}
```

If you need to implement your own custom, reusable logic, Jenkins declarative pipelines support sprinkling in Groovy functions that can be referenced in several places.

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

Resource types are the definition of the resources we've already encountered in previous posts. Resources that we're already familiar with, such as the Git resource, have a corresponding resource type and is made available by Concourse by default.

Including another resource type in our pipeline is trivial - as in the below Terraform example, a short YAML stanza is all that is needed. This references an image in a container registry that implements the Concourse resource contract.

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
        access_key: ((storage_access_key))
        secret_key: ((storage_secret_key))
      vars:
        tag_name: concourse
      env:
        AWS_ACCESS_KEY_ID: ((environment_access_key))
        AWS_SECRET_ACCESS_KEY: ((environment_secret_key))
```

Tasks are definitions for executable units of a Concourse job that optionally receive inputs and produce outputs. Tasks can be defined in the pipeline YAML, or as external files that must be available when the job runs (eg in a Git repo that features as a `get` step in the job).

To reference an 'external' task configuration YAML, a `task` step is added to a job with a `file` entry pointing to where Concourse will find the YAML at runtime. This YAML in turn defines features of the task, such as the container image to be used, the executable to be invoked, and any environment variables that should be available.

Tasks definitions can be parameterised in two ways:

* `vars` which are provided for `((placeholders))` in the task configuration. These can be provided explicitly in the job's `vars` block, when the pipeline is set, or looked up in a secret manager such as Hashicorp Vault.
* `params` are environment variables provided when the task's executable is invoked. These can be set either in the task configuration or in the containing pipeline. For even more head-melting flexibility, you can use the templated variables described above _as_ params!

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

One killer feature of Concourse - *you can override task inputs using artefacts local to your own machine*. Why would you do that? You can execute a task and see if it works *before you `git push` .* A friend of EngineerBetter [described this as a "hidden gem"](https://medium.com/@andrew_merrell/concourses-fly-execute-is-a-hidden-gem-5f4b54ffb249).

```bash
fly execute --config task.yaml --input=iac-example-concourse=.
```

&nbsp;

### Tekton - *Great*

Tekton Hub is a repository of re-usable Tekton tasks - we used one in the previous blog post to clone a Git repository.

Tekton Hub was delightfully simple to use to install the git-clone task, and it's great that there's a hosted community place to publish your own tasks and discover others.

Unlike with Concourse where we had to search the web to find custom resource types, we found re-usable Tekton tasks by browsing the hub. Although we didn't use this feature, the hub can also share pipelines - I could imagine this being a fantastic way to share CI configuration to open source contributors for your projects.

```bash
tkn --namespace tekton-pipelines hub install git-clone
```

&nbsp;

### Argo Workflows - *Mediocre*

Argo Workflows template and workflow reusability is basically the same as Tekton, but you don't get the hub - which is disappointing.

Argo Workflows templates and workflows are just YAML files so sharing them is trivial - if you know where to find them. Without a central repository of these like Tekton Hub or a clear abstraction like Concourse's resource types - you're essentially left to copy and paste pre-written templates from Stack Overflow or other similar places.

&nbsp;

### Summary

* Argo Workflows offers nothing that assists in code re-use other than finding and copying YAML from the internet.
* Jenkins has a rich ecosystem of plugins available but installation of them feels a little old-fashioned. There are no guarantees that each plugin will work for different flavours of pipeline syntax, plugins need to be updated, and they may not work well together.
* Concourse has a wide range of resource types available that are easy to use, but discoverability of them is lacking.
* Tekton ships with marketplace integration to the Hub build in to the CLI and installation is seamless.

&nbsp;

## 7. Using the CI system as a build monitor

Build monitors are enormously useful to continuously present information about changes being made. They should be 'in your face', making it very difficult to ignore problems, and therefore they should allow teams to 'stop the line'.

Builds that are left in a failed state can block future work, and the longer the issue goes unnoticed the more context is lost before someone stumbles across the problem and is tasked with fixing it.

In this section we evaluate whether the UIs provided out of the box are appropriate as build monitors and if not, how much work is involved to use them as one.

### Jenkins - *Good*

Most of the value you can get from using Jenkins as a build monitor comes from plugins rather than Jenkins itself. With a vanilla Jenkins you can see your *jobs* represented compactly with a colour indicating their current state, but without additional plugins there is no pipeline view.

One feature of this view I enjoyed is that Jenkins renders a progress bar once you click into a pipeline's build history to give you a rough estimate of when you can expect a pipeline run to finish - it's the only CI system we looked at here that maintains an inter-execution level awareness of performance.

<img src="/img/blog/ci-shootout/jenkins-aggregate.png" class="image fit" alt="Jenkins aggregate view" />

The build logs for jobs are difficult to read. The entire output of the build is placed into a single stream of text in the Console Output and it's difficult to reason about which stages are causing issues at a glance.

Things got better once we installed [Blue Ocean](https://www.jenkins.io/projects/blueocean/). It renders your jobs as a pipeline, making it clear which order they are executed in, and which things are run in parallel.

<img src="/img/blog/ci-shootout/jenkins-pipeline.png" class="image fit" alt="Jenkins pipeline view" />

There are two downsides to using Blue Ocean as a build monitor. Firstly, you'll only get the view above if you click into a specific run of the pipeline, otherwise you get a view that is essentially a re-skin of the default Jenkins pipeline list. Secondly, Blue Ocean is reportedly difficult to maintain and there's low appetite to continue doing so when there are alternatives appearing such as the [Pipeline Graph View Plugin](https://github.com/jenkinsci/pipeline-graph-view-plugin).

### Concourse - *Great*

Concourse ships with a UI that is used to visualise flows of inputs and outputs through pipelines. It presents aggregate views of pipelines that give you information on which has failing jobs, and more detailed views of individual pipelines that give an indication of what jobs are running right now.

Software delivery teams with a single path to production would benefit most by displaying the individual pipeline on their build monitors. The view shows jobs, inputs, outputs and what-triggers-what with colours and animations indicating the current state of each job.

<img src="/img/blog/ci-shootout/concourse-pipeline.png" class="image fit" alt="Concourse pipeline view" />

The aggregate view of the pipeline is suitable for folks that maintain many pipelines and shows a general indication of the health of each.

<img src="/img/blog/ci-shootout/concourse-aggregate.png" class="image fit" alt="Concourse aggregate view" />

The Concourse UI both looks great and is genuinely useful for at-a-glance indications of what's happening in CI right now. Jobs and tasks can be clicked into to see logs and a description of which inputs each job was triggered with. It's great at answering the question "which things were used to build this artefact?".

Concourse was designed for integration, which means that it lends itself to representing entire value streams. This can be beneficial as a 'reverse Conway maneuvre' to force collaboration and shared ownership among teams - [something EngineerBetter has done to great effect](/blog/continuous-everything-regulated).

### Tekton - *Great*

In an earlier post we mentioned that we'd installed Tekton with `tekton-dashboard` included. The dashboard provides us with a fairly thin UI over what can be achieved via the `kubectl` or `tkn` CLIs, but it has some use as a build monitor.

In the dashboard you can view any Tekton related resources you've created such as Tasks or Pipelines. Below we show the tasks we've created for an earlier code snippet which includes one task we installed from the hub, git-clone.

<img src="/img/blog/ci-shootout/tekton-tasks.png" class="image fit" alt="Tekton tasks view" />

Displaying the PipelineRuns on a build monitor would provide an overview of the most recently executed pipelines and their status (passed or failed).

<img src="/img/blog/ci-shootout/tekton-aggregate.png" class="image fit" alt="Tekton aggregate view" />

For teams interested in a single pipeline, there's no way to watch runs of that pipeline without clicking into each individual run, which is the same limitation we saw in Jenkins.

Unlike Concourse each PipelineRun's definition is a moment-in-time snapshot of a Pipeline which makes it great for auditing "what was the Pipeline definition when this ran?" It is possible to piece together that information with Concourse, but it is not represented in a single UI view.

Finally, by clicking into a PipelineRun we were able to see the stages involved in that run and their status and logs.

<img src="/img/blog/ci-shootout/tekton-run.png" class="image fit" alt="Tekton run view" />

### Argo Workflows - *Great*

Argo Workflows' default installation includes a UI that is functionally similar to Tekton's.

In the workflows view we can see a list of recently executed workflows and each of these can be clicked through to the details for that workflow execution.

<img src="/img/blog/ci-shootout/argo-aggregate.png" class="image fit" alt="Argo Workflows aggregate view" />

Unlike Tekton, Argo renders the structure of the DAG we'd previously defined, clearly showing which templates depend on which. Clicking on individual templates in this view we can see more details related to the execution of that template, such as build logs.

<img src="/img/blog/ci-shootout/argo-pipeline.png" class="image fit" alt="Argo Workflows pipeline view" />

As with Tekton, there is no way to keep watching individual pipeline runs without clicking into a specific run first. Teams that work with a single workflow will have to be content with the list view shown at the beginning of this section.

### Summary

In terms of presentation of the CI system as a build monitor - all four options performed well *within their limitations and design philosophies.*

Concourse does not track 'pipeline runs' as a concept, and so the _one_ view of a pipeline is what's happening _right now_. There's no need to flip between views of different runs, making this view very suitable as a build monitor.

Jenkins, Tekton and Argo Workflows present one view per pipeline run, meaning that if you want to see the current build state of a project, the best place to do so is on the page that lists these runs. This has the downside of not being able to see the detail of each run without further clicking, but with the benefit of being able to discover exactly what the pipeline looked like for each run.

## Scorecard

<table class="comparison">
  <tr>
    <td>
    </td>
    <th>
      Jenkins
    </th>
    <th>
      Concourse
    </th>
    <th>
      Tekton
    </th>
    <th>
      Argo Workflows
    </th>
  </tr>
  <tr>
    <td>
      Re-use
    </td>
    <td>
      Good
    </td>
    <td>
      Good
    </td>
    <td>
      Great
    </td>
    <td>
      Mediocre
    </td>
  </tr>
  <tr>
    <td>
      Build monitor
    </td>
    <td>
      Good
    </td>
    <td>
      Great
    </td>
    <td>
      Great
    </td>
    <td>
      Great
    </td>
  </tr>
</table>

&nbsp;

## Next time

Wait, wasn't this supposed to be a three-part series?

We've learned a lot about each CI system, and how their different design philosophies lend them to different uses and ways of working.

In the fourth and final (we mean it this time) post we'll reflect on how the four compare, and which CI system is the best choice in varying scenarios.

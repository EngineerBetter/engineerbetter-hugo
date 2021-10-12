---
author: Tom Godkin
date: "2021-10-12"
heroImage: /img/blog/gunfight-enchanted-springs.jpg
title: "CI Shootout: Triggering, Inputs, and Outputs"
draft: true

heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

In [the previous blog](/blog/ci-shootout-getting-started/) we looked at getting started with four self-hosted CI systems: Jenkins, Concourse, Tekton & Argo Workflows. In this post we continue by looking at the next set of use cases:

* [_First post_](/blog/ci-shootout-getting-started) - 1. **Install** and configure the CI system
* [_First post_](/blog/ci-shootout-getting-started) - 2. **Run** a "Hello, World" task
* _This post_ - [3. **Trigger** pipeline runs when external resources (eg Git repos, S3 buckets) change](#3-trigger-pipeline-runs)
* _This post_ - [4. Use **inputs and outputs to tasks**](#4-use-inputs-and-outputs-to-tasks)
* _This post_ - [5. Write **outputs externally** (like making a Git commit or pushing a file to S3)](#5-writing-output-to-external-resources)
* _Third post_ - 6. **Re-use** pipeline configuration
* _Third post_ - 7. Use the CI system as a **build monitor**

## 3. Trigger pipeline runs

Running tasks in CI manually is all well and good, but for CI to be useful, it'll need some amount of automation. Here we'll evaluate different mechanisms that can be used for triggering pipelines. In particular we'll look at triggering on:

* new commits to a Git repository
* new files in an S3 bucket
* a timed schedule

We'll also examine whether each of these systems supports a 'push' (external systems send events to the CI server via [webhooks](https://en.wikipedia.org/wiki/Webhook)) or 'pull' (the CI server regularly polls external systems) model when it comes to external triggers.

### Jenkins - *Good*

Jenkins does not model external resources as any kind of first-level concept. It does, to some extent, support two of the use cases we're interested in out of the box.

Jenkins' declarative pipelines can be configured with a cron schedule for triggering. Each pipeline can also be configured with a VCS URL which supports either push-based triggering via webhooks, or pull-based via polling the repository.

There's a Jenkins plugin that'll let you upload files to S3, but unfortunately that same plugin can't trigger pipelines when the contents of the bucket change.

Each Jenkins declarative pipeline only supports referencing a single VCS repository, so it isn't possible to trigger on changes to multiple repositories. To work around this you'd need to configure webhooks on each repository to trigger the one pipeline.

Webhooks are a popular way to trigger CI systems in the cloud native world, but that does put those who don't wish to expose their build systems to the outside world in an awkward position. For example, it might be tricky to convince a bank to open their CI system, which deploys to production, to the public internet so that it can receive webhooks.

In a later blog post we'll encounter frustration with the lack of triggering on S3 (without hooks) when we discuss promotion of change via a bill of materials.

```xml
<?xml version='1.1' encoding='UTF-8'?>
<flow-definition plugin="workflow-job@2.40">
  <properties>
    <org.jenkinsci.plugins.workflow.job.properties.PipelineTriggersJobProperty>
      <triggers>
        <hudson.triggers.TimerTrigger>
          <spec>@hourly</spec>
        </hudson.triggers.TimerTrigger>
        <hudson.triggers.SCMTrigger>
          <spec>H/2 * * * *</spec>
          <ignorePostCommitHooks>false</ignorePostCommitHooks>
        </hudson.triggers.SCMTrigger>
      </triggers>
    </org.jenkinsci.plugins.workflow.job.properties.PipelineTriggersJobProperty>
  </properties>
  <definition class="org.jenkinsci.plugins.workflow.cps.CpsScmFlowDefinition" plugin="workflow-cps@2.90">
    <scm class="hudson.plugins.git.GitSCM" plugin="git@4.7.1">
      <configVersion>2</configVersion>
      <userRemoteConfigs>
        <hudson.plugins.git.UserRemoteConfig>
          <url>https://github.com/EngineerBetter/iac-example</url>
        </hudson.plugins.git.UserRemoteConfig>
      </userRemoteConfigs>
      <branches>
        <hudson.plugins.git.BranchSpec>
          <name>main</name>
        </hudson.plugins.git.BranchSpec>
      </branches>
  </definition>
</flow-definition>
```

&nbsp;

### Concourse - *Great*

[Resources](https://concourse-ci.org/resources.html) in Concourse are implemented based around a strict binary API; each resource can:
* **get** a version of that resource type
* **put** a new version, or
* **check** for new versions.

By default, Concourse will check for new versions of each resource every two minutes and jobs that use those resources can be configured to trigger when a new version is found.

For example, suppose your pipeline was processing a CSV file that was to be found in a S3 bucket. By modelling that file as a resource your Concourse will check the bucket every two minutes and will trigger any configured jobs automatically. The amount of configuration required to set this up is trivial.

Concourse supports a vast array of resource types, with many being provided by Concourse by default. Here are some examples of those that are supported: [Git repositories](https://github.com/concourse/git-resource), [S3 buckets](https://github.com/concourse/s3-resource), [timers](https://github.com/concourse/time-resource), and [registry images](https://github.com/concourse/registry-image-resource). On the rare occasion that the resource type you want to use isn't built in to Concourse, it's probably already been built by the community such as [Terraform backends](https://github.com/ljfranklin/terraform-resource) or [semaphores](https://github.com/concourse/pool-resource).

Since Concourse follows a 'pull' model for resources, it is ideally suited for environments that are not accessible from the public internet.

```yaml
resources:
- name: iac-example-concourse
  type: git
  source: {uri: "https://github.com/EngineerBetter/iac-example-concourse"}

jobs:
- name: test
  plan:
  - get: iac-example-concourse
    trigger: true
  - task: test
    config:
      platform: linux
      image_resource:
        type: registry-image
        source: {repository: busybox}
      run:
        path: echo
        args: [hello]
```

&nbsp;

### Tekton - *Poor*

As covered in [the first post](/blog/ci-shootout-getting-started), Tekton may be optionally deployed with a few other components to allow Events to trigger either a TaskRun or a PipelineRun. The sequence of events is:

1. A hook configured in VCS hits the URL of a Tekton EventListener
2. The EventListener uses a TriggerBinding to create a TaskRun or PipelineRun
3. The pipeline is executed

All of this is exposed to the pipeline author and this is the method used for any programmatic triggering of Tekton pipelines.

In configuring our Tekton pipeline to trigger hourly, we had to configure three separate Kubernetes resources using about 60 lines of YAML (for reference, configuring an hourly run of Concourse involved deploying nothing and 4 lines of YAML).

Several things raised our eyebrows whilst configuring triggers for our Tekton pipeline. First we revisit the issue identified with triggering in Jenkins - it only works if the CI server is accessible from the public internet.

Secondly, the number of moving parts involved to configure something as simple as an hourly run of our pipeline seemed excessively complicated, probably due to the fact that Tekton is Kubernetes native and there's no getting around implementing it this way without introducing layers of abstraction over Tekton.

It seems as though Tekton is designed for higher layers of abstraction to be built over the top of it. For example it wouldn't be *too* difficult to introduce a polling adapter Cron job that interfaces with Concourse's resource binary interface to check for new version of resources.

*cron.yaml*

```yaml
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: hello
spec:
  schedule: "*/60 9-16 * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: hello
            image: curlimages/curl
            args: ["curl", "-X", "POST", "--data", "{}", "el-cron-listener.default.svc.cluster.local:8080"]
          restartPolicy: Never
```

*listener.yaml*

```yaml
apiVersion: triggers.tekton.dev/v1alpha1
kind: EventListener
metadata: {name: cron-listener}
spec:
  serviceAccountName: iac-example-sa
  triggers:
  - name: cron-trig
    bindings:
    - ref: cron-binding
    template: {ref: iac-example-pipeline-template}
```

*template.yaml*

```yaml
apiVersion: triggers.tekton.dev/v1alpha1
kind: TriggerTemplate
metadata:
  name: iac-example-pipeline-template
spec:
  resourcetemplates:
  - apiVersion: tekton.dev/v1beta1
    kind: PipelineRun
    metadata:
      generateName: deploy-pipeline-run-
      labels: {iac-example-definition: run}
    spec:
      pipelineRef: {name: iac-example-deploy}
      workspaces:
      - name: ssh-directory
        secret: {secretName: iac-example-tekton-deploy-key}
      - name: git-source
        volumeClaimTemplate:
          spec:
            accessModes: [ReadWriteOnce]
            resources:
              requests: {storage: 1Gi}
```

*binding.yaml*

```yaml
apiVersion: triggers.tekton.dev/v1alpha1
kind: TriggerBinding
metadata:
  name: cron-binding
```

&nbsp;

### Argo Workflows - *Mediocre*

Argo Workflows' triggering mechanisms are realised by using another tool from the Argo toolkit: [Argo Events](https://argoproj.github.io/argo-events/). Events are installed onto a Kubernetes cluster by applying configuration available via the [Argo Events installation docs](https://argoproj.github.io/argo-events/installation/).

The architecture of Argo Events contains one or more Event Sources that configure their target resource (such as a GitHub repository or Amazon SNS) to make the Event Source aware of changes in their state (such as a `git push` or a pull request). The Event Source will then write an Event to the EventBus. Separately, Argo Sensors are configured on the cluster that will respond to particular Events. One such Sensor is able to trigger creation of Argo Workflow resources (such as triggering a Workflow).

The model is remarkably similar to Tekton and uses a push rather than a pull model. It is slightly easier to configure than Tekton since the Event Source does the work of configuring the external resource on your behalf (such as configuring a GitHub webhook). Again as with Tekton the amount of configuration required to run a Workflow hourly is an order of magnitude more than Concourse requires.

*eventsource.yaml*

```yaml
apiVersion: argoproj.io/v1alpha1
kind: EventSource
metadata: {name: eventsource-calendar}
spec:
  calendar:
    main: {interval: 1h}
```

*sensor.yaml*

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Sensor
metadata: {name: sensor-cron}
spec:
  template: {serviceAccountName: operate-workflow-sa}
  dependencies:
  - name: cron-dep
    eventSourceName: eventsource-calendar
    eventName: main
  triggers:
  - template:
      name: webhook-workflow-trigger
      argoWorkflow:
        group: argoproj.io
        version: v1alpha1
        resource: workflows
        operation: submit
        source:
          resource:
            apiVersion: argoproj.io/v1alpha1
            kind: Workflow
            metadata:
              namespace: argo
              generateName: hello-
            spec:
              entrypoint: hello
              workflowTemplateRef: {name: workflow-template-hello}
```

&nbsp;

### Summary

Both Tekton and Argo Workflows require installation of additional components (such as a cron job or a sensor) in order to trigger builds based on external changes such as timers. Approaching these two systems from nothing required an amount of reading and tinkering with YAML that seems to defy the simplicity of 'run this once an hour'.

Jenkins and Concourse pipelines were trivial to trigger programmatically by comparison, with Jenkins falling shy of a "Great" rating due to the pipeline being coupled to a single repository.

## 4. Use **inputs and outputs to tasks**

Now that pipelines are triggered by external resources, we'll look at how to use those resources in our tasks. Specifically we'll look at using code in a Git repository to run tests, rather than a static "Hello World" task from the previous post.

### Jenkins - *Good*

Since we'd already defined a Git repository in the previous section in order to trigger the pipeline, the Git repository was always made available by Jenkins and indeed the current working directory of any pipeline stages we defined was the root directory of the repository. This tight coupling with a VCS served us well for this use case, but we can't help but wonder how much extra effort it would involve to use another repository in addition to one that triggers the pipeline.

One quirk of Jenkins was that we had to specify that we want the workspace cleaned between runs. It'd be easy to forget this and pollute your tests with state from a previous run - having workspaces cleaned up by default seems like the kind of thing you'd want (almost) all of the time.

A small snippet of extra configuration is required to ensure a clean workspace:

```groovy
pipeline {
  ...

  post {
    always {
      cleanWS()
    }
  }
}
```

&nbsp;

### Concourse - *Great*

Each Concourse Task begins with its working directory containing subdirectories for each input to that Task. For example, a Git resource "foo" provided as an input will be present within the Task container as a checked out Git repository at `./foo`.

In the previous section we showed how Concourse pipelines may be triggered by changes to Git resources. In fact, no additional configuration is required to demonstrate using the repository in that example - it really was that simple.

### Tekton - *Great*

Being Kubernetes native, Tekton has implemented sharing of inputs and outputs between TaskRuns by mounting VolumeClaims into each TaskRun. In order to use a Git repository in Tekton, you'd have a Task to clone the Git repository into a directory on the mounted VolumeClaim which Tekton's configuration calls a workspace. That workspace is then defined as an output to the Task cloning the repository and an input to whichever Tasks would like to use the repository.

Much like in Concourse, workspaces are simply directories available to the TaskRun at run time. The Tekton marketplace makes available a few reusable tasks to perform common actions such as cloning a Git repository, which we've used in the example below.

```yaml
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata: {name: tkn-clone-demo}
spec:
  workspaces:
  - name: ssh-directory
  - name: iac-example-tekton
  tasks:
  - name: git-clone
    taskRef: {name: git-clone}
    workspaces:
    - name: output
      workspace: iac-example-tekton
    - name: ssh-directory
      workspace: ssh-directory
    params:
    - name: url
      value: git@github.com:EngineerBetter/iac-example-tekton.git
  - name: test
    workspaces:
    - name: iac-example-tekton
    runAfter: git-clone
    taskRef: {name: test-iac-example-tekton}
```

&nbsp;

### Argo Workflows - *Good*

As with Tekton, Argo Workflows moves state between tasks by mounting VolumeClaims to each container. By declaring an input artifact of type "git", a Git repository is cloned into the a directory inside the container.

Argo Workflows makes a number of different artifact types available, including [Git repositories, S3](https://argoproj.github.io/argo-workflows/fields/#artifact) and integration with [Artifactory](https://jfrog.com/artifactory/).

With artifacts modelled as an input to a particular task, it was a little awkward to use when we changed the order of our templates as we had to move the input definition to an earlier template. It'd probably be easier to work with had we defined a "no op" template with our inputs included as the first template in the DAG.

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata: {generateName: git-workflow-}
spec:
  entryPoint: hello
  volumeClaimTemplates:
  - metadata: {name: workdir}
    spec:
      accessModes: [ReadWriteMany]
      resources:
        requests: {storage: 200Mi}
  templates:
  - name: hello
    inputs:
      artifacts:
      - name: repository
        path: &repo_dir /workdir/iac-example-argo
        git: {repo: https://github.com/EngineerBetter/iac-example-argo}
    container:
      command: [make]
      args: [test]
      image: "engineerbetter/iac-example-ci:15-promote"
      workingDir: *repo_dir
      volumeMounts:
      - name: workdir
        mountPath: /workdir
```

&nbsp;

### Summary

All four CI systems made using a Git repository trivial. Argo Workflows had a quirk in that "artifact" inputs are attached to a template (task), which means changing the order of tasks added an amount of toil.

## 5. Writing output to external resources

A pipeline is of limited use unless it can change the state of something else in the world. In this section we'll evaluate the difficulty involved in committing to a Git repository.

### Jenkins - *Poor*

Pushing a change to remote in a Git repository in Jenkins was a *journey*.

Jenkins has a plugin that can be installed to provide helpers within your declarative pipeline definition that would have made it trivial to change the configured remote Git server, but there was one catch. Due to a long-standing bug it did not work within declarative pipelines.

Our other option was to directly invoke the Git CLI within a stage in the pipeline, which also didn't work because of issues with the UID alias within the Jenkins container image. (We did manage to resolve the UID issue by building a container image within Jenkins, but the solution added so much complexity that we abandoned it).

Eventually we created a _separate_ pipeline using an older syntax that was compatible with the Git plugin, and we had our main pipeline trigger this pipeline when it needed to make a commit.

*pipeline.yaml*

```groovy
pipeline {
  stages {
    ...

    stage('Promote') {
      steps {
        script {
          GIT_REVISION = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
        }

        build(
          job: 'Push Git Branch',
          propagate: false,
          wait: false,
          parameters: [
            string(name: 'GIT_REVISION', value: GIT_REVISION),
            string(name: 'REFERENCE', value: env.PROMOTES_TO)
          ]
        )
      }
    }
  }
}
```

*push-to-git.xml*

```xml
<?xml version='1.1' encoding='UTF-8'?>
<project>
  <actions/>
  <description></description>
  <keepDependencies>false</keepDependencies>
  <properties>
    <hudson.model.ParametersDefinitionProperty>
      <parameterDefinitions>
        <hudson.model.StringParameterDefinition>
          <name>GIT_REVISION</name>
          <description></description>
          <defaultValue></defaultValue>
          <trim>false</trim>
        </hudson.model.StringParameterDefinition>
        <hudson.model.StringParameterDefinition>
          <name>REFERENCE</name>
          <description></description>
          <defaultValue></defaultValue>
          <trim>false</trim>
        </hudson.model.StringParameterDefinition>
      </parameterDefinitions>
    </hudson.model.ParametersDefinitionProperty>
  </properties>
  <scm class="hudson.plugins.git.GitSCM" plugin="git@4.7.1">
    <configVersion>2</configVersion>
    <userRemoteConfigs>
      <hudson.plugins.git.UserRemoteConfig>
        <url>REPLACE_ME_REPOSITORY_URL</url>
        <credentialsId>git</credentialsId>
      </hudson.plugins.git.UserRemoteConfig>
    </userRemoteConfigs>
    <branches>
      <hudson.plugins.git.BranchSpec>
        <name>*/main</name>
      </hudson.plugins.git.BranchSpec>
    </branches>
    <doGenerateSubmoduleConfigurations>false</doGenerateSubmoduleConfigurations>
    <submoduleCfg class="empty-list"/>
    <extensions/>
  </scm>
  <canRoam>true</canRoam>
  <disabled>false</disabled>
  <blockBuildWhenDownstreamBuilding>false</blockBuildWhenDownstreamBuilding>
  <blockBuildWhenUpstreamBuilding>false</blockBuildWhenUpstreamBuilding>
  <triggers/>
  <concurrentBuild>false</concurrentBuild>
  <builders>
    <hudson.tasks.Shell>
      <command>echo &quot;Revision: $GIT_REVISION&quot;
echo &quot;Branch: $REFERENCE&quot;

git push origin &quot;$( git rev-parse &quot;$GIT_REVISION&quot; ):refs/heads/${REFERENCE}&quot;</command>
      <configuredLocalRules/>
    </hudson.tasks.Shell>
  </builders>
  <publishers/>
  <buildWrappers>
    <com.cloudbees.jenkins.plugins.sshagent.SSHAgentBuildWrapper plugin="ssh-agent@1.22">
      <credentialIds>
        <string>git</string>
      </credentialIds>
      <ignoreMissing>false</ignoreMissing>
    </com.cloudbees.jenkins.plugins.sshagent.SSHAgentBuildWrapper>
  </buildWrappers>
</project>
```

&nbsp;

### Concourse - *Great*

The previously visited Concourse resources each define a 'get' and a 'put' step. This means that we can use the [Git resource](https://github.com/concourse/git-resource) that was already defined in order to push a commit, branch or tag to that repository. This was ridiculously trivial.

```yaml
jobs:
...
- name: promote
  plan:
  - put: iac-example-concourse
```

&nbsp;

### Tekton - *Mediocre*

Pushing to a Git repository using Tekton involved invoking the Git CLI in a shell script. Browsing Tekton Hub, we found that the published Git tasks were very operation specific - such as a task for performing a `git clone`.

Using a Kubernetes secret which contained the deploy key for our repository, we mounted the deploy key within our Task, at runtime added it to the keychain, and `git push`ed. Tekton and its ecosystem did not provide tooling to make this any easier.

There's probably some value in publishing a `git push` task to Tekton Hub.

```bash
tkn hub install git-clone
kubectl \
  --namespace tekton-pipelines \
  apply \
  --filename task.yaml
kubectl \
  --namespace tekton-pipelines \
  apply \
  --filename pipeline.yaml
```

*pipeline.yaml*

```yaml
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata: {name: tkn-push-demo}
spec:
  params:
  - name: git-name
  - name: git-email
  workspaces:
  - name: ssh-directory
  - name: tkn-push-demo
  tasks:
  - name: git-clone
    taskRef: {name: git-clone}
    workspaces:
    - name: output
      workspace: tkn-push-demo
    - name: ssh-directory
      workspace: ssh-directory
    params:
    - name: url
      value: 'git@github.com:EngineerBetter/tkn-push-demo.git'
  - name: increment-number
    ...
  - name: git-push
    params:
    - name: git-name
      value: $(params.git-name)
    - name: git-email
      value: $(params.git-email)
    workspaces:
    - name: tkn-push-demo
      workspace: tkn-push-demo
    - name: ssh-directory
      workspace: ssh-directory
    taskRef: {name: git-push}
    runAfter: [increment-number]
```

*task.yaml*

```yaml
apiVersion: tekton.dev/v1beta1
kind: Task
metadata: {name: git-push}
spec:
  params:
  - name: git-name
  - name: git-email
  workspaces:
  - name: tkn-push-demo
  - name: ssh-directory
  steps:
  - name: increment-number
    image: alpine/git
    workingDir: $(workspaces.tkn-push-demo.path)
    script: |
      #!/usr/bin/env sh
      set -euo pipefail

      eval "$( ssh-agent -s )"
      ssh-add $(workspaces.ssh-directory.path)/id_rsa

      git config --global user.email '$(params.git-email)'
      git config --global user.name '$(params.git-name)'
      git add ./number
      git commit --message 'Increment number'
      git push origin HEAD:main
```

&nbsp;

### Argo Workflows - *Mediocre*

Just as with Tekton, pushing to a Git repository in Argo Workflows involved using the Git CLI directly in a script. In the case of Argo Workflows we had to disable StrictHostKeyChecking explicitly via an environment variable.

Once again the deploy key we needed was applied as a Kubernetes secret.

```bash
argo \
  --namespace argo \
  submit scratch/manifests/workflow.yaml \
  --wait \
  --parameter "git-name=$PARAM_GIT_NAME" \
  --parameter "git-email=$PARAM_GIT_EMAIL"
```

```yaml
---
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata: {generateName: git-push-workflow-}
spec:
  entryPoint: workflow
  volumeClaimTemplates:
  - metadata: {name: workdir}
    spec:
      accessModes: [ReadWriteMany]
      resources: {requests: {storage: 200Mi}}
  volumes:
  - name: ssh-creds
    secret:
      secretName: ssh-directory
      defaultMode: 0400
  arguments:
    parameters: [{name: git-name}, {name: git-email}]
  templates:
  - name: workflow
    dag:
      tasks:
      - name: increment-number
        template: increment-number
      - name: git-push
        template: git-push
        dependencies: [increment-number]
        arguments:
          parameters:
          - name: git-name
            value: "{{workflow.parameters.git-name}}"
          - name: git-email
            value: "{{workflow.parameters.git-email}}"
  - name: increment-number
    ...
  - name: git-push
    inputs:
      parameters: [{name: git-name}, {name: git-email}]
    script:
      image: alpine/git
      workingDir: *workdir
      volumeMounts: *volume_mounts
      command: [sh]
      source: |
        set -euo pipefail

        eval "$( ssh-agent -s )"
        ssh-add /ssh-creds/id_rsa

        git config --global user.email '{{workflow.parameters.git-email}}'
        git config --global user.name '{{workflow.parameters.git-name}}'
        git add ./number
        git commit --message 'Increment number'
        git push origin HEAD:main
      env:
      - name: GIT_SSH_COMMAND
        value: ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no
```

&nbsp;

### Summary

Both Tekton and Argo Workflows offered no abstractions over performing a Git push.

Due to an issue in Jenkins that prevented the Git plugin working with Declarative Pipelines, we had to actively fight Jenkins and perform a workaround to achieve a Git push.

Concourse's resource abstraction meant Git push was 2 lines of YAML.

It's interesting to compare the amount of time it took us to produce the above Git Push examples (starting from not knowing anything about each system):

* Jenkins took about 4 hours since we had to wade through bug reports and broken example code
* Argo Workflows and Tekton both took about 2 hours to read through docs related to inputs/outputs and produce a working snippet
* Producing the Concourse snippet and seeing it work took about 10 minutes

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
      Triggering
    </td>
    <td>
      Good
    </td>
    <td>
      Great
    </td>
    <td>
      Poor
    </td>
    <td>
      Mediocre
    </td>
  </tr>
  <tr>
    <td>
      Using inputs
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
      Good
    </td>
  </tr>
  <tr>
    <td>
      Write outputs
    </td>
    <td>
      Poor
    </td>
    <td>
      Great
    </td>
    <td>
      Mediocre
    </td>
    <td>
      Mediocre
    </td>
  </tr>
</table>

&nbsp;

## Next time

In the final post in this series we will see how good the systems are for the remaining use cases:

* _**Re-use** pipeline configuration for promotion_
* _Use the CI system as a **build monitor**_

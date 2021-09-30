---
author: Tom Godkin
date: "2021-09-30"
draft: true
heroImage: tbd
title: "CI Shootout: Getting started with Jenkins, Concourse, Tekton and Argo Workflows"

heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

At EngineerBetter we've evaluated four self-hosted CI systems in order to compare them against each other: [Jenkins](https://www.jenkins.io/), [Concourse](https://concourse-ci.org/), [Tekton](https://tekton.dev/) and [Argo Workflows](https://argoproj.github.io/workflows/). For each CI system we've created some pipelines that:

* Run pre-deployment static analysis over various forms of Infrastructure as Code configuration
* Deploy a [Kubernetes](https://kubernetes.io/) cluster to a staging environment
* Deploy the [Sock Shop](https://github.com/microservices-demo/microservices-demo) application to the cluster
* Run an acceptance test on the deployed application
* Promote the deployment by triggering an identical production pipeline

Across a series of blog posts, we'll be evaluating how each CI system supports the following use cases:

1. [**Install** and configure the CI system](#1-install-and-configure-the-ci-system)
2. [**Run** a "Hello, World" task](#2-run-a-hello-world-task)
3. **Trigger** pipeline runs when external resources (such as Git commits or uploads to a S3 bucket) change
1. Use **inputs and outputs to tasks**
1. Write **outputs externally** (like making a Git commit or pushing a file to S3)
1. **Re-use** pipeline configuration
1. Use the CI system as a **build monitor**

In this post we'll explore the first two of the use cases listed above. In each section we'll give each CI system a rating of either *Poor*, *Mediocre*, *Good* or *Great*.

## 1. Install and Configure the CI system

Just how difficult is it to get from not having a CI system to having one? Here we answer that question by exploring how much configuration was needed and the amount of manual work required in each case. We deployed each CI system to an already-existing Kubernetes.

### Jenkins - *Mediocre*

We used [Helm to install Jenkins in a single command](https://github.com/EngineerBetter/iac-example/tree/main/helmfile.d); installation itself was seamless and trivial. Configuration of Jenkins was less trivial and we found ourselves wanting to [customise Jenkins default configuration](https://github.com/EngineerBetter/iac-example/blob/main/config/default/jenkins.yaml). Jenkins [configuration ships with mostly good defaults](https://github.com/jenkins-infra/charts/blob/master/config/default/jenkins-infra.yaml) (if you know where to find them) but you'll almost always want to change something and staring at ~600 lines of configuration YAML is a pretty daunting task if you're meeting Jenkins configuration for the first time. For example, we wanted to be explicit about which plugins we required (via Infrastructure as Code) such as Blue Ocean (a prettier pipeline UI), so we specified that in the configuration file.

```bash
# Create a helmfile.d directory with the below helmfile config
# Custom Jenkins configuration is linked in the above paragraph
helmfile apply
```

```yaml
---
helmDefaults:
  atomic: false
  force: false
  timeout: 480
  wait: true

releases:
- name: jenkins
  chart: jenkins/jenkins
  version: 3.3.18
  namespace: jenkins
  values: ["../config/default/jenkins.yaml"]
  set:
  - name: namespace
  value: jenkins
```

```yaml
repositories:
- name: jenkins
  url: https://charts.jenkins.io
```

### Concourse - *Great*

We followed [Concourse's own guide to installing Concourse via a Helm chart](https://github.com/concourse/concourse-chart). Installation was seamless and it worked without issue.

```bash
helm repo add concourse https://concourse-charts.storage.googleapis.com/
helm install concourse concourse/concourse
```

### Tekton - *Good*

We followed [Tekton's Getting Started guide](https://tekton.dev/docs/getting-started/) to install Tekton via four kubectl commands that reference publicly available Kubernetes YAML files. It worked for us out of the box without tweaking anything and was ready within a minute or two.

Unlike Argo Workflows, Tekton required installation of four separate components for our use case: [pipelines](https://storage.googleapis.com/tekton-releases/pipeline/latest/release.yaml), [dashboard](https://storage.googleapis.com/tekton-releases/dashboard/latest/tekton-dashboard-release.yaml), [triggers](https://storage.googleapis.com/tekton-releases/triggers/latest/release.yaml) and [interceptors](https://storage.googleapis.com/tekton-releases/triggers/latest/interceptors.yaml). I'd guess that it'd be the exception to only want to install a subset of these four and perhaps the Getting Started experience could be improved by providing a single Kubernetes YAML containing all four.

```bash
export tekton_releases="https://storage.googleapis.com/tekton-releases"
kubectl apply --filename "${tekton_releases}/pipeline/latest/release.yaml"
kubectl apply --filename "${tekton_releases}/dashboard/latest/tekton-dashboard-release.yaml"
kubectl apply --filename "${tekton_releases}/triggers/latest/release.yaml"
kubectl apply --filename "${tekton_releases}/triggers/latest/interceptors.yaml"
```

### Argo Workflows - *Great*

We followed [Argo Workflows' own Quick Start instructions](https://argoproj.github.io/argo-workflows/quick-start/) to install Argo Workflows via a few kubectl commands that referenced [publicly available Kubernetes YAML files](https://raw.githubusercontent.com/argoproj/argo-workflows/stable/manifests/quick-start-postgres.yaml). It worked for us out of the box without tweaking anything and was ready within a minute or two.

```bash
export manifests="https://raw.githubusercontent.com/argoproj/argo-workflows/stable/manifests"
kubectl create namespace argo
kubectl apply --namespace argo --filename "${manifests}/quick-start-postgres.yaml
```

### Summary

The **easiest installation experience was with Concourse and Argo Workflows**, Tekton came in at a close second due to the additional context requirements of needing to install several components.

**Jenkins falls far behind** the other options here due to the fact that we wanted to keep configuration of the CI system entirely in code so we could version control it and modifying the configuration to install Jenkins plugins took us a while to get our heads around.


## 2. Run a "Hello, World" task

Now that we have a CI system, how difficult is it to run your first task? Here we'll demonstrate how difficult to was to write the task definition and then configure it in the CI system.

### Jenkins - *Poor*

Being the oldest of the CI systems under evaluation, it's not surprising that the way in which pipelines are written has been revisited a few times in its history. We wrote a "Hello World" job using the most modern pipeline syntax that Jenkins offers: [Declarative Pipelines](https://www.jenkins.io/doc/book/pipeline/syntax/).

Jenkins pipelines are configured in two ways: manually through the UI or by submitting declarative XML using the Jenkins CLI. We chose to use the latter so that we can source control our pipeline definitions.

The configuration references another file containing the bulk of the pipeline definition (often called a Jenkinsfile) which is written using the Declarative Pipelines DSL. There is a level of redundancy between these two files. It's also possible to change the configuration of the pipeline within the Jenkinsfile that would result in the XML stored in source control differing from the one actually configured on Jenkins after a pipeline run.

Although we could achieve source controlled pipeline configuration, there were two 'flies in the ointment'. Firstly, the XML file was extremely difficult to reason about and we found it easier to configure our pipeline via Jenkins' UI and then use the CLI's "get-job" subcommand to then store the generated configuration in source control. Secondly, the Jenkins CLI has separate "create-job" and "update-job" subcommands, which means any automation that sets pipelines has to figure out if it's already set to know which command to use.

Defining the "Hello World" pipeline using the Declarative Pipeline syntax was trivial, and it is also easy to read.Executing the task is trivial via the Jenkins UI.

```bash
# First deploy
java \
  -jar "$JENKINS_CLI_JAR" \
    -s "$JENKINS_URL" \
    -auth "${JENKINS_USERNAME}:${JENKINS_PASSWORD}" \
    create-job 'Hello World' \
  < pipeline.xml

# Subsequent deploys
java \
  -jar "$JENKINS_CLI_JAR" \
    -s "$JENKINS_URL" \
    -auth "${JENKINS_USERNAME}:${JENKINS_PASSWORD}" \
    update-job 'Hello World' \
  < pipeline.xml
```

*pipeline.Jenkinsfile*

```groovy
def ciImage = 'engineerbetter/iac-example-ci:15-promote'

pipeline {
  agent {
    kubernetes {
      yaml """
      apiVersion: v1
      kind: Pod
      spec:
        containers:
        - name: iac
        image: ${ciImage}
        command:
        - cat
        tty: true
      """.stripIndent()
      defaultContainer 'iac'
    }
  }

  stages {
    stage('Hello, World!') {
      steps {
        sh 'echo "Hello, World!"'
      }
    }
  }
}
```

*pipeline.xml*

```xml
<?xml version='1.1' encoding='UTF-8'?>
<flow-definition plugin="workflow-job@2.40">
  <actions>
    <org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobAction
    plugin="pipeline-model-definition@1.8.4"/>
    <org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobPropertyTrackerAction
    plugin="pipeline-model-definition@1.8.4">
      <jobProperties/>
      <triggers/>
      <parameters/>
      <options/>
    </org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobPropertyTrackerAction>
  </actions>
  <description></description>
  <keepDependencies>false</keepDependencies>
  <properties>
    <jenkins.model.BuildDiscarderProperty>
      <strategy class="hudson.tasks.LogRotator">
        <daysToKeep>-1</daysToKeep>
        <numToKeep>200</numToKeep>
        <artifactDaysToKeep>-1</artifactDaysToKeep>
        <artifactNumToKeep>-1</artifactNumToKeep>
      </strategy>
    </jenkins.model.BuildDiscarderProperty>
    <org.jenkinsci.plugins.workflow.job.properties.DisableConcurrentBuildsJobProperty/>
  </properties>
  <definition class="org.jenkinsci.plugins.workflow.cps.CpsScmFlowDefinition"
  plugin="workflow-cps@2.90">
    <scm class="hudson.plugins.git.GitSCM" plugin="git@4.7.1">
      <configVersion>2</configVersion>
      <userRemoteConfigs>
        <hudson.plugins.git.UserRemoteConfig>
          <url>my_repo_url</url>
          <credentialsId>git</credentialsId>
        </hudson.plugins.git.UserRemoteConfig>
      </userRemoteConfigs>
      <branches>
        <hudson.plugins.git.BranchSpec>
          <name>main</name>
        </hudson.plugins.git.BranchSpec>
      </branches>
      <doGenerateSubmoduleConfigurations>false</doGenerateSubmoduleConfigurations>
      <submoduleCfg class="empty-list"/>
      <extensions/>
    </scm>
    <scriptPath>pipeline.Jenkinsfile</scriptPath>
    <lightweight>true</lightweight>
  </definition>
  <triggers/>
  <disabled>false</disabled>
</flow-definition>
```


### Concourse - *Great*

Concourse has the best problem domain abstraction of the four systems under evaluation. [Pipelines](https://concourse-ci.org/pipelines.html) and [Tasks](https://concourse-ci.org/tasks.html) are configured by YAML, but unlike Tekton and Argo Workflows the YAML configuration is specifically for Tasks and Pipelines and is not tied to the platform it happens to be deployed to - which makes sense since Concourse existed before Kubernetes was popular.

Task definitions are not 'applied' to Concourse, instead Concourse pipelines will look for them at runtime based on the pipeline configuration. That being said, Tasks can be executed directly from Concourse's CLI, "[fly](https://concourse-ci.org/fly.html)" (which can be downloaded from the UI of your Concourse).

Since Concourse is not Kubernetes native, there's a step required in order to authenticate with Concourse the first time you interact with it. You can authenticate using your GitHub account, amongst other options.

```bash
fly --target ci login --concourse-url "$CONCOURSE_URL"
fly --target ci execute --config hello.yaml
```

```yaml
platform: linux
image_resource:
  type: registry-image
  source: {repository: busybox}
run:
  path: echo
  args: ["Hello, World!"]
```

### Tekton - *Great*

Everything about Tekton is Kubernetes native, so it follows that defining a [Tekton Task](https://tekton.dev/docs/pipelines/) is as simple as creating an appropriate Kubernetes YAML file and applying it. Tekton stores defined Tasks as Kubernetes resources and executes them by applying another resource known as a TaskRun. Since it's all Kubernetes native, source controlling these tasks is easily achievable but it also means there's a bit of boilerplate since the abstraction over Kubernetes is (deliberately) pretty shallow.

Likewise, Tekton Pipelines are a Kubernetes resource that represents a sequence of Tasks to be executed. PipelineRuns are the resources that execute Pipelines.

Tasks and Pipelines may also be executed by the Tekton CLI (which proxies authentication via the active kubeconfig) rather than defining and applying a TaskRun or PipelineRun.

```bash
kubectl apply --filename hello-task.yaml
tkn task start hello-world-task
tkn taskrun logs --last --follow
```

```yaml
apiVersion: tekton.dev/v1beta1
kind: Task
metadata: {name: hello-world-task}
spec:
  steps:
  - name: hello-world
  image: docker/whalesay
command: [echo, "Hello, World!"]
```

### Argo Workflows - *Great*

As with Tekton, resources in Argo Workflows are simply shallow abstractions over Kubernetes resources. Kubernetes YAML is used to define [Argo Workflows' Templates](https://argoproj.github.io/argo-workflows/workflow-templates/). Templates are then composed into Workflows using another Kind of Kubernetes resource containing a Directed Acrylic Graph (DAG) syntax when there's more than one template. The Workflows are then executed using the Argo Workflows CLI.

Unlike Tekton Tasks and Pipelines, WorkflowTemplates cannot be executed outside the context of a Workflow; the amount of configuration required to execute the Hello World template is still trivial.

```bash
argo --namespace argo submit hello-workflow.yaml --watch
argo --namespace argo logs @latest
```

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata: {generateName: hello-workflow-}
spec:
  entryPoint: hello
  templates:
  - name: hello
  container:
    image: busybox
    command: [echo, hello]
```

### Summary

Getting started with Concourse, Tekton and Argo required very little effort; each required at most 10 lines of YAML and a few commands to execute. Looking at the output of each was similarly trivial.

Both Jenkins and Argo Workflows required the execution of a pipeline (or Workflow) in order to execute a single task. This didn't add to the complexity in the case of Argo Workflows, however executing Hello World on Jenkins required orders of magnitude more configuration than the other options and contained a gotcha.

Jenkins again fell far behind the competition in this use case with the differences between the Concourse, Tekton and Argo Workflows being negligible.

## Next time

In the next blog in this series we'll explore the following three use cases described above:

- *Trigger pipeline runs when external resources (such as Git commits or uploads to a S3 bucket) change*
- *Use inputs and outputs to tasks*
- *Write outputs externally (like making a Git commit or pushing a file to S3)*

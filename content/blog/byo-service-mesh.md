---
author: Andy Paine
date: "2020-08-10"
heroImage: /img/blog/cf-and-consul.png
title:  BYO Service Mesh to Cloud Foundry
draft: true

heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

Cloud Foundry has [toyed around](https://docs.cloudfoundry.org/adminguide/service-mesh.html) with the idea of providing service mesh capabilities to end users for a while. As CF transitions to a Kubernetes based runtime, it looks like operators will soon be able to bring the full power of Istio & friends to their developers. But what if **you aren't an operator** and you want all those features _today_?

Enter [Hashicorp Consul](https://www.consul.io/). Consul offers service networking features such as health checking and service discovery whilst also bringing all the service mesh goodness of zero-trust networks, weighted traffic routing and circuit breaking. The best thing about it? **You can use these features on (almost) any Cloud Foundry deployment as an end-user**.

Through some clever usage of [container-to-container networking](https://docs.cloudfoundry.org/concepts/understand-cf-networking.html), [sidecars](https://docs.cloudfoundry.org/devguide/sidecars.html) and a little bit of [metadata](https://docs.cloudfoundry.org/adminguide/metadata.html) magic, you can deploy Consul and the service mesh sidecars to any application.

<section class="boxout">
<p>There is a <a target="_blank" href="https://github.com/EngineerBetter/byo-service-mesh/tree/blog-post">Github repo</a> containing all the code required to get started.</p>
</section>

## Container-to-container networking
Consul requires a control plane made up of Consul agents running in "server" mode and, optionally, a UI. It is recommended that you run a minimum of 3 instances for high availability which then communicate to form quorum and elect a leader. For this consensus algorithm to work, each instance needs to be able to **uniquely address other instances** and be allowed to communicate using **TCP and UDP**.

We can do this in Cloud Foundry by using [internal routes](https://docs.cloudfoundry.org/devguide/deploy-apps/routes-domains.html#internal-routes) as well as [container-to-container networking](https://docs.cloudfoundry.org/concepts/understand-cf-networking.html).

### Internal routes
There is a special domain name in Cloud Foundry reserved for applications within the platform - `apps.internal`. Applications can be mapped to a route such as `consul-server.apps.internal` which all other applications on the platform can use to resolve the IP address of the containers running the `consul-server` application. Individual instances can also be queried by prepending the instance index before the domain - e.g. `1.consul-server.apps.internal`. This allows applications on the platform to **uniquely address other instances** which ticks our first box.

### Container-to-container networking
Normally in Cloud Foundry, applications talk HTTP via the Gorouter which provides all the TLS and layer 7 routing goodness we've come to know at love. However, applications running within the same platform can communicate across the platform networking using any protocol required. Access between applications is denied by default but can be modified by [adding network policies](https://docs.cloudfoundry.org/devguide/deploy-apps/cf-networking.html#create-policies) to permit traffic on certain port ranges and protocols. By creating network policies between instances of the `consul-server` application, we can allow both **TCP and UDP** traffic for the relevant port ranges.

## Sidecars
Once the Consul control plane is up and running, you need some applications to register into a service mesh. This is done in Consul by running a couple of other processes on the application instance:
- Consul agent - registers with control plane and provides configuration
- Proxy - configured by Consul agent. Controls access, routes traffic and performs mTLS communication with rest of service mesh

Cloud Foundry has first class support for running these processes - [sidecars](https://docs.cloudfoundry.org/devguide/sidecars.html). These processes are started within the same container as the `process_types` to which they are bound and are monitored using the `process` health check type the same way the main application is.

> These sidecars could even be seamlessly included via a sidecar-buildpack

By creating Consul services to represent each application, the sidecar proxies can be configured with all dependent services as upstreams. This allows an application to **access other applications as if they were local** with the proxy looking after service discovery as well as connecting to the upstream service over mutual TLS.

## Metadata
Most objects in Cloud Foundry (e.g. apps, spaces, orgs) can have [metadata](https://docs.cloudfoundry.org/adminguide/metadata.html) associated with them. This combination of annotations and labels can be used for attaching useful information such as commit hashes or environment.

By labelling all the applications inside our [service mesh](https://github.com/EngineerBetter/byo-service-mesh/blob/blog-post/manifest.yml#L25-L27), not only can we quickly see and query all applications that belong in the mesh but we can also use that information to ensure that networking is properly configured. [The included script](https://github.com/EngineerBetter/byo-service-mesh/blob/blog-post/network-policies.rb) checks all applications that are labelled this way and ensures that they may communicate freely with each other across ports 8000-9000 and both TCP and UDP.

## Putting it all together
To demonstrate all this working together, we can use [HotROD](https://github.com/jaegertracing/jaeger/tree/master/examples/hotrod) - a set of example microservices usually used to demonstrate Jaeger's distributed tracing. HotROD is comprised of 4 applications:

- frontend (requires access to customer, driver & route)
- customer
- driver
- route

Normally these would all be **run on a single host** - as shown by the fact that the address used for the other services is [hard coded!](https://github.com/jaegertracing/jaeger/blob/85d01426d33c77ebb909a5a224c3bdbb89eb94e8/examples/hotrod/cmd/frontend.go#L37-L40). However, by deploying each service as a separate Cloud Foundry app integrated into a Consul service mesh, we can work around this!

The customer, driver and route services can all be registered as [upstreams](https://github.com/EngineerBetter/byo-service-mesh/blob/b400ab10e8302a4d13666598227ad94485f8eae1/consul.d/hotrod-frontend/service.json#L8-L21) for the frontend service, making them appear as if they are running on the same host as the frontend. With Consul instead proxying all the requests to the backend services to their respective sidecars over mTLS, the microservices **can continue to communicate, even when deployed on different hosts**.

<figure>
  <img src="/img/blog/consul-dashboard.png" class="fit image">
  <figcaption>Consul dashboard showing all HotROD services registered with connected proxies</figcaption>
</figure>

### Benefits

Whilst this is a pretty neat trick, the real benefits of Consul come now that the applications are embedded into the service mesh. Consul can accept configuration to modify how the service mesh communicates, using the same infrastructure-as-code approach that Hashicorp offers with [Terraform](https://www.terraform.io/). These options include:

### Access control
Consul has a concept called [intentions](https://www.consul.io/docs/connect/intentions) that can be used to block access between specific application instances. These can be quickly applied and removed without having to restart applications thanks to the Consul agents constantly checking whether requests are permitted.

### Layer 7 traffic management
Whether it is canary deployments or A/B testing, being able to fine tune how traffic is routed to applications is a handy tool to have. Consul has a number of layer 7 [traffic management](https://www.consul.io/docs/connect/l7-traffic-management) features that make new ways of deploying and running applications possible.

### Observability
When using container-to-container networking, requests no longer pass through the gorouter meaning we lose all metrics derived from gorouter data. Consul proxies can be centrally configured to emit metrics in a number of different ways providing extremely fine grained data even for application-to-application communication.

## Conclusion
Deploying a service mesh on top of any Cloud Foundry (this was all done on Pivotal Web Services!) shows the power of some of the new features of Cloud Foundry and demonstrates how flexible a platform it is. There is a lot more to do before this is production ready including security, automated metrics and configurable buildpacks but hopefully this serves as some food for thought about what is possible on Cloud Foundry.
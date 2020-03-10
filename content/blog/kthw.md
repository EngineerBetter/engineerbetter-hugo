---
author: Daniel Jones and Jonathan Matthews
date: "2019-09-25"
heroImage: /img/blog/packing-robot.jpg
title:  "kthw"
heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

At EngineerBetter, we're going through the formality of ensuring that we've got the Certified Kubernetes Administrator qualification box ticked. Kelsey Hightower's [Kubernetes The Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way) is a valuable guide to setting up a Kubes cluster 'by hand', and so I set about running through it.

Despite spending my time primarily running the business, I figured I should ensure that I can 'walk the walk' too.

All was going smoothly (well, after I realised that I'd screwed up the `kubeconfig` for `kube-proxy`, but that's another story). By the end of the walkthrough I had three controller VMs running the `api-server`, `etcd` and `scheduler`, and three workers running `kubelet` and `kube-proxy`. The guide invites you to deploy an NGiNX instance, and hook up a NodePort service to it.

A friend was asking how DNS works with regards to Services in Kubes, so I thought I'd run through a quick demo. Spin up a pod, `curl` my NGiNX service by name, and demonstrate that resolving to the right place. Simple, right?

I had the NGiNX pod and service running:

```terminal
$ k get pods,services
NAME                         READY   STATUS    RESTARTS   AGE
pod/busybox                  1/1     Running   50         35d
pod/nginx-554b9c67f9-7447p   1/1     Running   7          35d

NAME                 TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE
service/kubernetes   ClusterIP   10.32.0.1     <none>        443/TCP        35d
service/nginx        NodePort    10.32.0.23    <none>        80:32359/TCP   35d
```

I created a throwaway test pod, based on an image we regularly use for debugging and CI:

```terminal
k run test --image engineerbetter/pcf-ops --restart=Never -it --rm  -- /bin/bash
```

As expected, the image was pulled, the pod started, and my terminal session was attached to a freshly-spawned `bash` process inside. All that remained was to make an HTTP request from my machine to the NGiNX service running inside the cluster.

```terminal
root@test:/# curl nginx
curl: (6) Could not resolve host: nginx
```

This is not what I expected, but sure, let's debug it! From this point on, Jonathan and I decided to go down the rabbit hole together.

The `curl` invocation was taking a while to fail:

```terminal
root@test:/# time curl nginx
curl: (6) Could not resolve host: nginx

real	0m10.530s
user	0m0.005s
sys	0m0.006s
```

Timeout? That normally suggests that a firewall is dropping packets somewhere.

Let's try resolving the service domain using `nslookup`:

```terminal
root@test:/# nslookup nginx
Server:  10.32.0.10
Address: 10.32.0.10#53

Name: nginx.default.svc.cluster.local
Address: 10.32.0.23
;; reply from unexpected source: 10.200.2.32#53, expected 10.32.0.10#53
```

Okay, that's odd. That seems to have both found the answer _and_ failed with an error message. Let's try again:

```terminal
root@test:/# nslookup nginx
;; reply from unexpected source: 10.200.2.32#53, expected 10.32.0.10#53
```

Oh dear. That's failed completely this time, despite us having changed nothing.

Okay, let's try looking up a _real_ domain:

```terminal
root@test:/# nslookup engineerbetter.com
Server:  10.32.0.10
Address: 10.32.0.10#53

** server can't find engineerbetter.com.c.dj-kthw3.internal: SERVFAIL
```

Umm... That seems to be a completely different error. If the DNS server can't find the domain, then we _must_ have been able to communicate with the DNS server correctly - which is a different problem entirely.

Was _this_ issue also intermittent?

```terminal
root@test:/# nslookup engineerbetter.com
;; reply from unexpected source: 10.200.2.32#53, expected 10.32.0.10#53
```

Yep. We're back to the first error message again.

Looks like we have two problems:

1. DNS lookups for 'real' external domains are failing to resolve
1. DNS lookups are intermittently failing, because responses are coming from an unexpected IP

The first issue is way less weird than the second, so we decided to tackle the simpler issue initially.

## Issue 1 - External Resolution

So when we _can_ talk to a DNS server, we're still getting error messages when looking up external domains:

```terminal
root@test:/# nslookup engineerbetter.com
Server:  10.32.0.10
Address: 10.32.0.10#53

** server can't find engineerbetter.com.c.dj-kthw3.internal: SERVFAIL
```

It looks like for whatever reason, it was trying to resolve `engineerbetter.com.c.dj-kthw3.internal` rather than just `engineerbetter.com`.

Where to look first? We checked `etc/resolv.conf`:

```terminal
root@test:/# cat /etc/resolv.conf
search default.svc.cluster.local svc.cluster.local cluster.local c.dj-kthw3.internal google.internal
nameserver 10.32.0.10
options ndots:5
```

This looks fairly sensible - that `nameserver` directive is pointing to an IP on the services subnet. A cursory check with `kubectl` confirms that yes, 10.32.0.10 _is_ the Cluster IP of the CoreDNS service:

```terminal
$ k get pods,services -owide -n kube-system
NAME                           READY   STATUS    RESTARTS   AGE   IP            NODE
pod/coredns-656bc64dd7-bpz87   1/1     Running   3          29d   10.200.2.32   worker-2
pod/coredns-656bc64dd7-f4b8b   1/1     Running   4          29d   10.200.1.41   worker-1

NAME               TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)                  AGE   SELECTOR
service/kube-dns   ClusterIP   10.32.0.10   <none>        53/UDP,53/TCP,9153/TCP   35d   k8s-app=kube-dns
```

What does `options ndots:5` do? This isn't something I'd seen outside of Kubesland, and we found [a great blog post about the ndots option in the context of Kubes DNS resolution](https://pracucci.com/kubernetes-dns-resolution-ndots-options-and-why-it-may-affect-application-performances.html). After reading the afore-linked post, it was clear that this tells the resolver to _first_ try iterating through all the local search domains if the name we're looking for has fewer than 5 dots in it. Interesting, but probably not relevant here.

By looking in `resolv.conf` we'd ruled out any config pointing us towards nameservers _other_ than the in-cluster [CoreDNS, which _Kubernetes The Hard Way_ has you install](https://github.com/kelseyhightower/kubernetes-the-hard-way/blob/master/deployments/coredns.yaml). Off we went to review the logs in the two CoreDNS pods:

```terminal
[ERROR] plugin/errors: 2 nginx. A: plugin/loop: no next plugin found
```

Does _Kubernetes The Hard Way_ ever actually tell CoreDNS how to resolve external domains? It's not something in the critical path of the guide, so perhaps not?

In the YAML file pinned in the repo there's [a ConfigMap that defines the CoreDNS configuration](https://github.com/kelseyhightower/kubernetes-the-hard-way/blob/master/deployments/coredns.yaml#L48-L68).

There's nothing in that ConfigMap that tells CoreDNS about any outside DNS servers, so it looks like we'll have to add something. Reading The F...riendly [(CoreDNS) Manual](https://coredns.io/plugins/forward/) yielded that we needed a simple one-liner to enable query forwarding. So, we edited the ConfigMap in-situ:

```terminal
apiVersion: v1
data:
  Corefile: |
    .:53 {
        errors
        health
        ready
        kubernetes cluster.local in-addr.arpa ip6.arpa {
          pods insecure
          fallthrough in-addr.arpa ip6.arpa
        }
        prometheus :9153
        cache 31
        forward . 169.254.169.254
        loop
        reload
        loadbalance
    }
kind: ConfigMap
...
```

We were already using `watch` to test external resolution by running `nslookup engineerbetter.com` every two seconds. Whilst I was busy trying to remember how to get Deployments to pick up ConfigMap changes, the command started succeeding. _Note to self:_ CoreDNS handles reloading of ConfigMaps by itself.

One problem down, one to go!

## Issue 2 - Reply from Unexpected Source

With one issue resolved, let's revisit the other error messages we were getting.

In the first case, we saw:

```terminal
root@test:/# nslookup nginx
Server:  10.32.0.10
Address: 10.32.0.10#53

Name: nginx.default.svc.cluster.local
Address: 10.32.0.23
;; reply from unexpected source: 10.200.2.32#53, expected 10.32.0.10#53
```

This showed that some requests worked, and others failed. Unless we were particularly unlucky with cosmic rays flipping bits, this intermittent behaviour was likely down to some non-deterministic round-robin type behaviour. We noted earlier that there were two CoreDNS pods; maybe one was malfunctioning? We checked the CoreDNS logs, and nothing was obvious.

We decided to check what things were using the expected and unexpected IP addresses from the prior error message:

```terminal
$ k get pods,services -owide -n kube-system
NAME                           READY   STATUS    RESTARTS   AGE   IP            NODE
pod/coredns-656bc64dd7-bpz87   1/1     Running   3          29d   10.200.2.32   worker-2
pod/coredns-656bc64dd7-f4b8b   1/1     Running   4          29d   10.200.1.41   worker-1

NAME               TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)                  AGE   SELECTOR
service/kube-dns   ClusterIP   10.32.0.10   <none>        53/UDP,53/TCP,9153/TCP   35d   k8s-app=kube-dns
```

You can see from the above that our test was expecting to hear back from the CoreDNS service's Cluster IP, but was actually getting responses from a pod IP.

We ran the test a few more times and noticed that, when running tests from this one pod, we only saw error messages specifying that **the response had come from the CoreDNS pod on the same worker**.

To prove that pod/worker locality was an issue, we stood up three pairs of pods - in each pair was one NGiNX pod, and one of our debug image. Each pair was then naively scheduled to a specific worker via `spec.nodeName`. We also created a Cluster IP service exposing each NGiNX pod.

```terminal
$ kubectl get pods,services -owide
NAME                          READY   STATUS    RESTARTS   AGE     IP            NODE
pod/nginx0-7b45774556-tqfnl   1/1     Running   0          2m16s   10.200.0.49   worker-0
pod/nginx1-647f775685-2blwx   1/1     Running   0          2m11s   10.200.1.42   worker-1
pod/nginx2-7dddf444fd-5lxmw   1/1     Running   0          2m8s    10.200.2.65   worker-2
pod/tmp0                      1/1     Running   0          15s     10.200.0.50   worker-0
pod/tmp1                      1/1     Running   0          13s     10.200.1.43   worker-1
pod/tmp2                      1/1     Running   0          11s     10.200.2.63   worker-2

NAME                 TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE     SELECTOR
service/kubernetes   ClusterIP   10.32.0.1     <none>        443/TCP        35d     <none>
service/nginx0       NodePort    10.32.0.100   <none>        80:32100/TCP   2m16s   app=nginx0
service/nginx1       NodePort    10.32.0.101   <none>        80:32101/TCP   2m11s   app=nginx1
service/nginx2       NodePort    10.32.0.102   <none>        80:32102/TCP   2m8s    app=nginx2
```

We decided to test further by making HTTP requests to:

* Pod IP on a different worker
* Cluster IP that is backed by a pod on a different worker
* Pod IP on the same worker
* Cluster IP that is backed by a pod on a different worker

Hitting the pod IP and cluster IP both succeeded when the target pod was on a different worker: we got the NGiNX default index page as expected.

Hitting the pod IP succeeded when the target pod was on the same worker: again, we got the expected HTTP response.

Hitting the cluster IP when the target pod was on the same worker _failed_: instead of a HTTP response, **we got a timeout**.

| Worker | Pod IP | Cluster IP |
|---|:-:|:-:|
| Different | 	&#x2714; | 	&#x2714; |
| Same | 	&#x2714; | 	&#x2718; |

<br />

The timeout thing is a bit odd. We'd hadn't configured a single `NetworkPolicy`, so there's no reason that we'd expect packets to be dropped. `netcat` also reported timeouts. What exactly was going on?

As with all good network debugging stories, we ended up resorting to running `tcpdump` on the affected worker. Here `-nn` prevents reverse-lookup of IP to hostname, `-i any` specifies that we want to examine all interfaces:

```terminal
root@worker-2:~# tcpdump -i any -nn port 80
tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on any, link-type LINUX_SLL (Linux cooked), capture size 262144 bytes
18:02:52.563172 IP 10.200.2.63.58096 > 10.32.0.102.80: Flags [S], seq 2511416864, win 64240, options [mss 1460,sackOK,TS val 2349838492 ecr 0,nop,wscale 7], length 0
18:02:52.563172 IP 10.200.2.63.58096 > 10.32.0.102.80: Flags [S], seq 2511416864, win 64240, options [mss 1460,sackOK,TS val 2349838492 ecr 0,nop,wscale 7], length 0
18:02:52.563237 IP 10.200.2.63.58096 > 10.200.2.65.80: Flags [S], seq 2511416864, win 64240, options [mss 1460,sackOK,TS val 2349838492 ecr 0,nop,wscale 7], length 0
18:02:52.563240 IP 10.200.2.63.58096 > 10.200.2.65.80: Flags [S], seq 2511416864, win 64240, options [mss 1460,sackOK,TS val 2349838492 ecr 0,nop,wscale 7], length 0
18:02:52.563257 IP 10.200.2.65.80 > 10.200.2.63.58096: Flags [S.], seq 1225769056, ack 2511416865, win 65160, options [mss 1460,sackOK,TS val 2003052615 ecr 2349838492,nop,wscale 7], length 0
18:02:52.563260 IP 10.200.2.65.80 > 10.200.2.63.58096: Flags [S.], seq 1225769056, ack 2511416865, win 65160, options [mss 1460,sackOK,TS val 2003052615 ecr 2349838492,nop,wscale 7], length 0
18:02:52.563269 IP 10.200.2.63.58096 > 10.200.2.65.80: Flags [R], seq 2511416865, win 0, length 0
```

* In the first two lines we can see two identical entries, made in the same nanosecond, where a syn packet is sent from our debug pod's IP to the NGiNX service's Cluster IP. Why _two_?
* We then see another two lines, this time a few nanoseconds apart, which are going from our debug pod IP to the _target_ pod's IP. How did this happen? How did we go from Cluster IP to Pod IP? What part of the system knows about that mapping?
* Next are two acknowledgement packets (`S.`) coming from the target Pod IP back to our debug Pod IP.
* Finally, we see a reset being sent from our debug pod to the target pod directly, presumably because `curl` has no idea why it's getting replies from the wrong IP address.

There were a few quetions raised above - first and foremost, why are we seeing packets logged twice? The first two lines are logged in the same nanosecond, and they all have the same sequence ID until the ack, so its effectively the same packet being routed through different places.

We performed another `tcpdump`, this time with the `-e` flag that prints link-layer headers, so that we can see the MAC address of each interface through which the packet is logged:

```terminal
root@worker-2:~# tcpdump -nn -e -i any port 80
tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on any, link-type LINUX_SLL (Linux cooked), capture size 262144 bytes
18:05:28.708256   P 9e:d4:7d:ec:b7:6d ethertype IPv4 (0x0800), length 76: 10.200.2.63.58488 > 10.32.0.102.80: Flags [S], seq 2308927167, win 64240, options [mss 1460,sackOK,TS val 2349994637 ecr 0,nop,wscale 7], length 0
18:05:28.708256  In 9e:d4:7d:ec:b7:6d ethertype IPv4 (0x0800), length 76: 10.200.2.63.58488 > 10.32.0.102.80: Flags [S], seq 2308927167, win 64240, options [mss 1460,sackOK,TS val 2349994637 ecr 0,nop,wscale 7], length 0
18:05:28.708319 Out 12:e9:35:7a:5b:02 ethertype IPv4 (0x0800), length 76: 10.200.2.63.58488 > 10.200.2.65.80: Flags [S], seq 2308927167, win 64240, options [mss 1460,sackOK,TS val 2349994637 ecr 0,nop,wscale 7], length 0
18:05:28.708323 Out 12:e9:35:7a:5b:02 ethertype IPv4 (0x0800), length 76: 10.200.2.63.58488 > 10.200.2.65.80: Flags [S], seq 2308927167, win 64240, options [mss 1460,sackOK,TS val 2349994637 ecr 0,nop,wscale 7], length 0
18:05:28.708343   P fa:ce:1c:2d:05:eb ethertype IPv4 (0x0800), length 76: 10.200.2.65.80 > 10.200.2.63.58488: Flags [S.], seq 3216518151, ack 2308927168, win 65160, options [mss 1460,sackOK,TS val 2003208761 ecr 2349994637,nop,wscale 7], length 0
18:05:28.708345 Out fa:ce:1c:2d:05:eb ethertype IPv4 (0x0800), length 76: 10.200.2.65.80 > 10.200.2.63.58488: Flags [S.], seq 3216518151, ack 2308927168, win 65160, options [mss 1460,sackOK,TS val 2003208761 ecr 2349994637,nop,wscale 7], length 0
18:05:28.708354   P 9e:d4:7d:ec:b7:6d ethertype IPv4 (0x0800), length 56: 10.200.2.63.58488 > 10.200.2.65.80: Flags [R], seq 2308927168, win 0, length 0
```

Now we've got MAC addresses logged, we need to find out which interfaces these MAC addresses belong to, using `ip a s`.

First, on the worker in the root namespace:

```terminal
root@worker-2:~# ip a s
[SNIP!]
3: cnio0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether 12:e9:35:7a:5b:02 brd ff:ff:ff:ff:ff:ff
    inet 10.200.2.1/24 brd 10.200.2.255 scope global cnio0
```

Next, we need to find the MAC addresses of the interfaces in each pod. We can't currently see those in our session on the worker, as they're in separate network namespaces.

We used our interactive session to get the MAC address of the debug pod:

```terminal
root@tmp2:/# ip a s
[SNIP!]
3: eth0@if6: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default
    link/ether 9e:d4:7d:ec:b7:6d brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet 10.200.2.41/24 brd 10.200.2.255 scope global eth0
```

Next we needed to get the MAC address of the NGiNX pod that we were trying to hit.

The NGiNX image is pragmatically minimal, meaning that the `ip` command isn't available there. Thankfully we can use `nsenter` to run a command from our root worker session, and execute it in the context of another process' namespace. First we need to get the NGiNX PID, and then we can run a command in its network namespace:

```terminal
root@worker-2:~# ps aux | grep "[n]ginx: master"
root      2595  0.0  0.0  10628  5280 ?        Ss   10:44   0:00 nginx: master process nginx -g daemon off;
root@worker-2:~# nsenter -t 2595 -n -- ip a s
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
[SNIP!]
3: eth0@if4: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default
    link/ether fa:ce:1c:2d:05:eb brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet 10.200.2.51/24 brd 10.200.2.255 scope global eth0
```

Here's the `tcpdump` output with MAC addresses substituted for readability's sake:

```terminal
root@worker-2:~# tcpdump -nn -e -i any port 80
tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on any, link-type LINUX_SLL (Linux cooked), capture size 262144 bytes
18:05:28.708256   P DEBUG_INTERFACE ethertype IPv4 (0x0800), length 76: 10.200.2.41.58488 > 10.32.0.117.80: Flags [S], seq 2308927167, win 64240, options [mss 1460,sackOK,TS val 2349994637 ecr 0,nop,wscale 7], length 0
18:05:28.708256  In DEBUG_INTERFACE ethertype IPv4 (0x0800), length 76: 10.200.2.41.58488 > 10.32.0.117.80: Flags [S], seq 2308927167, win 64240, options [mss 1460,sackOK,TS val 2349994637 ecr 0,nop,wscale 7], length 0
18:05:28.708319 Out BRIDGE_INTERFACE ethertype IPv4 (0x0800), length 76: 10.200.2.41.58488 > 10.200.2.51.80: Flags [S], seq 2308927167, win 64240, options [mss 1460,sackOK,TS val 2349994637 ecr 0,nop,wscale 7], length 0
18:05:28.708323 Out BRIDGE_INTERFACE ethertype IPv4 (0x0800), length 76: 10.200.2.41.58488 > 10.200.2.51.80: Flags [S], seq 2308927167, win 64240, options [mss 1460,sackOK,TS val 2349994637 ecr 0,nop,wscale 7], length 0
18:05:28.708343   P NGINX_INTERFACE ethertype IPv4 (0x0800), length 76: 10.200.2.51.80 > 10.200.2.41.58488: Flags [S.], seq 3216518151, ack 2308927168, win 65160, options [mss 1460,sackOK,TS val 2003208761 ecr 2349994637,nop,wscale 7], length 0
18:05:28.708345 Out NGINX_INTERFACE ethertype IPv4 (0x0800), length 76: 10.200.2.51.80 > 10.200.2.41.58488: Flags [S.], seq 3216518151, ack 2308927168, win 65160, options [mss 1460,sackOK,TS val 2003208761 ecr 2349994637,nop,wscale 7], length 0
18:05:28.708354   P DEBUG_INTERFACE ethertype IPv4 (0x0800), length 56: 10.200.2.41.58488 > 10.200.2.51.80: Flags [R], seq 2308927168, win 0, length 0
```

We can see that:

* the first packet is logged twice on the debug pod's interface. The `P` in the second column suggest that this is because the interface is in promiscuous mode, but it is not - that would only happen if we ran `tcpdump` with the `-i` flag giving a _specific_ interface, and we ran it in a mode that looks at all of them.
* the packet passed from the debug pod interface to the `cnio0` bridge interface, by which time its destination has been translated to the target Pod IP
* the target pod's interface responds (again, double-logging because of alleged promiscuity) directly to the debug pod, without going via the bridge

Cluster IPs aren't 'real', and instead they appear only in the `iptables` rules that `kube-proxy` configures on each worker.

If we want to have any chance of understanding what's going on here, we're going to need to dig into `iptables`.

### iptables

`iptables` is an interface for `netfilter`, which does all sorts of clever packet-manipulation stuff in Linux. It's the mechanism via which Kubernetes creates Cluster IPs, and is also used by Envoy, and by Cloud Foundry's Diego in order to implement security groups.

There are four types of table:

1. filter
1. nat
1. mangle
1. raw

Using `iptables -L -t <table>`, we could see that there wasn't anything of interest in the `mangle` or `raw` tables. There's some Kubernetes-related stuff in the `filter` table, but we'll leave it out of this blog post as it's not relevant.

_The default output format of `iptables` really sucks at lining up columns. You can pipe it into `columns -t` which makes things a bit better, but screws up the headings instead._

```terminal
root@worker-2:~# iptables -L

Chain PREROUTING (policy ACCEPT)
target         prot  opt  source    destination
KUBE-SERVICES  all   --   anywhere  anywhere      /* kubernetes service portals */

Chain INPUT (policy ACCEPT)
target                        prot  opt  source  destination

Chain OUTPUT (policy ACCEPT)
target                        prot  opt  source    destination
KUBE-SERVICES                 all   --   anywhere  anywhere     /* kubernetes service portals */

Chain POSTROUTING (policy ACCEPT)
target                        prot  opt  source       destination
KUBE-POSTROUTING              all   --   anywhere     anywhere     /* kubernetes postrouting  rules */
CNI-da656fe7e5c60b5739af5199  all   --   10.200.0.46  anywhere     /* name: "bridge" id: "ce3eff85633b118bc8f30c110e9f13bac556df11c6af5730198f149ad03d82bf" */
CNI-e6f8915306a0d2afb9322e15  all   --   10.200.0.50  anywhere     /* name: "bridge" id: "96f6dad29592b1f29be6cb220e81375a480d6ca5a0e000d5d5abbb9f8a8eeffd" */
CNI-a4fadfa1c00fc0d5a8c5612e  all   --   10.200.0.52  anywhere     /* name: "bridge" id: "5441e2c226a60f7fc101700f0d74a08545cb6dd0f98da19f1b6e211e06cee827" */

Chain CNI-a4fadfa1c00fc0d5a8c5612e (1 references)
target      prot  opt  source    destination
ACCEPT      all   --   anywhere  10.200.0.0/24              /* name: "bridge" id: "5441e2c226a60f7fc101700f0d74a08545cb6dd0f98da19f1b6e211e06cee827" */
MASQUERADE  all   --   anywhere  !base-address.mcast.net/4  /* name: "bridge" id: "5441e2c226a60f7fc101700f0d74a08545cb6dd0f98da19f1b6e211e06cee827" */

Chain CNI-da656fe7e5c60b5739af5199 (1 references)
target      prot  opt  source    destination
ACCEPT      all   --   anywhere  10.200.0.0/24              /* name: "bridge" id: "ce3eff85633b118bc8f30c110e9f13bac556df11c6af5730198f149ad03d82bf" */
MASQUERADE  all   --   anywhere  !base-address.mcast.net/4  /* name: "bridge" id: "ce3eff85633b118bc8f30c110e9f13bac556df11c6af5730198f149ad03d82bf" */

Chain CNI-e6f8915306a0d2afb9322e15 (1 references)
target      prot  opt  source    destination
ACCEPT      all   --   anywhere  10.200.0.0/24              /* name: "bridge" id: "96f6dad29592b1f29be6cb220e81375a480d6ca5a0e000d5d5abbb9f8a8eeffd" */
MASQUERADE  all   --   anywhere  !base-address.mcast.net/4  /* name: "bridge" id: "96f6dad29592b1f29be6cb220e81375a480d6ca5a0e000d5d5abbb9f8a8eeffd" */

Chain KUBE-MARK-DROP (0 references)
target  prot  opt  source    destination
MARK    all   --   anywhere  anywhere     MARK or 0x8000

Chain KUBE-MARK-MASQ (2 references)
target  prot  opt  source    destination
MARK    all   --   anywhere  anywhere     MARK or 0x4000

Chain KUBE-NODEPORTS (1 references)
target                        prot   opt      source    destination
KUBE-MARK-MASQ                tcp    --       anywhere  anywhere     /* default/nginx1: */ tcp dpt:32101
KUBE-SVC-253L2MOZ6TC5FE7P     tcp    --       anywhere  anywhere     /* default/nginx1: */ tcp dpt:32101
KUBE-MARK-MASQ                tcp    --       anywhere  anywhere     /* default/nginx2: */ tcp dpt:32102
KUBE-SVC-KN7BHMGRB3FSVEMI     tcp    --       anywhere  anywhere     /* default/nginx2: */ tcp dpt:32102
KUBE-MARK-MASQ                tcp    --       anywhere  anywhere     /* default/nginx0: */ tcp dpt:32100
KUBE-SVC-SJ5YE6C53UPXD73I     tcp    --       anywhere  anywhere     /* default/nginx0: */ tcp dpt:32100

Chain KUBE-POSTROUTING (1 references)
target      prot  opt  source    destination
MASQUERADE  all   --   anywhere  anywhere     /* kubernetes service traffic requiring SNAT */ mark match 0x4000/0x4000

Chain KUBE-SEP-3MQ7LGWSED2GAEFA (1 references)
target          prot  opt      source                            destination
KUBE-MARK-MASQ  all   --       10.200.2.65                       anywhere
DNAT            tcp   --       anywhere                          anywhere tcp to:10.200.2.65:80

Chain KUBE-SEP-4QSDQJ2XGBM3KIR7 (1 references)
target          prot  opt  source       destination
KUBE-MARK-MASQ  all   --   10.200.0.52  anywhere
DNAT            tcp   --   anywhere     anywhere tcp to:10.200.0.52:80

Chain KUBE-SEP-B5QGFRIIAVJ4SUMQ (1 references)
target          prot  opt      source                            destination
KUBE-MARK-MASQ  all   --       10.200.2.55                       anywhere
DNAT            tcp   --       anywhere                          anywhere tcp to:10.200.2.55:9153

Chain KUBE-SEP-BKTFYET4HE3YMOJJ (1 references)
target          prot  opt      source                            destination
KUBE-MARK-MASQ  all   --       10.200.2.55                       anywhere
DNAT            tcp   --       anywhere                          anywhere tcp to:10.200.2.55:53

Chain KUBE-SEP-DEVX3KFWHGGJW53M (1 references)
target          prot  opt      source                            destination
KUBE-MARK-MASQ  all   --       10.200.1.41                       anywhere
DNAT            tcp   --       anywhere                          anywhere tcp to:10.200.1.41:53

Chain KUBE-SEP-E6U6KEZPQBWVNUQ2 (1 references)
target          prot  opt      source                            destination
KUBE-MARK-MASQ  all   --       controller-1.c.dj-kthw3.internal  anywhere
DNAT            tcp   --       anywhere                          anywhere tcp to:10.240.0.11:6443

Chain KUBE-SEP-HFMBYHW5FO36NATD (1 references)
target          prot  opt      source                            destination
KUBE-MARK-MASQ  all   --       controller-0.c.dj-kthw3.internal  anywhere
DNAT            tcp   --       anywhere                          anywhere tcp to:10.240.0.10:6443

Chain KUBE-SEP-SF3HLF254VH2WA6T (1 references)
target          prot  opt      source                            destination
KUBE-MARK-MASQ  all   --       10.200.1.41                       anywhere
DNAT            tcp   --       anywhere                          anywhere tcp to:10.200.1.41:9153

Chain KUBE-SEP-WC3UHWDNRVUZOT3Q (1 references)
target          prot  opt      source                            destination
KUBE-MARK-MASQ  all   --       10.200.1.45                       anywhere
DNAT            tcp   --       anywhere                          anywhere tcp to:10.200.1.45:80

Chain KUBE-SEP-WRZKKJS6MWEUDTA4 (1 references)
target          prot  opt      source                            destination
KUBE-MARK-MASQ  all   --       controller-2.c.dj-kthw3.internal  anywhere
DNAT            tcp   --       anywhere                          anywhere tcp to:10.240.0.12:6443

Chain KUBE-SEP-ZF5QQE2XUFG2ACNS (1 references)
target          prot  opt      source                            destination
KUBE-MARK-MASQ  all   --       10.200.2.55                       anywhere
DNAT            udp   --       anywhere                          anywhere udp to:10.200.2.55:53

Chain KUBE-SEP-ZIO7FTENMB6T7XGS (1 references)
target          prot  opt      source                            destination
KUBE-MARK-MASQ  all   --       10.200.1.41                       anywhere
DNAT            udp   --       anywhere                          anywhere udp to:10.200.1.41:53

Chain KUBE-SERVICES (2 references)
target                        prot  opt  source          destination
KUBE-MARK-MASQ                tcp   --   !10.200.0.0/16  10.32.0.1    /* default/kubernetes:https cluster IP */ tcp   dpt:https
KUBE-SVC-NPX46M4PTMTKRN6Y     tcp   --   anywhere        10.32.0.1    /* default/kubernetes:https cluster IP */ tcp   dpt:https
KUBE-MARK-MASQ                tcp   --   !10.200.0.0/16  10.32.0.101  /* default/nginx1: cluster IP */ tcp   dpt:http
KUBE-SVC-253L2MOZ6TC5FE7P     tcp   --   anywhere        10.32.0.101  /* default/nginx1: cluster IP */ tcp   dpt:http
KUBE-MARK-MASQ                tcp   --   !10.200.0.0/16  10.32.0.102  /* default/nginx2: cluster IP */ tcp   dpt:http
KUBE-SVC-KN7BHMGRB3FSVEMI     tcp   --   anywhere        10.32.0.102  /* default/nginx2: cluster IP */ tcp   dpt:http
KUBE-MARK-MASQ                tcp   --   !10.200.0.0/16  10.32.0.100  /* default/nginx0: cluster IP */ tcp   dpt:http
KUBE-SVC-SJ5YE6C53UPXD73I     tcp   --   anywhere        10.32.0.100  /* default/nginx0: cluster IP */ tcp   dpt:http
KUBE-MARK-MASQ                udp   --   !10.200.0.0/16  10.32.0.10   /* kube-system/kube-dns:dns cluster IP */ udp   dpt:domain
KUBE-SVC-TCOU7JCQXEZGVUNU     udp   --   anywhere        10.32.0.10   /* kube-system/kube-dns:dns cluster IP */ udp   dpt:domain
KUBE-MARK-MASQ                tcp   --   !10.200.0.0/16  10.32.0.10   /* kube-system/kube-dns:dns-tcp cluster IP */ tcp   dpt:domain
KUBE-SVC-ERIFXISQEP7F7OF4     tcp   --   anywhere        10.32.0.10   /* kube-system/kube-dns:dns-tcp cluster IP */ tcp   dpt:domain
KUBE-MARK-MASQ                tcp   --   !10.200.0.0/16  10.32.0.10   /* kube-system/kube-dns:metrics cluster IP */ tcp   dpt:9153
KUBE-SVC-JD5MR3NA4I4DYORP     tcp   --   anywhere        10.32.0.10   /* kube-system/kube-dns:metrics cluster IP */ tcp   dpt:9153
KUBE-NODEPORTS                all   --   anywhere        anywhere     /* kubernetes service nodeports; NOTE: this must be the last rule in this chain */ ADDRTYPE match dst-type LOCAL

Chain KUBE-SVC-253L2MOZ6TC5FE7P (2 references)
target                        prot  opt      source    destination
KUBE-SEP-WC3UHWDNRVUZOT3Q     all   --       anywhere  anywhere

Chain KUBE-SVC-ERIFXISQEP7F7OF4 (1 references)
target                        prot  opt      source    destination
KUBE-SEP-DEVX3KFWHGGJW53M     all   --       anywhere  anywhere statistic mode random probability  0.50000000000
KUBE-SEP-BKTFYET4HE3YMOJJ     all   --       anywhere  anywhere

Chain KUBE-SVC-JD5MR3NA4I4DYORP (1 references)
target                        prot  opt      source    destination
KUBE-SEP-SF3HLF254VH2WA6T     all   --       anywhere  anywhere statistic mode random probability  0.50000000000
KUBE-SEP-B5QGFRIIAVJ4SUMQ     all   --       anywhere  anywhere

Chain KUBE-SVC-KN7BHMGRB3FSVEMI (2 references)
target                        prot  opt      source    destination
KUBE-SEP-3MQ7LGWSED2GAEFA     all   --       anywhere  anywhere

Chain KUBE-SVC-NPX46M4PTMTKRN6Y (1 references)
target                        prot  opt      source    destination
KUBE-SEP-HFMBYHW5FO36NATD     all   --       anywhere  anywhere statistic mode random probability 0.33332999982
KUBE-SEP-E6U6KEZPQBWVNUQ2     all   --       anywhere  anywhere statistic mode random probability 0.50000000000
KUBE-SEP-WRZKKJS6MWEUDTA4     all   --       anywhere  anywhere

Chain KUBE-SVC-SJ5YE6C53UPXD73I (2 references)
target                        prot  opt      source    destination
KUBE-SEP-4QSDQJ2XGBM3KIR7     all   --       anywhere  anywhere

Chain KUBE-SVC-TCOU7JCQXEZGVUNU (1 references)
target                        prot  opt  source    destination
KUBE-SEP-ZIO7FTENMB6T7XGS     all   --   anywhere  anywhere     statistic mode random probability 0.50000000000
KUBE-SEP-ZF5QQE2XUFG2ACNS     all   --   anywhere  anywhere
```

As you can see, there are a few that are clearly placed there by Kubernetes.

Start Googling
Find issue

## modprobe br_netfilter

Running `modprobe br_netfilter` alone wouldn't have been very satifying without understanding what it does. We found some [documentation that described its effects in more detail](http://ebtables.netfilter.org/documentation/bridge-nf.html), and decided to do some before/after observation:


```terminal
root@worker-2:~# ll /proc/sys/net
total 0
dr-xr-xr-x 1 root root 0 Feb 10 11:42 ./
dr-xr-xr-x 1 root root 0 Feb 10 10:10 ../
dr-xr-xr-x 1 root root 0 Feb 10 11:42 core/
dr-xr-xr-x 1 root root 0 Feb 10 11:42 ipv4/
dr-xr-xr-x 1 root root 0 Feb 10 11:42 ipv6/
dr-xr-xr-x 1 root root 0 Feb 10 11:42 iw_cm/
dr-xr-xr-x 1 root root 0 Feb 10 11:42 netfilter/
-rw-r--r-- 1 root root 0 Feb 10 11:42 nf_conntrack_max
dr-xr-xr-x 1 root root 0 Feb 10 11:42 unix/
```

There's no `bridge` subdirectory there, as expected.

Next we ran `modprobe br_netfilter` and then checked to see what had been created:

```terminal
root@worker-0:~# head /proc/sys/net/bridge/* ==> /proc/sys/net/bridge/bridge-nf-call-arptables <==
1

==> /proc/sys/net/bridge/bridge-nf-call-ip6tables <==
1

==> /proc/sys/net/bridge/bridge-nf-call-iptables <==
1

==> /proc/sys/net/bridge/bridge-nf-filter-pppoe-tagged <==
0

==> /proc/sys/net/bridge/bridge-nf-filter-vlan-tagged <==
0

==> /proc/sys/net/bridge/bridge-nf-pass-vlan-input-dev <==
0
```

As series of files, each presumably acting a toggle for various kernel features.

We tried the `curl` from our debug pod, attempting to hit the Cluster IP of the NGiNX service that is backed by a pod on the same worker, and this time it worked. Huzzah!

Just be sure we understood what was going on, we repeated the test on a different worker, this time just setting an individual flag via `echo 1 > /proc/sys/net/bridge/bridge-nf-call-iptables`. This worked, so now we knew exactly what feature was having an impact.

A combination of our exploration and reading the `ebtables` documentation suggests that some traffic going via the bridge interface was not eligible for some `iptables` filtering.

We ran `tcpdump` again to see how the flow of packets had changed (MAC addresses have been replaced for readability):

```terminal
root@worker-2:~# tcpdump -nn -i any -e port 80
tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on any, link-type LINUX_SLL (Linux cooked), capture size 262144 bytes
11:50:09.299564   P DEBUG_INTERFACE ethertype IPv4 (0x0800), length 76: 10.200.2.54.44898 > 10.32.0.117.80: Flags [S], seq 3054985869, win 64240, options [mss 1460,sackOK,TS val 2160371900 ecr 0,nop,wscale 7], length 0
11:50:09.299601 Out BRIDGE ethertype IPv4 (0x0800), length 76: 10.200.2.54.44898 > 10.200.2.52.80: Flags [S], seq 3054985869, win 64240, options [mss 1460,sackOK,TS val 2160371900 ecr 0,nop,wscale 7], length 0
11:50:09.299622 Out DEBUG_INTERFACE ethertype IPv4 (0x0800), length 76: 10.200.2.54.44898 > 10.200.2.52.80: Flags [S], seq 3054985869, win 64240, options [mss 1460,sackOK,TS val 2160371900 ecr 0,nop,wscale 7], length 0
11:50:09.299626 Out DEBUG_INTERFACE ethertype IPv4 (0x0800), length 76: 10.200.2.54.44898 > 10.200.2.52.80: Flags [S], seq 3054985869, win 64240, options [mss 1460,sackOK,TS val 2160371900 ecr 0,nop,wscale 7], length 0
11:50:09.299661   P NGINX_INTERFACE ethertype IPv4 (0x0800), length 76: 10.200.2.52.80 > 10.200.2.54.44898: Flags [S.], seq 84449733, ack 3054985870, win 65160, options [mss 1460,sackOK,TS val 798906542 ecr 2160371900,nop,wscale 7], length 0
11:50:09.299669 Out NGINX_INTERFACE ethertype IPv4 (0x0800), length 76: 10.32.0.117.80 > 10.200.2.54.44898: Flags [S.], seq 84449733, ack 3054985870, win 65160, options [mss 1460,sackOK,TS val 798906542 ecr 2160371900,nop,wscale 7], length 0
11:50:09.299682   P DEBUG_INTERFACE ethertype IPv4 (0x0800), length 68: 10.200.2.54.44898 > 10.32.0.117.80: Flags [.], ack 1, win 502, options [nop,nop,TS val 2160371900 ecr 798906542], length 0
11:50:09.299877   P NGINX_INTERFACE ethertype IPv4 (0x0800), length 68: 10.200.2.52.80 > 10.200.2.54.44898: Flags [.], ack 76, win 509, options [nop,nop,TS val 798906542 ecr 2160371900], length 0
```

There are a few differences here:

* most importantly, we see the synack (`S.`) packet coming out of the NGiNX pod's interface, with a destination of the debug pod's IP, but crucially with a _source_ of the Cluster IP. Presumably this is `netfilter` working its wonders and doing some NAT on return packets.
* there is no `In` packet going through debug pod interface, from the debug pod to the NGiNX pod IP

everything works, happy times

link to networking post that explains all this

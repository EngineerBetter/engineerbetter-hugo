---
author: Daniel Jones
date: "2015-05-18"
heroImage: /img/blog/cerberus.jpg
title: OpenJDK 1.8.0_u40 Kerberos MS Auth Bug
---

I discovered an [OpenJDK 1.8.0_u40 bug](https://bugs.openjdk.java.net/browse/JDK-8078439) whereby only the first OID in a Kerberos ticket will be considered for supportability; if your server can only authenticate using mechanisms further down the OID list in the ticket then you're bang out of luck.

<!--more-->

I also observed the same bug in the Oracle JRE v8_u45, which shows how much shared code they have in common.

I discovered the bug on-site with an enterprise client. After updating their customisation of the Cloud Foundry Java buildpack, apps on the PaaS ceased to be able to authenticate via Kerberos. This was originally manifested by a `NullPointerException` being thrown by Spring Security Kerberos' `SunJaasKerberosTicketValidator`

```java
o.a.c.c.C.[.[.[/].[dispatcherServlet]    : Servlet.service() for servlet [dispatcherServlet] in context with path [] threw exception

 java.lang.NullPointerException: null
       at org.springframework.security.kerberos.authentication.sun.SunJaasKerberosTicketValidator$KerberosValidateAction.run(SunJaasKerberosTicketValidator.java:162)
       at org.springframework.security.kerberos.authentication.sun.SunJaasKerberosTicketValidator$KerberosValidateAction.run(SunJaasKerberosTicketValidator.java:151)
       at java.security.AccessController.doPrivileged(Native Method)
```

Version 1.0.0-RELEASE of the Spring Kerberos library defensively checked against the unpopulated context and [threw a `BadCredentials` exception](https://github.com/spring-projects/spring-security-kerberos/commit/f046bd7c69d6dad74eb06a7651cd68060b31ff6f), but thankfully now there appears to be [a better workaround](https://github.com/spring-projects/spring-security-kerberos/commit/5e28e87f581629724ff8a0f6d24c3ebc591a00bb).

For the client this was a bit of a showstopper. Should they:

1. Stay on an old version of the OpenJDK JRE, and be prevented from adopting fixes for zero-day vulnerabilities?
1. Stop using Kerberos?
1. Rewrite and register core Sun security classes?
1. Try and change the way the OIDs are ordered when the ticket is generated?
1. Manually fiddle with the incoming Kerberos tickets?

As a financial company with a reputation to protect, options 1 through 3 were not viable. We investigated changing the way tickets are generated, but sadly Kerberos was a black box to the teams that were responsbile for it. That meant the only viable option was *filthy*.

I wrote a thoroughly ungodly `KerberosTicketValidator` implementation that composed a `SunJaasKerberosTicketValidator` (sadly due the issues of IP ownership I can't share it with you).

The [argument to the `validate` method](http://docs.spring.io/spring-security/site/extensions/krb/docs/1.0.x/apidocs/org/springframework/security/extensions/kerberos/KerberosTicketValidator.html#validateTicket(byte[])) is a `byte[]`, so no high-level abstractions here. With the help of the fine people on the OpenJDK Security mailing list, I identified the particular parts of the byte array that would need swapping around to reorder the mechanism OIDs.

Given a thoroughly filthy <del>hack</del> tactical solution, you'd expect rigorous testing, right? Sadly, that wasn't to be. There was no straightforward way to generate a ticket in Java exactly as our Microsoft Kerberos servers were doing. The tickets include a signed timestamp to prevent replay attacks, so I couldn't just store a fixture ticket to test with. The CI server was Linux-based, so no kind of shelling out would have helped (we looked at using `curl` to generate a ticket, but unsurprisingly it didn't use Microsoft OIDS!). In the end a lot of defensive checks had to suffice.

The code made it into production and works just fine. The OpenJDK people got the issue addressed pretty quickly, so it was a happy ending all around.

It's not every day one finds a bug in something as ubiquitous as OpenJDK, and thankfully not everyday one finds oneself rummaging through and blindly modifying byte arrays!

---
author: Paddy Steed
date: "2017-11-15"
heroImage: /img/blog/yubikey4.png
title: Yubikeys for Two-Factor Auth

draft: true

heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

If you're amassing a plethora of user accounts that require two-factor authentication (2FA) and let's face it, you _should_, then you'll be pleased to learn how you can use a USB Yubikey to avoid having to type in as many one-time-passwords (OTPs).

<section class="boxout">
<p>This post is part of a series on using Yubikeys to secure development whilst pair-programming on shared machines.</p>
</section>

An increasing number of sites support [U2F]. It is more secure, and users are able to authenticate faster compared with any other 2FA method.

<span class="pure-table">

  Attack               | Google Authenticator | Hardware OTP Generator | U2F
  ---------------------|----------------------|------------------------|----
  Weak/stolen password | ☑                    | ☑                      | ☑
  Phishing             | ☒                    | ☒                      | ☑
  TLS MitM             | ☒                    | ☒                      | ?

</span>

## Two-Factor Authentication with One-Time Passwords

Traditional OTPs protect against password reuse, weak passwords and credential leakage.

A user's login procedure using a traditional OTP is usually something like this:

1. Navigate to example.com
2. Enter username and password
3. Receive prompt for OTP
4. Read short numeric code from OTP generator
5. Type OTP into web page

Enabling 2FA on your online accounts is a huge improvement on using static passwords alone, however it makes the most common form of account compromise only marginally more difficult.

### OTP and phishing

According to [research][goog_phishing] by Google, phishing is by far the most common way from an online account to be compromised.
Phishing attacks were responsible for [John Podesta's][podesta] email getting hacked, they were responsible for [Hillary Clinton's][clinton] campaign email's being hacked.
Even if you are a Republican you are still not safe as [Sarah Palin's][palin] email account was hacked via a phising attack.

Despite what the victims will tell you, these attacks are not sophisticated and they don't require "state sponsorship".
The industry standard advice seems to be to train staff to recognise phishing attacks.
This is expensive and companies that do this still get phished.

If the user is tricked into entering their login details on phishing site then OTP 2FA does no good.
They will have given their password and OTP to the phishing site, which can then forward that on to the real site and impersonate the user.
The only frustration OTPs provide to an attacker attempting this is they have a short window to forward those credentials before the OTP is expired.
In practice this is not an issue as the easiest way of phishing a site is setting up a reverse proxy to it, in which case the credentials are forwared in real time.

## The U2F alternative

The FIDO Universal 2nd Factor (U2F) standard for simplifying 2FA using hardware devices that eliminates the possibility of phishing with no user training required.

When using a certified U2F device, a user's experience goes like this:

1. Navigate to example.com
2. Enter username and password
3. Touch U2F device

A lot happens when that device is pressed.
The U2F device signs a message containing a random string from the server, the servers address from the browsers perspective and some other things.
The browser then forwards that signiture to the server.

Your Yubikey is also a [U2F] device.
An increasing number of sites support [U2F].
This is the most user-friendly way to use a Yubikey as your 2FA device.
The latest versions of Chrome, Opera and Firefox support [U2F], however, in Firefox it is not enabled by default and you must enable the following options in the <about:config> page:

- `security.webauth.u2f`
- `security.webauth.webauthn`

[GitHub][githubU2F], [Gitlab][gitlabU2F], [Google Cloud Platform][GCPU2F] all support [U2F] as a 2FA option.
[Amazon Web Services][AWS] does not yet, but you can still use your Yubikey as your 2FA device.

## Falling back to Time-based OTP

[AWS] supports the [TOTP] standard.
It is not possible for a smart card without a battery to implement TOTP by itself as it requires a real time clock.

Thankfully, you can use the [Yubico Authenticator][yubico_authenticator] app to generate TOTP tokens from the secrets on your Yubikey. You can store up to 32 different TOTP accounts on your Yubikey, nothing is stored on the computer you use, you can insert your Yubikey into any machine with the [Yubico Authenticator][yubico_authenticator] installed and all your TOTP tokens will be availible.

## Why U2F?

Google performed a two year [study][googU2F] on U2F devices which are widely deployed within Google. They found that compared with a app based OTP like Google Authenticator, users authenticated faster using a U2F device, U2F devices were inherently less suceptible to MitM attacks and users raised support tickets for authentication problems far less frequently.

[cvpwn]: https://thejh.net/misc/website-terminal-copy-paste
[githubkeys]: https://github.com/settings/keys
[gitlabkeys]: https://gitlab.com/profile/keys
[yubi4]: https://www.yubico.com/product/yubikey-4-series/
[U2F]: https://www.yubico.com/solutions/fido-u2f/
[githubU2F]: https://help.github.com/articles/configuring-two-factor-authentication-via-fido-u2f/
[gitlabU2F]: https://docs.gitlab.com/ce/user/profile/account/two_factor_authentication.html#enable-2fa-via-u2f-device
[GCPU2F]: https://cloud.google.com/solutions/securing-gcp-account-security-keys
[AWS]: https://aws.amazon.com/
[yubico_authenticator]: https://www.yubico.com/support/knowledge-base/categories/articles/yubico-authenticator-download/
[TOTP]: https://tools.ietf.org/html/rfc6238
[ROCA]: https://www.yubico.com/support/security-advisories/ysa-2017-01/
[googU2F]: https://research.google.com/pubs/pub45409.html
[goog_phishing]: https://security.googleblog.com/2017/11/new-research-understanding-root-cause.html
[podesta]: http://edition.cnn.com/2017/06/27/politics/russia-dnc-hacking-csr/index.html
[clinton]: https://www.apnews.com/dea73efc01594839957c3c9a6c962b8a
[palin]: https://www.wired.com/2008/09/group-posts-e-m/

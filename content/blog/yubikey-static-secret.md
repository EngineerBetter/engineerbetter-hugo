---
author: Daniel Jones
date: "2017-12-05"
heroImage: /img/blog/yubikey4.png
title: Yubikeys for Static Secrets

heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

You can use your Yubikey to remember and type an arbitrary string, as well as using it as a OTP generator and a secure store for your SSH key. We use this so that we don't have to remember our 1Password secret keys.

<section class="boxout">
<p>This post is part of <a href="/blog/yubikey-all-the-things/">a series on using Yubikeys</a> to secure development whilst pair-programming on shared machines.</p>
</section>

We use 1Password as our team secrets-management tool. It's great, but every user needs to remember not only their username and password, but a 40-character secret key too. Normally this is saved on your machine, which is not ideal when you're using shared computers.

The following steps show you how to configure a Yubikey to store your 1Password secret key, so that you can type with a simple button-press.

1. Download and install the [Yubikey Personalization Tool](https://www.yubico.com/products/services-software/personalization-tools/use/)
1. Open the Yubikey Personalization Tool, which looks like this: <img src="/img/blog/yubikey-1password/yubikey-personalization-tool.png" class="image fit">
1. Insert your Yubikey, checking that it shows up in the right-hand side of the window: <img src="/img/blog/yubikey-1password/ypt-inserted.png" class="image fit">
1. Click **Static Password**:<img src="/img/blog/yubikey-1password/ypt-static-password.png" class="image fit">
1. Click **Scan Code**: <img src="/img/blog/yubikey-1password/ypt-scan-code.png" class="image fit">
1. **Select "Configuration Slot 2"**. If you accidentally use the first slot, you'll overwrite the configuration that allows your Yubikey to work as an OTP generator. That would be _bad_. <img src="/img/blog/yubikey-1password/ypt-slot-2.png" class="image fit">
1. Choose a **keyboard layout**: <img src="/img/blog/yubikey-1password/ypt-keyboard-layout.png" class="image fit">
1. Log in to 1Password: <img src="/img/blog/yubikey-1password/1password-login.png" class="image fit">
1. Click on your name and then **select "My Profile"** from the dropdown menu: <img src="/img/blog/yubikey-1password/1password-logged-in.png" class="image fit">
1. **Copy your Secret Key** from under the "Sign-In Details" section: <img src="/img/blog/yubikey-1password/1password-singin-details.png" class="image fit">
1. Paste your Secret Key into the Password box of the Yubikey Personalization Tool. I've obfuscated mine for obvious reasons! <img src="/img/blog/yubikey-1password/ypt-pasted.png" class="image fit">
1. **Remove all the dashes**, as these are not needed and cause the key to be too long. You should end up with a string of 34 characters. <img src="/img/blog/yubikey-1password/ypt-dashes-removed.png" class="image fit">
1. Double-check that you've selected **Configuration Slot 2**, otherwise you'll b0rk your OTP functionality.
1. Click **Write Configuration**, which commits the changes to the Yubikey:
1. Save the configuration log somewhere secure - it contains your secret.
1. Open 1Password in a new incognito browser window.
1. Give focus to the **Secret Key** field.
1. **Press and hold the Yubikey button** for 3-4 seconds. If you get the wrong string, you probably didn't hold it for long enough.
1. Observe your very long and hard-to-remember secret key being typed into the field!

Et voila! You no longer need to remember that _very_ long secret key, leaving you with just your username and password.

Combined with [securely storing your SSH key](/blog/yubikey-ssh/), and [reducing the amount of 2FA faff](/blog/yubikey-2fa/), using a Yubikey makes it drastically easier to practice secure development.

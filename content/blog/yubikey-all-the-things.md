---
author: Daniel Jones
date: "2017-12-06"
heroImage: /img/blog/yubikey-all-the-things.jpg
title: Yubikey All the Things

heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---

Paddy Steed is one of the newer members of EngineerBetter, and has a keen eye for all things related to security and cryptography. Soon after joining us he outlined a great way for us to securely use shared machines whilst pairing.

Each team member now has a single [Yubikey USB security device](https://www.yubico.com/products/yubikey-hardware/yubikey4/) that does all of the following:

* [Stores and loads our personal SSH keys][ssh]
* [Provides one-touch two-factor authentication][2fa]
* [Stores and recalls our 1Password secret keys][static]

## SSH

After a little setup, an engineer inserts their Yubikey, enters a PIN, and then their SSH key is loaded all the time the device is connected. By generating the RSA key on the device, it never exists on disk anywhere else.

[Yubikeys for SSH][ssh]

## 2FA

Having to use one's phone every few minutes to enter a 2FA code for the myriad services we use is a pain. Yubikeys support U2F, which makes 2FA as simple as pressing the button on your Yubikey device. With the help of a Yubico app, you can also use it for old-school time-based one-time-passwords.

[Yubikeys for 2FA][2fa]

## Static secrets

The Yubikey can be configured to type in a string when its button is long-pressed. This is a great way to get your (very long, very hard to remember) 1Password secret key when using a shared machine. This means you only have to remember your email address and password to access your password vault, but with all the benefits of an extra secret for higher entropy.

[Yubikeys for static secrets][static]

[ssh]: /blog/yubikey-ssh/
[2fa]: /blog/yubikey-2fa/
[static]: /blog/yubikey-static-secret/

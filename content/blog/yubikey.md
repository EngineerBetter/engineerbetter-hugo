---
author: Paddy Steed
date: "2017-11-15"
heroImage: /img/blog/yubikey4.png
title: Yubikeys for DevOps

heading: Our
headingBold: blog
Description: Get the very latest updates about recent projects, team updates, thoughts and industry news from our team of EngineerBetter experts.
---
Not only can a Yubikey be used as your 2FA device, it can be used to secure your SSH credentials.
This guide will show you how to use your Yubikey to generate and store a PGP key and then configure your computer to use that key to authenticate to remote SSH servers.
This post assumes you have a [Yubikey 4][yubi4].


Digital security is generally much more difficult than physical security.
If I have a secret written on a piece of paper, I could hide that paper somewhere, I could keep it on my person, I could put it in safety deposit box.
All of these are pretty good ways to make sure nobody reads whatever is on the paper and all are simple to reason about.
If I have that same secret on a file on my laptop however, there is much more to think about.
Every piece of software I run has permission to read that file.

My laptop has a network connection, so an attacker does not need to ever meet me to steal my secret.
A Yubikey *almost* turns a digital security problem into a physical security one.

If your SSH key is stored on a Yubikey it cannot be copied, it cannot be stolen remotely and the software on whatever machine you stick it into cannot read it.
You can even PIN protect the key, which means that if somebody physically steals your Yubikey then they have to guess the PIN correctly to be able to use it, and even then, they will be unable to extract the key.

## SSH key on Yubikey
Firstly, you need to configure `ssh` to use `gpg-agent` to handle authentication.
If you use zsh you will need to append these lines to `~/.zshrc` instead.

```
$ cat <<EOF >> ~/.bashrc
export GPG_TTY=$(tty)
gpg-connect-agent updatestartuptty /bye
unset SSH_AGENT_PID
export SSH_AUTH_SOCK=$(gpgconf --list-dirs agent-ssh-socket)
EOF
$ . ~/.bashrc
```

Install `gpg` using your operating systems package manager. Plug in your Yubikey. You should change the PIN from the default of `123456`.

```
$ gpg --change-pin
1 - change PIN
2 - unblock PIN
3 - change Admin PIN
4 - set the Reset Code
Q - quit
Your selection? 1
Please enter the PIN
New PIN
New PIN
PIN changed.
```

If you enter this PIN incorrectly 3 times. The PIN will be locked and you must unlock it using the admin PIN.
You should change this also.

```
$ gpg --change-pin
1 - change PIN
2 - unblock PIN
3 - change Admin PIN
4 - set the Reset Code
Q - quit
Your selection? 3
gpg: 3 Admin PIN attempts remaining before card is permanently locked
Please enter the Admin PIN
New Admin PIN
New Admin PIN
Admin PIN changed.
```

If you enter the admin PIN incorrectly 3 times you will need to factory reset the Yubikey.
Next, generate a RSA key on your Yubikey.
I recommend [generating the key on the card](#roca), rather than generating the key on your computer and then copying it to the card.

```
$ gpg --card-edit
gpg: detected reader `Yubico Yubikey 4 OTP+U2F+CCID 00 00'
Application ID ...: D2760001240102010006069174660000
Version ..........: 2.1
Manufacturer .....: unknown
Serial number ....: 06917466
Name of cardholder: [not set]
Language prefs ...: [not set]
Sex ..............: unspecified
URL of public key : [not set]
Login data .......: [not set]
Private DO 1 .....: [not set]
Private DO 2 .....: [not set]
Signature PIN ....: not forced
Key attributes ...: 2048R 2048R 2048R
Max. PIN lengths .: 127 127 127
PIN retry counter : 3 0 3
Signature counter : 0
Signature key ....: [none]
Encryption key....: [none]
Authentication key: [none]
General key info..: [none]
gpg/card> admin
Admin commands are allowed
gpg/card> generate
```

You will be asked if you want to backup the encryption key.
If you are only using this key for SSH authentication I would recommend you do not do this.
It is fairly easy to go though this process again if you lose your Yubikey and it means your key will not ever leave your Yubikey.

```
Make off-card backup of encryption key? (Y/n) n
Please note that the factory settings of the PINs are
   PIN = `123456'     Admin PIN = `12345678'
You should change them using the command --change-pin
gpg: gpg-agent is not available in this session
Please enter the PIN
What keysize do you want for the Signature key? (2048)
What keysize do you want for the Encryption key? (2048)
What keysize do you want for the Authentication key? (2048)
Please specify how long the key should be valid.
         0 = key does not expire
      <n>  = key expires in n days
      <n>w = key expires in n weeks
      <n>m = key expires in n months
      <n>y = key expires in n years
```

By default, your key will not expire. I would recommend setting an expiry date.

```
Key is valid for? (0) 1y
Key expires at Wed 14 Nov 2018 14:18:02 GMT
Is this correct? (y/N) y
You need a user ID to identify your key; the software constructs the user ID
from the Real Name, Comment and Email Address in this form:
    "Heinrich Heine (Der Dichter) <heinrichh@duesseldorf.de>"
Real name: Paddy Steed
Email address: paddy.steed@engineerbetter.com
Comment:
You selected this USER-ID:
    "Paddy Steed <paddy.steed@engineerbetter.com>"
Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit? O
gpg: generating new key
gpg: 3 Admin PIN attempts remaining before card is permanently locked
Please enter the Admin PIN
gpg: please wait while key is being generated ...
gpg: key generation completed (4 seconds)
gpg: signatures created so far: 0
gpg: generating new key
gpg: please wait while key is being generated ...
gpg: key generation completed (6 seconds)
gpg: signatures created so far: 1
gpg: signatures created so far: 2
gpg: generating new key
gpg: please wait while key is being generated ...
gpg: key generation completed (9 seconds)
gpg: signatures created so far: 3
gpg: signatures created so far: 4
gpg: key A4D581D2 marked as ultimately trusted
public and secret key created and signed.
gpg: checking the trustdb
gpg: public key of ultimately trusted key 53157188 not found
gpg: 3 marginal(s) needed, 1 complete(s) needed, PGP trust model
gpg: depth: 0  valid:   2  signed:   0  trust: 0-, 0q, 0n, 0m, 0f, 2u
gpg: next trustdb check due at 2018-11-14
pub   2048R/A4D581D2 2017-11-14 [expires: 2018-11-14]
      Key fingerprint = 31A1 BADF 181F B053 0D06  8B45 7B4E 9486 A4D5 81D2
uid                  Paddy Steed <paddy.steed@engineerbetter.com>
sub   2048R/0A3CA35A 2017-11-14 [expires: 2018-11-14]
sub   2048R/4746682A 2017-11-14 [expires: 2018-11-14]
gpg/card> quit
```

Your PGP key is now generated and the public key is stored on your GPG keychain.
Assuming you have configured `gpg-agent` correctly. `ssh-add -L` will display the public key in SSH format.

```
$ ssh-add -L
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCy7PhCvbb+R0UIsQdBvIpWQNSBOZkfV+7E0d55Gxzppt9tvQHbWJwzi/… cardno:000606917466
```

You can put this in `~/.authorized_keys` of any machine you want to be able to log in to. You can

## 2FA
An increasing number of sites support [U2F]. It is more secure, and users are able to authenticate faster compared with any other 2FA method.

<span class="pure-table">

  Attack               | Google Authenticator | Hardware OTP Generator | U2F
  ---------------------|----------------------|------------------------|----
  Weak/stolen password | ☑                    | ☑                      | ☑
  Phishing             | ☒                    | ☒                      | ☑
  TLS MitM             | ☒                    | ☒                      | ?

</span>

Traditional one time passwords (OTPs) protect against password reuse, weak passwords and credential leakage.
Enabling 2FA on your online accounts is a huge improvement on using static passwords alone, however it makes the most common form of account compromise only marginally more difficult.
According to [research][goog_phishing] by Google, phishing is by far the most common way from an online account to be compromised.
Phishing attacks were responsible for [John Podesta's][podesta] email getting hacked, they were responsible for [Hillary Clinton's][clinton] campaign email's being hacked.
Even if you are a Republican you are still not safe as [Sarah Palin's][palin] email account was hacked via a phising attack.

Despite what the victims will tell you, these attacks are not sophisticated and they don't require "state sponsorship".
The industry standard advice seems to be to train staff to recognise phishing attacks.
This is expensive and companies that do this still get phished.
The FIDO Universal 2nd Factor standard completely eliminates the possibility of phising with no user training required.

A user's login procedure using a traditional OTP is usually something like this:

1. Navigate to example.com
2. Enter username and password
3. Receive prompt for OTP
4. Read short numeric code from OTP generator
5. Type OTP into web page

If the user is tricked into entering their login details on phishing site, 2FA does no good.
They will have given their password and OTP to the phising site, which can then forward that on to the real site and impersonate the user.
The only frustration OTPs provide to an attacker attempting this is they have a short window to forward those credentials before the OTP is expired.
In practice this is not an issue as the easiest way of phishing a site is setting up a reverse proxy to it, in which case the credentials are forwared in real time.

When using a U2F token, a user's experience goes like this:

1. Navigate to example.com
2. Enter username and password
3. Touch U2F token

A lot happens when that token is pressed.
The U2F token signs a message containing a random string from the server, the servers address from the browsers perspective and some other things.
The browser then forwards that signiture to the server.


Your Yubikey is also a [U2F] token. U2F is a open standard for
An increasing number of sites support [U2F].
This is the most user friendly way to use a Yubikey as your 2FA device.
The latest versions of Chrome, Opera and Firefox support [U2F], however, in Firefox it is not enabled by default and you must enable the following options in the <about:config> page.
- security.webauth.u2f
- security.webauth.webauthn

[Github][githubU2F], [Gitlab][gitlabU2F], [Google Cloud Platform][GCPU2F] all support [U2F] as a 2FA option.
[Amazon Web Services][AWS] does not yet, but you can still use your Yubikey as your 2FA device.
[AWS] supports the [TOTP] standard.
It is not possible for a smart card with no battery to implement TOTP by itself as it requires a real time clock.
Thankfully, you can use the [Yubico Authenticator][yubico_authenticator] to generate TOTP tokens from the secrets on your Yubikey. You can store up to 32 different TOTP accounts on your Yubikey, nothing is stored on the computer you use, you can insert your Yubikey into any machine with the [Yubico Authenticator][yubico_authenticator] installed and all your TOTP tokens will be availible.

Google performed a two year [study][googU2F] on U2F devices which are widely deployed within Google. They found that compared with a app based OTP like Google Authenticator, Users authenticated faster using a U2F device, U2F devices were inherently less suceptible to MitM attacks and users raised support tickets for authentication problems far less frequently.

## ROCA <a name="roca"></a>
Recently (2017-10-15) a serious problem was found in a library used by Yubikey firmware responsible for generating RSA keys.
The [ROCA][ROCA] (Revenge of Coppersmith's Attack) hack enables computing the private part of a RSA keypair from the public part alone.
This has now been fixed, hence why I am recommending generating RSA keys on your Yubikey.

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

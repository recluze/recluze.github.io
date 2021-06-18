---
layout: post
title: TinyLittle Password Keeper
date: 2006-07-19 16:11:30.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Tutorials
- VB.net
tags: []
meta:
  _wpas_done_all: '1'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2006/07/19/tinylittle-password-keeper/"
---
TinyLittle Password Keeper is, as the name implies, a tiny software for securely saving all your passwords in one place. It has the following features:

1. Save password file with a master password.
2. Encrypt all data before saving.
3. Option to further encrypt passwords.
4. Ability to search for passwords.
5. Save multiple accounts/passwords for a single site.

It exports all data to a simple XML file. The data itself is encrypted. All encryption is done using TripleDES encryption.

I made this software primarily as a case study in encryption, user interface design and data storage.

If you want to study the source, take these factors into consideration:

- The decomposition of code into projects, files, classes and methods
- User interface (Placement, size accomodation, interaction)
- Encryption in TripleDESEncryption class
- XML save/load in serialization class (although this isn't strict serialization)

Leave me a comment if you have suggestions for improvement or if you find something wrong. I may not fix it but it'd be nice to know.

[Download software binary](http://recluze.googlepages.com/tlpasskeeper.zip)

[Download project source](http://recluze.googlepages.com/tlpasskeeper_src.rar)

Disclaimer:

I don't care if this software blows your computer up. Don't use it if you're going to whine about it later.


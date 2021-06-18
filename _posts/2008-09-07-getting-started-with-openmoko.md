---
layout: post
title: Getting started with Openmoko
date: 2008-09-07 05:10:32.000000000 +06:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Tutorials
tags: []
meta:
  _wp_old_slug: '1013'
  original_post_id: '1013'
  _edit_last: '2'
  _wpas_done_all: '1'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2008/09/07/getting-started-with-openmoko/"
---
For record purposes, here's what I did to get Openmoko working.&nbsp;

1. Installed Ubuntu. (Had many problems with Fedora. Don't know if it was because of the distribution though.)&nbsp;
2. Installed all the dependencies and got the MokoMakeFile (see [here](http://wiki.openmoko.org/wiki/MokoMakefile)).
3. sudo su and echo 0 \> /proc/sys/vm/mmap\_min\_addr
4. make openmoko-setup&nbsp;
5. make setup-machine-freerunner&nbsp;
6. make openmoko-devel-image&nbsp;
7. Backed up the moko folder&nbsp;

That's what's been working for now. I'll update this post as this progresses.&nbsp;

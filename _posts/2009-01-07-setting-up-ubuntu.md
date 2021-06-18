---
layout: post
title: Setting up Ubuntu
date: 2009-01-07 04:42:15.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Geek stuff
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
permalink: "/2009/01/07/setting-up-ubuntu/"
---
I've just finished setting up my Ubuntu desktop just the way I like it -- uncluttered and usable. Here is a list of programs I'm currently using:

1. Gnome-do:&nbsp; A launcher like QuickSilver (mac) and Launchy (win)
2. Avant-Window-Manager: A dock and very usable taskbar (plus all the awn-\* extra packages)
3. Stalonetray: A system tray replacement so that I can get rid of the gnome panels
4. GDesklet for the analog clock

Here's the script to get stalonetray to sit at the top of the screen and look nice and transparent.

stalonetray -geometry 100x25+900+0&nbsp; --sticky -t --skip-taskbar --window-type dock --grow-gravity W --icon-gravity SE --ignore-icon-resize TRUE --respect-icon-hints false --max-height 48 --icon-size 24 -i 24 --window-layer top

And here's the final look: ([larger version](http://img220.imageshack.us/my.php?image=ubuntureclycc0.png))

[caption id="attachment\_221" align="alignnone" width="480" caption="Pretty Ubuntu Desktop"] ![Pretty Ubuntu Desktop]({{ site.baseurl }}/assets/images/2009/01/ubuntu-recly.png "My Desktop")[/caption]


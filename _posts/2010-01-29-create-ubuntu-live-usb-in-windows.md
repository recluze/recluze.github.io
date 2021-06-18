---
layout: post
title: Create Ubuntu Live USB in Windows
date: 2010-01-29 05:29:56.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Geek stuff
- Linux
- Tutorials
tags: []
meta:
  _wpas_done_all: '1'
  _edit_last: '2'
  original_post_id: '1013'
  _wp_old_slug: '1013'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2010/01/29/create-ubuntu-live-usb-in-windows/"
---
If you've ever had trouble installing Ubuntu because you couldn't use a CD (because of a bad CD, a thoroughly malicious drive or, as in my case, a small-form CD stuck in your slot-load mechanism), you might want to read this. This mini-tutorial (slash how-to) is going to show you a clean and concise, no-BS mechanism for installing Ubuntu 8.04 Hardy Heron without the need for a CD or a working Linux installation. I didn't discover this method. Just came across it somewhere and can't find the link in Google. So, here it goes. (I'm assuming your USB is **F:** drive)

1. Get [syslinux](http://www.kernel.org/pub/linux/utils/boot/syslinux/)(this will allow you to make your USB active and install a bootloader on it -- I used version 3.81).
2. Format your (700M+) USB drive with a FAT32 filesystem.
3. Extract syslinux, go to the win32 folder in the extracted files and execute (from 'cmd'): syslinux.exe -ma f:&nbsp; ... 'm' installs the bootloader and 'a' makes it active.
4. Get Ubuntu 8.04 iso image and use an un-archiver to extract it. Winrar works for me.
5. Copy all extracted files to f:
6. Copy f:/isolinux/\* to f:/\*
7. Rename isolinux.cfg to syslinux.cfg
8. Reboot and boot from your USB drive (you may need to change BIOS settings for this).

_Voila!_ You have Ubuntu working.

Note: Ubuntu 9.10 didn't work for me. I got to the X part but only a "working" cursor showed with no progress. So, let me know if you get it working with this method.


---
layout: post
title: Building Xen from source on Ubuntu 8.04
date: 2010-02-09 10:36:24.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories: []
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
permalink: "/2010/02/09/building-xen-from-source-on-ubuntu-8-04/"
---
After struggling with [XEN](http://xen.org/)'s source for around two weeks, I've finally managed to get it working on a Ubuntu 8.04. It was fairly straight forward with a few bits and pieces of trouble. That is mainly due to the problems of incompatibility between different versions of the hypervisor and `dom0` kernels.

So, here's how I did it. This is more for archiving purposes than for teaching. So, use whatever you can. Post any queries and I'll see if I can help.  
<!--more-->

First, though, you need to get the prerequisites installed on your system. &nbsp;I had a lot of trouble with the compilation because xen build scripts don't check for prereqs before starting. It kept stopping in the middle of the build because of missing packages. So, here's the complete list of all the packages you need for building this version of xen. Just execute:

`# sudo apt-get install build-essential mercurial gawk zlib1g-dev libzzip-dev libcurl4-openssl-dev xorg-dev gettext libncurses5-dev python2.5-dev texinfo texlive-latex-base texlive-latex-recommended texlive-fonts-extra texlive-fonts-recommended transfig bridge-utils uuid-dev
`

Xen also requires Dev86. Get that from [here](http://rdebath.nfshost.com/dev86/) (You only need the binary, not the source. I got Dev86bin-0.16.17.tar.gz)&nbsp;Copy the .tar.gz file to `/` -- your filesystem root and extract it.

Now, get the xen-unstable source. In my case, this was xen-4.0.0-rc3.

`# hg clone http://xenbits.xensource.com/xen-unstable.hg `

That might take just a little while. This only gets the hypervisor source. The `dom0` kernel source will be downloaded by the build script. Start the building process:

`# make world `

In the future, if you wish to rebuild the code without losing all the configuration change, just ` make dist `.

This builds the hypervisor, downloads the associated `dom0` kernel source (which might take a lot of time), builds xen-tools and other smaller packages. Install the whole thing using:

`
# ./install.sh
`

After all that, you should have `xen.gz` and the kernel (which in my case was 2.6.31.6) in the /boot directory.

It's a good idea to create an initrd image. To do so, execute the following two commands:

`
# depmod -a 2.6.31.6
# update-initramfs -c -k 2.6.31.6
`

You now need to add the following directives to `/boot/grub/menu.lst` to enable booting into xen:

`
title Xen 4.0 w/ Linux 2.6.31.6
  root (hd0,1)
  kernel /boot/xen.gz dom0_mem=524288
  module /boot/vmlinuz-2.6.31.6 root=/dev/hda1 ro
  module /boot/initrd.img-2.6.31.6
`

Where /dev/hda1 is your linux partition. (You can get that from ` sudo fdisk -l`.)

Reboot and you should be in Xen. Start the Xen daemon and take a look at your brand new `dom0`.

`
# /etc/init.d/xend start
# xm list
`

Next tutorial on how to create a `domU` and then move on to more exciting stuff such as DRTM!


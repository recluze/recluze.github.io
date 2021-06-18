---
layout: post
title: Writing a Skeleton Linux Security Module
date: 2010-05-23 11:14:38.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Articles
- Geek stuff
- Linux
- Tutorials
tags: []
meta:
  _wpas_done_all: '1'
  _edit_last: '2'
  video_type: "#NONE#"
  Image: ''
  original_post_id: '1013'
  _wp_old_slug: '1013'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2010/05/23/writing-a-skeleton-linux-security-module/"
---
I recently had to write a Linux Security Module (LSM) for one of my research projects and I was surprised to find that there are few tutorials out there and most of them don't work because of the discrepencies in kernel versions. They're talking about 2.000.x kernel versions! The only good tutorial I came across was the one on [Linux Journal](http://www.linuxjournal.com/article/6279) but it assumed some background knowledge (which I didn't have). So, I had to struggle for a day to figure out how to go about writing the LSM. Hence, this tutorial.

Now, this isn't strictly a newbie tutorial. It isn't even a tutorial per se. It's more like a guideline that will tell you where to look to find what you need. The reason is that if I write something specific, it'll go out-of-date in a giffy. So, I'll tell you the process of how I figured out the steps and you can (probably) reproduce them even if the specifics have changed. This might not be the best way to do it but it certainly gets you going. I had to take quite a few detours to get to these steps; so they might save you some time. Ok, let's go.  
<!--more-->

First, I read up on what an LSM is. (If you're reading this, you probably know what it is.) Then, I came across the tlj link I mentioned [earlier](http://www.linuxjournal.com/article/6279) and read what `register_security` function, `security_operations` struct and others do.

Then, I went ahead and created a directory in the security folder of the linux kernel source. (I used linux-2.6.33.3, so the I'll assume the source is sitting in `/usr/src/linux-2.6.33.3`) Assume the name of the LSM is `blabbermouth` (since it does nothing but printk the hooks).

To tell the kernel build about your LSM, I needed to do three things: (1) Create a Makefile. That's simple. See [this archive](http://sites.google.com/site/naumanrecly/Home/blabbermouth.tar.gz?attredirects=0&d=1) for the files and patches. (2) Create a Kconfig file. Again, fairly straight forward for a skeleton LSM. (3) Tell the security Makefile and Kconfig files about my LSM i.e. Edit `security/Makefile` and `security/Kconfig`. (See the two patch files in the archive to figure out where to insert the new lines.)

Once that is out of the way, I needed the actual source of the LSM. So, I created the blabbermouth.c fie. Now, the first thing was to create an instance of the security\_ops structure. This is complicated because there are several fields in this and if you don't have a good IDE, this is going to be tough. Of course, you have the kernel source so you can simply "borrow" code from elsewhere. I went to `security/selinux/hooks.c` and copied me a nice tidy `security_operations` struct (you can find it right at the bottom). Of course, it points to different functions in the same file so I got those too. By the way, you can find the declaration of the `security_operations` structure in `include/linux/security.h`

Changed all the `selinux_*` function names to `blabbermouth_*` function names and replaced the bodies of all these functions with a `return 0`; Hence the name "skeleton LSM". I also inserted some printk statements just so that I'd know that the thing was working.

Of course, when you're working with the kernel, you have to make sure you cater to the configurations. So, I surrounded the relevant portions with the `#ifdef CONFIG_SECURITY_BLABBERMOUTH` and `#endif` to make sure it only gets built if configured as such.

Once that is out of the way, I created a new initialization function with `void __init blabbermouth_init` and told the module to call it on initialization through `module_init` macro. Also created an `__ exit blabbermouth_exit` function and registered it through `module_exit`.

Phew. That was fun. Now, back to make menuconfig and selected the blabbermouth module from the security page.

Make, make modules\_install and make install and I was good to go. Felt good to see the blabbermouth outputs in `dmesg`.


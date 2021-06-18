---
layout: post
title: Getting Started with Android Dev Phone 1
date: 2009-07-16 03:09:13.000000000 +06:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Geek stuff
- research
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
permalink: "/2009/07/16/getting-started-with-android-dev-phone-1/"
---
We received our Google Android Dev Phone 1 yesterday and immediately ran into trouble. We don't have a supported carrier here and we couldn't get our own carriers to work with Android because we didn't have the APN information. Android's distro that comes bundled into the Dev Phone won't let you in without an APN&nbsp; though. You get a "SIM not found" message and you can't do anything other than dial an emergency number. So, after searching for a while, I found some useful tips for getting around the problem.

First, you need to plug in your phone through the provided USB. If you're running XP, the device will probably not be recognized. (It wasn't for me.) So, download the Android phone driver [here](http://recluzepage.googlepages.com/android_usb_windows.zip) (or [here](http://href.to/eNE)) and install it when XP asks to search for a driver. (Thanks to [anddev](http://www.anddev.org/debugging-installing_apps_on_the_g1_windows_driver-t3236.html) for this information.) After that, get the Android SDK from [here](http://developer.android.com/sdk/). Go to command prompt and navigate to the tools directory in the SDK. Then execute these commands.`
`

`adb shell
su
cd /data/data/com.android.providers.settings/databases
sqlite3 settings.db
INSERT INTO system (name, value) VALUES ('device_provisioned', 1);
.exit
reboot
`

Once the device finishes rebooting,`
`

`adb shell
am start -a android.intent.action.MAIN -n com.android.settings/.Settings
`

Many thanks to [Android Tricks](http://android-tricks.blogspot.com/2009/01/using-adp1-without-sim-card.html) for writing this tip.

**Update 1:** Android SDK ships with the latest version of the windows Android phone driver. You can find it in $ANDROID\_SDK\_HOME/usb\_driver. So, you don't need to download the driver using the links provided above.

**Update 2:** To get the Android device to work on Ubuntu 9.04 Jaunty Jackalope, you need to perform the following steps:

1. `sudo nano /etc/udev/rules.d/51-android.rules`
2. Add this line to the file: `SUBSYSTEM=="usb", ATTRS{idVendor}=="0bb4", MODE="0666"`  
(You can get the 0bb4 value from lsusb for High Tech Corporation (i.e. HTC) if you work with a different phone)
3. `sudo chmod a+rx /etc/udev/rules.d/51-android.rules`
4. `sudo /etc/init.d/udev restart`
5. `adb devices` (to see the device)

---
layout: post
title: Flashing Android Dev Phone 1
date: 2009-07-20 04:15:36.000000000 +06:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Android
- Articles
- Geek stuff
- research
- Tutorials
tags: []
meta:
  _wp_old_slug: '1013'
  original_post_id: '1013'
  _oembed_9a0a32ac9a0a671f389419fa6484412d: "{{unknown}}"
  _oembed_37e59331626a13a5a2dd2ccc468ba9e7: "{{unknown}}"
  _oembed_f5b0d64331ff7b9d7d6c27738070e29d: "{{unknown}}"
  _edit_last: '2'
  _wpas_done_all: '1'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2009/07/20/flashing-android-dev-phone-1/"
---
This tutorial is about flashing your Android Developer Phone 1 with your own custom build. It will provide a concise description of steps involved along with a special portion on how to port Google's apps on your custom build. I found that particularly troublesome with little help on the Internet. So, that will be a bonus :)

**First the disclaimer:** This is for your Android Dev Phone 1 (ADP1). If you're using T-Mobile's SIM/firmware locked phone, stop. This tutorial is not for you. If you're using ADP1, proceed at your own risk. You may brick your phone if you do something wrong and I shall not be held responsible for it. Finally, you might want to [backup your factory-provided image](http://antonmelser.org/open-source/backup-install-restore-adp1.html). I don't think it's really necessary because you can just flash it again using the [HTC provided images](http://www.htc.com/www/support/android/adp.html).

So, here is how it's done:

<!--more-->

1. First, you need to download the android source code as here: [http://source.android.com/download](http://source.android.com/download). It's fairly straight forward and doesn't require much thought. Just follow the instructions but try to see how things are working because you'll need to understand it for gaining a full appreciation of later steps.
2. After the final 'repo sync', do not 'make' the source. You need to customize the build for your ADP1. Go [here](http://source.android.com/documentation/building-for-dream) and get the local\_manifest.xml file. There's some problem with the manifest file and it didn't work for me with the master, cupcake or donut branch of android. Here's what you need to do:
  - Remove the \<remove-project\> tag from the manifest file you just downloaded. There's no such project as kernel in the source!
  - Change the 'platform/vendor/htc/dream' project name to 'platform/vendor/htc/dream-open'
  - Put the manifest file in '.reop' directory in your android source (I'm assuming it's in '/mydroid')
3. There are some proprietary binaries that you need to extract from the phone device. Connect the device to your system as described [here](http://recluze.wordpress.com/2009/07/16/getting-started-with-android-dev-phone-1/). Then, go to 'vendor/htc/dream'&nbsp; and run './extract-files.sh'.
4. In your android source directory, run 'echo TARGET\_PRODUCT:=htc\_dream \> buildspec.mk'. This tells the make scripts to build for htc\_dream device.
5. Finally, 'make'.
6. After the making is done, you'll have the final images in 'out/target/product/dream'. Go in that directory.
7. Reboot the device while holding down the camera button. You should see a screen that has android bots on skateboards. Connect the device to the PC with a USB and hit the back button on the device. You should see the 'serial0' message change to 'fastboot'. (If it doesn't, hit back a few more times.)
8. From the PC, issue the following command:
  - sudo /mydroid/out/host/linux-x86/bin/fastboot flash system system.img

  - sudo /mydroid/out/host/linux-x86/bin/fastboot flash boot boot.img

  - sudo /mydroid/out/host/linux-x86/bin/fastboot flash userdata userdata.img
  - sudo /mydroid/out/host/linux-x86/bin/fastboot reboot
9. After the machine reboots, you should have your own build running on the device!

You'll notice that there are no Google applications on the device -- no Market, no Gmail, no Maps, no Talk, no Youtube. Android doesn't look so good without all those applications and you can't even go to the Market to get the cool new apps. That simply won't do, would it. As I promised I'll show you how to port Google apps on to the phone, here it goes:

1. Perform steps 1 - 5 above to get the final images. Then, remove the images! Hold on now. We'll be making those sweet images in a minute. There are some things that we need to put in the image first. Something we don't have the source of but we can get hold of the binaries. Go to the [HTC page](http://www.htc.com/www/support/android/adp.html) and get their recovery image. Not the system image, mind, but the recovery image.
2. Open the image in the archive manager and navigate to 'system/app' directory. Extract the following files from the image to '/tmp/system-apps':
  - checkin.apk
  - Gmail.apk
  - GmailProvider.apk
  - GoogleApps.apk
  - GoogleContactsProvider.apk
  - GooglePartnerSetup.apk
  - GoogleSearch.apk
  - GoogleSettingsProvider.apk
  - GoogleSubscribedFeedsProvider.apk
  - gtalkservice.apk
  - HtcLog.apk
  - ImProvider.apk
  - Maps.apk
  - NetworkLocation.apk
  - SetupWizard.apk
  - Street.apk
  - Talk.apk
  - Vending.apk (This here is the Market!)
  - VoiceDialer.apk
  - VoiceSearch.apk
  - YouTube.apk
  - (All these applications are hopelessly interlinked and if you miss one, you're sure you get a host of exceptions thrown at you at runtime. It caused me no small amount of headache when I was trying to get this to work.)
3. Then, go to 'system/framework' in the same archive and extract these files to '/tmp/system-framework':
  - com.android.im.plugin.jar
  - com.google.android.gtalkservice.jar
  - com.google.android.maps.jar
  - (these are the libraries with which different apps are linked.)
4. Last, get the files 'com.google.android.gtalkservice.xml' and 'com.google.android.maps.xml' from '/system/etc/permissions' from the archive and put them in '/tmp/system-perms'.
5. Delete the files 'out/target/product/dream/obj/PACKAGING/systemimage\_unopt\_intermediates/system.img' and 'out/target/product/dream/system.img'
6. Move all the files from '/tmp/system-apps/' to 'out/target/product/dream/system/app', from '/tmp/system-framework' to 'out/target/product/dream/system/framework' and from '/tmp/system-perms' to 'out/target/product/dream/system/etc/permissions'. This will add the files to the image when we create it using make again.
7. Now, go back to the android source home and 'make'. It takes very little time :)
8. Now, flash the images as before (Steps 6-9 above).
9. You should now have all the Google apps working on your custom build.

Let me know if there are any problems. I might not be able to help but I can certainly take wild guesses. :)


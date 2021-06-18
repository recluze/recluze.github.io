---
layout: post
title: Quoth Ubuntu, 'Nevermore'
date: 2010-08-24 13:31:00.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Geek stuff
- Linux
tags: []
meta:
  _wpas_done_all: '1'
  _publicize_pending: '1'
  _edit_last: '2'
  _wp_old_slug: '455'
  original_post_id: '455'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2010/08/24/quoth-ubuntu-nevermore/"
---
I installed Ubuntu two days ago and was surprisingly pleased by the responsiveness and general outlook of the OS. I spent a day getting everything just the way I like. It booted up really fast and I was very pleased with the improvements in the user interface that have come about since the last time I used it. Ubuntu has surely come a long way from 8.04 to 10.04.1.

I did have two problems though. The first one is sad so I would mention that in brief. The wireless connection drops when we have a power outage. No problem there since the wireless router goes off but when the power comes back on and the wireless network becomes available, Ubuntu refuses to connect automatically. Turns out, it's a 'known bug' and there are many 'working scripts' to fix it -- none of them seem to work, by the way. Ubuntu will either require me to click on connect manually or require that I enter the password that I have saved in the connection manager. In any case, it needs some sort of interaction. Anyhow, I decided I can live with this and moved on. Then came the second problem that's the subject of this post. This requires that I go back to my story.

To get back to my narrative, one of the things that I absolutely have to set up is the 'power setting' on my laptop. See, I leave my laptop on at night and it sits right next to me while I sleep. So, not only does it have to not go to sleep because of the downloading going on, it also must be unobtrusive and not wake me up. So,&nbsp;I set up my download managers and the power settings on Ubuntu so that the screen will be put to sleep after a minute of inactivity. I check it to make sure it works. I go to sleep only to wake up after an hour or so because -- surprise -- my laptop display is still on!

Surprised because I just checked that it worked, I re-checked the settings to make sure I had them right. They were indeed correct. So, slightly annoyed by this time, I search the internet and lo and behold: it's another known bug. Turns out, there's a script you can write and 'chown' it and create a cron job for it that will turn the screen off. Problem is, it doesn't work. So, I search some more and find out that I can 'xset dpms force off' to turn the screen off manually. Fair enough. I create a little shortcut for the command, hit the icon and the screen goes off. Finally, I can get some sleep. I lie down and am just about to drift off to sleep when the screen comes back on like a zombie raised from the dead. I'd finally had enough and decided to let it rest. I covered my eyes with my hand. That didn't work but as I was about get back up to turn the laptop off, the screen goes off automatically! Guess it had had enough fun for the day.

Poe had his insomniac raven; I have Ubuntu.

(P.S. To those who are wondering why I couldn't just turn the laptop off in the first place, see the category this post is put in.)


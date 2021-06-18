---
layout: post
title: Matlab 7 under Windows 7
date: 2009-07-30 06:24:04.000000000 +06:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Articles
- Tutorials
tags: []
meta:
  _oembed_9c3aa9b0060a78db802a82b00585da6c: "{{unknown}}"
  _oembed_27fdea4a5032ac8b1ebe046152883833: "{{unknown}}"
  _oembed_7efa5135d1b34c49afd64b8b6a565bf0: "{{unknown}}"
  _oembed_c5b3ee77d57fa46902ddf398741131a3: "{{unknown}}"
  _oembed_826c851d919b024184be20cf841f8a27: "{{unknown}}"
  _wp_old_slug: '1013'
  original_post_id: '1013'
  _oembed_6e96560e9d53e0bf274abff66fa367cb: "{{unknown}}"
  _oembed_00ae8829b4319afcc8907439dbf9907a: "{{unknown}}"
  _oembed_4365cf058efb8555edab9c0dfcde4b7c: "{{unknown}}"
  _oembed_0e698864bd234b4ca99d1b6b6040c216: "{{unknown}}"
  _oembed_69314d35a1fdacf67a26c1e788908b66: "{{unknown}}"
  _oembed_f998d25d3b839cc9e4a0b9774adbdca3: "{{unknown}}"
  _edit_last: '2'
  _wpas_done_all: '1'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2009/07/30/matlab-7-under-windows-7/"
---
 **Update:** If you are interested in getting a running start to machine learning and deep learning, I have created a course that I’m offering to my dedicated readers for just $9.99. [Access it here on Udemy](https://www.udemy.com/practical-deep-learning-with-keras/?couponCode=RECLYBLOG). If you are only here for Matlab, continue reading =]

I had trouble getting Matlab 7 to work with Windows 7 RC even after setting the compatibility options. So, after a bit of search, here's the solution (copied from ELFEHRIJ on [http://bit.ly/Jt7ij](http://bit.ly/Jt7ij) with some minor changes).

After installing Matlab (use Classic Windows Theme if you have problems with the installer):

1. To use Matlab with other windows 7 themes you have to change Java VM used by matlab.
2. Download latest Java version and install it.
3. Go to&nbsp; \<Matlab-installation-dir\>\sys\java\jre\win32 you will find a folder named jre1.5.0\_07 (or a similar version). Rename it to Original\_\<whatever was originally there\>
4. Go to C:\Program Files\Java you will find file named jre6. Copy it to \<Matlab-installation-dir\>\sys\java\jre\win32 and rename it to \<original jre directory name\>

This will ensure that Matlab uses the new JRE instead of the old one. Just start Matlab now!

_Update_: Thanks to "ra" and larry for the corrections.


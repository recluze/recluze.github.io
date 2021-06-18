---
layout: post
title: More evidenve in favour of browser based "AJAX"
date: 2005-08-18 08:36:00.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories: []
tags: []
meta:
  _wpas_done_all: '1'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2005/08/18/more-evidenve-in-favour-of-browser-based-ajax/"
---
Here's a lil more evidence in favour of my [last post](http://recluze.blogspot.com/2005/08/ajax-is-it-really-that-hot.html). This is Scott Isaacs, a web guru, [talking](http://www.25hoursaday.com/weblog/PermaLink.aspx?guid=23a58e59-0a8d-43e4-ab18-a6d64ca5be87) about the problems faced during development of AJAX based apps.

> However if you are building a large scale web application there is more to consider when using AJAX than how to create [a function that hides the differences between the XMLHttpRequest object in IE and Firefox](http://developer.apple.com/internet/webcontent/xmlhttpreq.html). Problems that have to be solved [or at the very least considered] include
> 
> 1. How to abstract away browser detection from each page in the application 
> 2. How to make the site accessible or at least work on non-Javascript enabled browsers 
> 3. How to efficiently manage the number of connections to the server created by the client given the "chattiness" of AJAX applications compared to traditional web applications 
> 4. How to reduce the amount of time spent downloading large script files 
> 5. How to create permalinks to portions of the application 
> 6. How to preserve or at least simulate the behavior of the browser's 'Back' button

Now, see: If the browser based Partial Content Update was done, almost all of these problems will be abstracted out. The browsers (already optimized for most of this stuff) will handle the requests allowing easy devlopment for the web app developers.


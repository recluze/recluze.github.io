---
layout: post
title: 'AJAX: Is it really that hot?'
date: 2005-08-16 21:57:00.000000000 +05:00
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
permalink: "/2005/08/16/ajax-is-it-really-that-hot/"
---
I've been reading a lot about this AJAX (Asynchronous Javascript and XML). Just recently I discovered the process by which it works and I was astonished to see that it took people so long to actually realize this possibility. I'd put forward this proposal quite a long time back (Althoug I must admit - not that seriously) of loading only partial content in a webpage much like in frames.

(For those of you who have no clue what AJAX is, here's a link: [AJAX tutorial](http://www.pixel2life.com/twodded/t_ajax_asynchronous_javascript_and_xml_using_php_to_send_data_/). Google's Gmail and A9.com are taking this quite far)

Anyway, the purpose of this post is to point out another way to do the same thing.

Here's the thing: The purpose of AJAX is to load partial content into an HTML page (basically inside a div's innerhtml). This is done through Javascript's XMLHttpRequest object. The browser loads the xml that is requested by the javascript and then the javascript loads it into a div's innerhtml (or whereever, for that matter).

Now, here's another option for doing this whole thing that takes at least a few lines of javascript code:

> \<a href="codepage.php?var=value" target="divName"\> Click here to load VAR\</a\>

Now, I know that this can be a little difficult when the variable's value has to be decided by javascript but even then, why not just set a property 'location' of a div to the desired URL instead of going through the XML routine. This would:

1. Enable easier creation mechanism (even for novice web designers who aren't good with Javascript). 
2. Let the browsers do what they're good at! Fetching and displaying data. 
3. Not just XML but any form of data, specially binary data can also be retreived on-the-fly. 

To explain 3:

> \<a href="nextCar.png" target="imageID"\> Next Car \</a\>

The same dynamics work for any HTML tag.

Another option can be to set not just the default property but ANY property of ANY HTML element.

> \<a href="divStyle.php" target="DivID.Style"\>Change  
> Style\</a\>

I'd love to see comments on this post. Tell me if I'm mistaken. Tell others if I'm right.


---
layout: post
title: Venturing into Arabic Font Design
date: 2010-09-14 08:41:39.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Geek stuff
- resources
- Typography
tags: []
meta:
  _wpas_done_all: '1'
  _publicize_pending: '1'
  _edit_last: '2'
  _wp_old_slug: '465'
  original_post_id: '465'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2010/09/14/venturing-into-arabic-font-design/"
---
I started using Arabic (and Urdu) scripts quite a while ago. I came across the whole non-latin script problem when I was developing a software for a government agency related to land revenue. In the development of this software, I found myself learning about alternative keyboards and Asian language support in Windows. I also found out about the excellent research going on in FAST-NU Islamabad related to Urdu language support for computers. As an aside, I encourage all readers to go read about their work on [CRULP](http://crulp.org/ "Center for Research in Urdu Language Processing") and see the Naskh, Web Naskh and Nastaliq fonts they've developed and released free of charge. They've done a truly great job and none of my comments in the rest of the post should be taken as an offense to them or their work.<!--more-->

So, coming back to the point, I've worked with lots of Arabic and Urdu language fonts since I started using these languages. However, I soon saw a huge gap in the typography of Latin and Arabic script. First and most importantly, formal literature has very little information about Arabic typography. This is very unfortunate given the excellent work that has been carried out in the past by Arabic typographers throughout history. I remember seeing a program back when I was a kid that taught the theory of Urdu Nastaliq script typography. I can't seem to find any of that theory on the Internet. (By the way, if any of you know about the availability of such theory online, do let me know.) I also have a strong feeling that the concepts of typography such as kerning would need to be significantly revised if they have to be applied efficiently to Arabic scripts. It's simply not sufficient to define ligatures and multiple glyphs for 'Asian' languages in OpenType and be done with it. That is the way Microsoft have approached this problem.

Don't get me wrong. I love the Arabic/Urdu fonts by Microsoft, Adobe and CRULP: Arabic Typesetting, Adobe Arabic and Nafees Naskh. They're very usable. However, settling for these fonts would be the equivalent of refraining from defining new English fonts simply because Helvetica is beautiful and highly legible. There are conditions that simply require a different font-face. As [Fawzi Rahal](http://fawzi.me/blog/2009/04/12/29-broken-letters) put it, how come Latin scripts have proportional, monospace, script, san-serif and serif (etc.) while Arabic only has a single font family! It's a one-fits-all font family that is used in corporate sites and entertainment portals alike. Why can't we have a different font for different scenarios. Now, I know that Adobe (and Linotype) have provided some great Arabic fonts. I've seen many of them but most of them are either too decorative for normal use or lack severely in legibility.

So, keeping all these things in mind (and the fact that I have tons of time on my hands at the moment), I decided to work on the creation of a new font for Arabic (and Urdu by extension). For those of you who know nothing about font design: it's a daunting task! Creating a new font for the English language is difficult but if you don't define standard and/or discretionary ligatures, it's a matter of creating 50 or so glyphs and you're done. Arabic scripts are a different story altogether. You need to define many combinations of letters even for the standard glyph set. Also, kerning definitions are a real pain. Even so, I read somewhere that to create a good font, you need an experience of roughly 5-7 years in typography! I, of course, have no such experience. I have the basics but I am no expert. That is why my first attempt failed miserably!

What was my first attempt? I started from scratch, learned the tools (Fontlab and Illustrator combo) and started designing the ligatures for the _mufrid_ (singular) letters. I got only as far as _alif_, _bah_, _jeem_ and _daal_ when I noticed that the font looked horrible! It was so bad that I can't even dare post a shot here. In fact, it was so bad that I decided I couldn't do this thing and gave up.

Two days later, I saw this beautiful Arabic script in a book I was reading. It was hand-written (as quite a few Urdu books are even now) and it was simply beautiful. I wondered why I can't work with this face instead of creating my own. So, began Attempt Number 2.

I already have the tools learned. I know the technologies, the workflow and the jargon. What I needed was an eye for typographic design. I got that from this book. For your information, this book is 'Ahsan-ul-Fatawa' by Mufti Rasheed Ahmad (RA) and the _katib_ (text writer) is 'Munshi Muhammad Farooq S'aood-abad'. See an extract of his writing in the image below. (Notice the extremely beatiful effect achieved by optimal kerning.)

[caption id="attachment\_466" align="aligncenter" width="500" caption="Script of Munshi Muhammad Farooq S'aoodabad (Click for larger) "][![]({{ site.baseurl }}/assets/images/2010/09/munshi-script.jpg "Script of Munshi Muhammad Farooq S'aoodabad")](http://www.csrdu.org/nauman/wp-content/uploads/2010/09/munshi-script.jpg)[/caption]

In designing this font, I have two objectives:

1. Keep the base line, ascenders and descenders in accordance with traditional scripts. That is one of the things that Microsoft's Arabic Typesetting font really fails at. The eye simply doesn't feel comfortable with the descenders. Adobe Arabic is a little better though.

2. Focus on the kerning! Bad kerning metrics are probably the most important reason why modern computer fonts (both Arabic and Urdu) look horrible. Pick up any Urdu book and see the spacing between letters and words. Horrible!

Keeping these in view, I began with the script written by Munshi Farooq sahib -- I named it _Arabic&nbsp;Ahsan_. I took pictures -- I don't have access to a scanner -- of some of the letters and started sketching. After lots of image cleaning up, sketching and some improvisation, I managed to get three letters into the font. These are the mufrid _alif_, _bah,_ _jeem_, _daal_, _laam_ and _noon_ and here they are. See the images and compare them with the typography of Munshi sahib in the image above. I've tried to restrict myself to his script as much as possible and not introduce any of my own ideas. (I've also included Adobe Arabic and Arabic Typesetting glyphs for reference. Click on thumbnails for larger images.)

[caption id="attachment\_467" align="aligncenter" width="300" caption="Alif (From left: Arabic Ahsan, Adobe Arabic and Arabic Typesetting. Click for larger image)"][![]({{ site.baseurl }}/assets/images/2010/09/ahsan-v1-alif-300x106.jpg "Alif (Click for larger image)")](http://www.csrdu.org/nauman/wp-content/uploads/2010/09/ahsan-v1-alif.jpg)[/caption]

[caption id="attachment\_468" align="aligncenter" width="300" caption="Beh (Click for larger image)"][![]({{ site.baseurl }}/assets/images/2010/09/ahsan-v1-beh-300x115.jpg "Beh (Click for larger image)")](http://www.csrdu.org/nauman/wp-content/uploads/2010/09/ahsan-v1-beh.jpg)[/caption]

[caption id="attachment\_469" align="aligncenter" width="300" caption="Daal (Click for larger image)"][![]({{ site.baseurl }}/assets/images/2010/09/ahsan-v1-daal-300x115.jpg "Daal (Click for larger image)")](http://recluze.files.wordpress.com/2010/09/ahsan-v1-daal.jpg)[/caption]

[caption id="attachment\_470" align="aligncenter" width="300" caption="Jeem (Click for larger image)"][![]({{ site.baseurl }}/assets/images/2010/09/ahsan-v1-jeem-300x115.jpg "Jeem (Click for larger image)")](http://www.csrdu.org/nauman/wp-content/uploads/2010/09/ahsan-v1-jeem.jpg)[/caption]

[caption id="attachment\_471" align="aligncenter" width="300" caption="Laam (Click for larger image)"][![]({{ site.baseurl }}/assets/images/2010/09/ahsan-v1-laam-300x115.jpg "Laam (Click for larger image)")](http://www.csrdu.org/nauman/wp-content/uploads/2010/09/ahsan-v1-laam.jpg)[/caption]

[caption id="attachment\_472" align="aligncenter" width="300" caption="Noon (Click for larger image)"][![]({{ site.baseurl }}/assets/images/2010/09/ahsan-v1-noon-300x115.jpg "Noon (Click for larger image)")](http://recluze.files.wordpress.com/2010/09/ahsan-v1-noon.jpg)[/caption]

I'm still working on this project but for now, I have only gotten thus far. So, it's not a usable font right now. Why did I rant on for so long then, you ask? Well, for one, I wanted to get opinions about the letters as I design them. It's no good spending a year designing this thing and then getting a total zero feedback. Secondly, I wanted to put this online so that I can get the motivation required to keep moving. I don't expect to get paid from this effort and would therefore require all the push I can get. Third, and most important reason, is that I wanted to provide young (and experienced) designers and typographers to look at this and if possible contribute. As I mentioned earlier, this is a huge task and if I keep on it alone, it's going to take me ages.

So, if you have any opinions, let me know. If you want to participate that would be even better. I can provide the tools and the training. I can provide the resources and I can help you learn this very important field of computer science. Arabic is one of the most widely used languages in the world and because of the rise of computer science applications in Saudi Arabia, UAE and other Arab countries, any effort you put into it is bound to pay off very handsomely. And if you are a muslim, I don't have to tell you about the other benefits of contributing to the language.

Oh and this is the first project I'm starting from [CSRDU](http://www.csrdu.org)'s platform.


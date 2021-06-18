---
layout: post
title: Thoughts on Z
date: 2007-06-12 04:58:56.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Formal Methods
- Z Notation
tags: []
meta:
  _oembed_3ee43e56f6307295a9c1225a534c5307: "{{unknown}}"
  _wpas_done_all: '1'
  _oembed_8860844c88cf2452e4865c13de5f1a78: "{{unknown}}"
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2007/06/12/thoughts-on-z/"
---
I've worked with Z notation now for a complete specification and here are my thoughts regarding the experience.

1. Now I know why Z is losing clientelle and why software engineers are reluctant to use it in practical scenarios. It has all the problems normally associated with structural programming approach and none of the benefits. It also has all the drawbacks of formal methods and almost none of their benefits.
2. It's difficult to organize your thoughts when you're working with a large enough specification. I saw this in the Usage Rights Document and I've seen it in my own work. The individual parts are easier to understand and keep track of but it's much more difficult to keep the big picture in sight.&nbsp;
3. In my opinion, the semi-formal methods (such as UML+OCL approach) or the purely formal methods (such as those supported by Isabelle) are a much better way to go. I have seen the theory HOL-OCL (along with the complete architecture) developed by the guys at ETH, Zurich and I like that approach. It is a more streamlined approach and one that is more likely to be accepted by the industry. I'm not the only one to think along these lines either. The introductory parts of the HOL-OCL book describe why exactly Z has never gained support from the industry and why UML+OCL have succeeded in doing so. 

I've started working on HOL-OCL and I'll be reporting my findings and thoughts related to this approach. I know this is yet another shift in direction for me but I believe it's necessary to try all options and then stick to one. These are just tools and my experience with each passing tool has taught me that the glue in all these formal methods nowadays is Isabelle.

> [Mirror post on [http://securityengineering.wordpress.com](http://recluze.wordpress.com/)]


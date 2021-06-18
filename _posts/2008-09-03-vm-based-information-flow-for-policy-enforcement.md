---
layout: post
title: VM-based Information Flow for Policy Enforcement
date: 2008-09-03 09:05:49.000000000 +06:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- research
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
permalink: "/2008/09/03/vm-based-information-flow-for-policy-enforcement/"
---
_Regarding paper titled "A Virtual Machine Based Information Flow Control System for Policy Enforcement" by Nair et al.&nbsp;_

Nair et al. present an information flow control system which addresses the issue of implicit information flows using an extension of the Kaffe JVM. _Trishul_ is implemented by extending Java Stack and Heap structures. The resulting framework is capable of dynamically assigning labels to objects and propagating these labels based on information and control flow. Label or "Taint" propagation is based on the _Lattice based Information Flow Model_ by Denning.


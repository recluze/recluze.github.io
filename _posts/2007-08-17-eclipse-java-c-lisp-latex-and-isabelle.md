---
layout: post
title: Eclipse, Java, C++, Lisp, LaTeX and Isabelle
date: 2007-08-17 11:07:51.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- C++
- Java
- Lisp
- resources
- Softwares
tags: []
meta:
  _wpas_done_all: '1'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2007/08/17/eclipse-java-c-lisp-latex-and-isabelle/"
---
I've recently re-discovered Eclipse. My first encounter with it was back when I was learning Prolog. I worked with it and while I liked the work-flow, I never got to using it full-time. It's back and it's staying.

Most people may think of Eclipse as simply a Java IDE but there's a lot more to it that just that. Eclipse is at heart, a plugin framework and is very very extensible. Let me tell you why:

I've configured Eclipse to work as my primary C++ IDE, as my primary Lisp IDE, as my thesis word processor using LaTeX and am working on using it for as my Java IDE too. Now, I may be wrong but there's no other IDE which can do all this.

As an example, see how easy it is to get Lisp working in Eclipse on Linux.

- Download [CUSP](http://www.paragent.com/lisp/cusp/cusp.htm) plugin for Eclipse
- Extract the contents of the archive
- Copy the folder jasko.tim.lisp to the plugins folder of Eclipse
- The Lisp distro used is SBCL which sits in the sbcl sub-folder
- Create a symbolic link to sbcl executable in someplace accessible globallly:

`ln -s /usr/share/eclipse/plugins/jasko.tim.lisp/sbcl/sbcl /usr/bin/sbcl`

- assuming you installed Eclipse in /usr/share
- Start Eclipse and [change perspective](http://www.sergeykolos.com/cusp/intro/) to Lisp.

Six easy steps and you have a lovely Lisp IDE. Oh, and if you're worried about Java being a "slow" language, you haven't been around the latest JREs. Get the latest JRE and try Eclipse. You'll love it.

Now, if I can only get my Isabelle to work with Eclipse! Yes, there is a plugin that does this. It's just too crude right now.


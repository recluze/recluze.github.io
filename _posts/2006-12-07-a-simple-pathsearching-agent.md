---
layout: post
title: A Simple PathSearching Agent
date: 2006-12-07 06:41:25.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Artificial Intelligence
- Java
- Softwares
- Students
tags: []
meta:
  _wpas_done_all: '1'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2006/12/07/a-simple-pathsearching-agent/"
---
I've recently started working on Intelligent Agents. I chose to work with Java because I'm more confortable with object oriented approaches and there's more AI literature based on Java than any other language.

As a beginning, I chose an exercise in AIMA and implemented it in Java. The framework of the Agent and its Environment is based on Ravi Mohan's code. (I did have to make a few minor changes to make it work for me.)

![]({{ site.baseurl }}/assets/images/2006/12/pathsearch_shot.gif)

The agent works in a dynamic environment and is not given full information regarding the environment. It has to keep track of known hurdles and update them based on the percepts passed to it as it moves around. It uses A\* search strategy for calculating the path.

The architecture is capable of accomodating more than one agent but as of now, the environment has only one agent.

Download the JAR from [here](http://recluzepage.googlepages.com/pathsearch_jar.rar) and the full source code from [here](http://recluzepage.googlepages.com/pathsearch_src.rar). You need JDK/JRE 5.0+ to use both of these.


---
layout: post
title: Creating UML Sequence Diagrams with TikZ in LaTeX
date: 2011-11-24 13:43:20.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Design
- Geek stuff
- LaTeX
- Tutorials
tags: []
meta:
  _wpas_done_all: '1'
  _edit_last: '2'
  _s2mail: 'yes'
  _syntaxhighlighter_encoded: '1'
  videourl: ''
  original_post_id: '740'
  _wp_old_slug: '740'
  _publicize_job_id: '14633431740'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2011/11/24/creating-uml-sequence-diagrams-with-tikz-in-latex/"
---
 **Update:** If you are interested in getting a concise intro to LaTeX along with my tips on best practices, [checkout my course (for just $12.99) on Udemy here](https://www.udemy.com/latex-for-everyone-and-everything/?couponCode=RECLUZE-Q-OFF).

I've been working on my LaTeX skills for some time. The goal is to move towards an all-latex solution for writing research papers, slide sets and other documents. I'm almost there. An important goal was to be able to create all sorts of figures within LaTeX. (Well, originally, the goal was to use open source softwares to create them but it turns out that LaTeX is really good at this stuff.) The package that I'm using for graphics creation is TikZ. Here we'll cover how we can create sequence diagrams using TikZ and a plugin package.

Here's what we're planning on creating.

[caption id="attachment\_743" align="aligncenter" width="375"][![]({{ site.baseurl }}/assets/images/2011/11/tikzseq.png "Sequence Diagram using TikZ")](http://recluze.files.wordpress.com/2011/11/tikzseq.png) Sequence Diagram using TikZ (click to enlarge)[/caption]

<!--more-->

First, you need to get the `pgf-umlsd.sty` file from over [here](http://code.google.com/p/pgf-umlsd/) and put it in a folder. Then, create your minimal working example (main document) using the following code.

[sourcecode language="latex"]  
documentclass{article}  
usepackage{tikz}  
usetikzlibrary{arrows,shadows}  
usepackage{pgf-umlsd}

begin{document}

begin{sequencediagram}  
newthread[white]{u}{User}  
newinst[3]{b}{Browser}  
newinst[3]{t}{TPM}  
newinst[3]{p}{TTP}

begin{call}{u}{Init()}{b}{}  
end{call}

begin{call}{u}{AIKAuthSecret}{b}{}

mess{b}{verifyAIKAuthSecret}{t}

begin{call}{b}{get AIK$\_{pub}$}{t}{AIK$\_{pub}$}  
 end{call}

end{call}  
 begin{sdblock}{Loop}{}

begin{call}{u}{Do Something}{p}{AIK$\_{pub}$}  
 end{call}  
 end{sdblock}  
end{sequencediagram}

end{document}  
[/sourcecode]

As you can see, the pgf-umlsd package is really awesome. You first create a new thread using the syntax `newthread[color]{variable}{ClassName}`. Then, you create instances using `newinst[distance]{variable}{InstanceName}`. Afterwards, use `call` environment to specify calls. All you need to do is specify the caller, the message label, recipient and return label. Messages are similar and can be done through the `mess` command. You can insert blocks using the `sdblock` environment. All it needs is a label and a description. A block will automatically surround everything within this environment. Oh, and calls can be nested.

If you're like me and don't like your object names underlined, you can pass the `[underline=false]` option to the `pgf-umlsd` package.

p.s. Your output may be a little bit different from mine because I modified the package file to suit my personal liking -- just a bit though.


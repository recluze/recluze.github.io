---
layout: post
title: Inserting Source Code and LaTeX in Wordpress
date: 2010-09-25 10:00:07.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Geek stuff
- resources
- Tutorials
tags: []
meta:
  _wpas_done_all: '1'
  _publicize_pending: '1'
  _edit_last: '2'
  _syntaxhighlighter_encoded: '1'
  _wp_old_slug: '494'
  original_post_id: '494'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2010/09/25/inserting-source-code-and-latex-in-wordpress/"
---
A friend of mine asked me the other day how 'pretty printed' source code can be inserted into wordpress posts. Here's how:

If you have a self-hosted wordpress server, get the plugin 'SyntaxHighlighter Evolved'. Defaults work fine. If you have a wordpress.com account, the plugin is already. For LaTeX, you need the 'WP-Latex' plugin. After that, you can insert the source code using the syntax

[sourcecode language="bash"]  
[sourcecode language="lang"]  
 ... code here (there is no space after the [ in the lines above and below).  
[/ sourcecode]  
[/sourcecode]

You can get a list of [supported languages here](http://alexgorbatchev.com/SyntaxHighlighter/manual/brushes/). Latex code can be inserted using the syntax:

[sourcecode language="bash"]  
$ latex 2^x $  
[/sourcecode]

Again, no space after the $ in the above code. There you go!


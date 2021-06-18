---
layout: post
title: Bash Script to Find and Replace in a Set of Files
date: 2010-12-30 09:24:49.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Geek stuff
- Linux
- Tutorials
tags: []
meta:
  _wpas_done_all: '1'
  _publicize_pending: '1'
  _edit_last: '2'
  _syntaxhighlighter_encoded: '1'
  video_type: "#NONE#"
  Image: ''
  _wp_old_slug: '535'
  original_post_id: '535'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2010/12/30/bash-script-to-find-and-replace-in-a-set-of-files/"
---
Ok, so this might sound childish to the more experienced admins and programmers but I've always found the need to search and replace a string in multiple files. For example, if I have to work with an inexperienced programmer's code, I might have to change the name of the database in a couple of dozen places. If you are in such a place, you might want to try the following script:

[sourcecode lang="bash"]  
for f in submit\_\*;  
 do sed "s/old\_db\_name/new\_db\_name/" \< $f \> a\_$f ;  
 mv a\_$f $f ;  
done  
[/sourcecode]

The first line finds all files that match the pattern submit\_\*. The loop first calls sed, makes the replacement and outputs the file to a\_$f. Finally, it renames the a\_$f file to $f so that we get the original filename. So, there you go. You can make all sorts of complicated finds and replaces through regular expressions and unleash the power of sed on this script. Chao.


---
layout: post
title: Git Introduction
date: 2009-01-20 04:11:41.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Geek stuff
tags: []
meta:
  _wpas_done_all: '1'
  _edit_last: '2'
  original_post_id: '1013'
  _wp_old_slug: '1013'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2009/01/20/git-introduction/"
---
<h2><span class="mw-headline">Difference between SVN and GIT </span></h2>
<p><em>The usual answer</em>: SVN is to GIT what revision control is to distributed versioning system. What in the crack pot is that supposed to mean? The answer is pretty simple: a revision control system keeps the whole revision meta-data in 'one place'. A _distributed_ versioning system allows different developers/users/programmers/organizations create different repositories of their own and merge them to a central server as they see fit. They can even keep the changes to themselves (but that's not the point of it). So, there you go. If you get code off Android's git repo and make changes as you see fit. You can commit changes to your local repo, have revisions, do whatever and keep the changes to yourself. If Android was using SVN and you used that, you'd have to go through a lot of trouble trying to keep the changes to yourself while still using the revisions of Android team.</p>
<p><a name="Some_important_concepts"></a></p>
<h2><span class="mw-headline"> Some important concepts </span></h2>
<p><strong>Clone</strong></p>
<p>When you clone a repo, you take the whole metadata of a remote git repository and store it locally. For example, when you get clone the Android repo from git, you get the meta-data of the whole source in a local repo. (You have to pull the changes to get the actual source, though.)</p>
<p><strong>Commit</strong></p>
<p>When you make a change, you can 'commit' the change and that change gets stored as a revision. A commit in git is recognized by a SHA-1 hash.</p>
<p><strong>Branches</strong></p>
<p>A branch is a specific sequence of commits. An example: The source code is at A, you make some changes and commit to B, then to C and then to D. Afterwards, you create a new branch, switch to this branch, make some changes and commit to P, make some more changes and commit to Q. The revision history would look like so:</p>
<pre>                    P --- Q
                   /
A --- B --- C --- D</pre>
<p>See why it's called a 'branch'?</p>
<p><strong>Pull</strong></p>
<p>A basic pull is simple. It gets the files from the remote git repo and puts them in the local repo. Things get messy when you've actually pulled once, made changes and committed them in the local repo. Let's see how this goes: Taking the previous example of branch further: You cloned a repo at D. You made some changes and now, you're at Q. However, while you were busy making changes upto Q, the rest of the world wasn't asleep. They worked too and they got upto G. Of course, you didn't tell them what you were doing. So, their repo looks like so:</p>
<pre>A --- B --- C --- D --- E --- F --- G</pre>
<p>Now, you're in trouble because you have old copies of some files. You need to get to G without losing changes of Q. You 'pull' and git sees that you've made some changes and upates the repo to look like this:</p>
<pre>                                      P' --- Q'
                                     /
A --- B --- C --- D --- E --- F ---
G

Notice that P and Q are now P' and Q'. That's because P was based off D and P' is branching off G. So, they're not the same. Any-hoo, now you have the latest code \_and\_ your changes.

Oh, and read [these](http://git.or.cz/course/svn.html "http://git.or.cz/course/svn.html") [two](http://smalltalk.gnu.org/blog/bonzinip/using-git-without-feeling-stupid-part-1 "http://smalltalk.gnu.org/blog/bonzinip/using-git-without-feeling-stupid-part-1") tutorials. They're really good. They explain a lot of basic concepts. I'll try to write more when I understand more of git.

You can see a wiki'fied version [here](http://www.imsciences.edu.pk/serg/wiki/index.php?title=Git).


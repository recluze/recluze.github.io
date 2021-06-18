---
layout: post
title: Helpful Tips for Newbie System Admins
date: 2011-01-16 06:58:59.000000000 +05:00
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
  video_type: "#NONE#"
  Image: ''
  _syntaxhighlighter_encoded: '1'
  _wp_old_slug: '549'
  original_post_id: '549'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2011/01/16/helpful-tips-for-newbie-system-admins/"
---
Before you start reading this tutorial, let me remind you once again who the intended audience of this post is -- newbie system administrators. If you're an experienced admin and are going to laugh at my naivete for writing such basic stuff, please go away -- or provide some more 'advanced' tips in the comments below so that I know better for the future.

Anyway, let's begin. If you're like most newbie system admins, you run a windows system on your home PC / work laptop and connect to the servers you're managing using [putty](http://www.chiark.greenend.org.uk/~sgtatham/putty/). Everyone uses putty, you say. Well, yes but there are alternatives. One of the things I hate is to have to copy/paste all the usernames and passwords into that putty session before I can login. So, let's get rid of that first.

<!--more-->

**Saving server login credentials**

While this may not be highly secure, I have come to find that you can save your login credentials on your system unless you're working for a high profile company. If you're just managing the servers for grandmascookingtips.co.bl, it's unlikely that some hacker will hack your laptop to get the server's credentials. So, in order to save yourself from all the login troubles, download [Kitty](http://www.9bis.net/kitty/). Kitty is basically putty but it allows some other functions -- the only one of which I actually use is 'save password'. Download and install kitty and start it as you would start putty. Now, the whole configuration works the same as putty. In the 'Session' pane, enter the IP/hostname of your server, then go to the section 'Data'. Here, you can enter not only the username (as in putty) but also the automatic password. (Of course, if you can, it's much better if you use SSH private key-based authentication but that's not always possible.)  
[caption id="attachment\_552" align="aligncenter" width="466" caption="Saving username/password in Kitty"][![]({{ site.baseurl }}/assets/images/2011/01/kitty.gif "Username/password in Kitty")](http://www.csrdu.org/nauman/wp-content/uploads/2011/01/kitty.gif)[/caption]

Okay, you're logged in and are working happily on compiling that custom Linux kernel when your internet connection dies. Well, that means you go to jail, do not pass Go, do not collect 100 dollars. Your session breaks, all running programs are killed and if you're lucky, you only have to rerun the command and not worry about stale, inconsistent data. Luckily, there are not one but two solutions to this problem!

**Maintaining your session when your ssh connection breaks**

There's this nice little program called [screen](http://www.oreillynet.com/linux/cmd/cmd.csp?path=s/screen) that does a lot of things -- one of these is what we're targeting right now. There are many commands and options but here, I'll cover only the bare essentials to solve the problem at hand.

Here's what you need to do: install screen (yum, apt ... everything works) and type to begin a screen session.

[sourcecode lang="bash"]  
yum -y install screen  
screen  
ls -l /proc  
[/sourcecode]

Type any command with a long output so that your screen scrolls a few lines. Then try to scroll back up. You'll notice that screen discards all the output except that is on the screen right now. That's one drawback but I have found it to be a minor nuisance only.

Now, do whatever you wish to do on your shell. Nothing's changed. Run a command that will take a while and try closing your kitty/putty session using the big cross on the top-right. The session will close but the command will continue to keep running in the background. How do you get back to that 'screen', you say? Connect to the server again and just issue the following command:

[sourcecode lang="bash"]  
screen -R  
[/sourcecode]

Viola! You can see the output exactly as you left it. Of course, this is a lot of work if you're only going to use a single command which is connection sensitive. So, here's method number 2.

**Maintaining your session when your ssh connection breaks - Method 2**

This one's easy. There's a basic command that comes with almost all Linux distros. It's called `nohup` and it basically stands for 'no hangup'. What it does is that it ignores the hangup (kill) signal -- meaning when the session closes, it will receive the kill signal and ignore it. Effectively allowing the command it started to keep running even when the session has closed. Example use:

[sourcecode lang="bash"]  
nohup /usr/local/tomcat6/bin/start.sh \> /var/log/tomcat-nohup.log &  
[/sourcecode]

This will start tomcat and save all the output produced in the log file. It will also move the program to the background so that you can continue with other work. If you want to see the output, you can tail the log file:

[sourcecode lang="bash"]  
tail -f /var/log/tomcat-nohup.log  
[/sourcecode]

Try closing the session and coming back. Pretty handy command.

**Moving around directories**

This trick I found out just yesterday and it's already saved me a lot of time. We all know how you can hit the TAB key to complete directory names, right? Well, it's not that useful when you're trying to setup a server that requires a log of configurations and you have to move back and forth to `/etc/conf/httpd/ext/` and then back to `/usr/local/tomcat6/` again and again. Well, this is where the `cdargs` tool comes in handy. It's a bookmarking tool for the command line! (Never thought I'd hear that one.)

Here's how it works: You install it and then navigate to whatever directory you want to bookmark. You mark it with a name and move away. Then you can just `cdb` instead of `cd` and pass it the bookmark name as a parameter and bam! you're there. It also allows you to browse directories real fast.

Let's install this thing first.

[sourcecode lang="bash"]  
yum -y install compat-libstdc++-296  
wget http://www.skamphausen.de/downloads/cdargs/cdargs-1.31-1.i386.rpm  
rpm -ivh cdargs-1.31-1.i386.rpm  
updatedb  
source `locate cdargs-bash.sh`  
# you can use any method you like for locating this file and running it  
# also, you need to put it in the ~/.bash\_profile to run it every time you login  
echo source `locate cdargs-bash.sh` \>\> ~/.bash\_profile  
cdb  
[/sourcecode]

You can see a listing of your current directory. Use up, down, left and right arrow keys to navigate in the current and child/parent directories. Hit ENTER anytime to drop the shell in the selected directory. Also, you can hit 'A' anytime to mark the directory as a bookmark but this isn't very useful.

Leave `cdb`, navigate to a directory that you want to mark (say, apache conf) and issue the following command:

[sourcecode lang="bash"]  
mark apaconf  
cd /usr/loca/src/  
cdb apaconf  
[/sourcecode]

The parameter of the `mark` command is the name of the bookmark. You can pass this to `cdb` to move quickly to this directory. Add many bookmarks and move around lightning fast.

And now it's time for you to share. If you have any similar time-saving tips, leave them in the comments. I'd be sure to give you credit when I update the article.


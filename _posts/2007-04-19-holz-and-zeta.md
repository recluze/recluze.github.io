---
layout: post
title: HOLZ and Zeta
date: 2007-04-19 13:15:35.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Articles
- research
- resources
tags: []
meta:
  _wpas_done_all: '1'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2007/04/19/holz-and-zeta/"
---
Installing HOLZ isn't as easy as you may think it would be. After much efforts, I've managed to do it and I thought I should post it here to save you guys some time.

First of all, install Isabelle2005 if you haven't already.   
Then, get zeta and install that using the provided installation classfile. It's pretty straight forward.

The tricky part is installing HOlZ on top of it. Here's what needs to be done:

1. Read the Install file which comes with the HOLZ tarball. (Read the file carefully and make the configuration changes it asks you to.)&nbsp; 
2. Try installing HOLZ. 
3. It shouldn't work. (If it does, you don't need to read this.) You will probably get a message saying, "Build failed".
4. Now, locate zeta.sty and put it in HOLZ/src/latex/. This file can be found in lib/latex subdir in the zeta installation directory. 
5. Modify IsaMakefile in HOLZ installation source directory and put a command to copy zeta.sty to the same target as the holz.sty. (You'll understand what I'm saying when you open IsaMakefile in an editor.)
6. Now, redo the isatool make command. It should work now. 

Secondly, to install the Zeta Adaptor, here's what needs to be done:

1. Go to "zeta" subdirectory in HOLZ's src directory, 
2. Do an "isatool make". 
3. It will tell you where it's put the just-installed holz adaptor jar. 
4. Now, go to zeta-1.5/bin where zeta-1.5 is your zeta installation directory
5. vi zeta 
6. Modify to include the just copied jar. 

More on how to get from zeta to Isabelle/HOLZ later. Stay tuned.


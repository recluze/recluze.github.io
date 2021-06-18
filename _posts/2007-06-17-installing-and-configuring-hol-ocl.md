---
layout: post
title: Installing and Configuring HOL-OCL
date: 2007-06-17 07:08:55.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Formal Methods
tags: []
meta:
  _oembed_b9a1d33304fa90df5489241fe60b6d5c: "{{unknown}}"
  _oembed_6b1d54b2d62357b486d3ee5f65ae9a1e: "{{unknown}}"
  _wpas_done_all: '1'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2007/06/17/installing-and-configuring-hol-ocl/"
---
I've just finished installing/configuring HOL-OCL (except for the X-symbols configuration). This was a pretty complex process and the documentation is pretty scattered. Here's the flow I followed:

**Get HOL-OCL**

- Download HOL-OCL from:[http://www.brucker.ch/projects/hol-ocl/](http://www.brucker.ch/projects/hol-ocl/)
- Need SML/NJ because of some datatype deficiency in Poly/ML

**Install SML/NJ**  
From: http://www.smlnj.org/dist/working/110.56/index.html  
Take a look at INSTALL&nbsp; -- it's helpful but verbose and not accurate about basic installation

**Get these files:**   
&nbsp;&nbsp;&nbsp; config.tgz  
&nbsp;&nbsp;&nbsp; boot.\<arch\>.\<os\>.tgz&nbsp; (boot.x86.unix.tgz)  
&nbsp;&nbsp;&nbsp; runtime.tgz  
&nbsp;&nbsp;&nbsp; smlnj-lib.tgz  
&nbsp;&nbsp;&nbsp; MLRISC.tgz   
&nbsp;&nbsp;&nbsp; ml-yacc.tgz  
&nbsp;&nbsp;&nbsp; ml-lex.tgz  
&nbsp;&nbsp;&nbsp; cml.tgz

1. Create a folder temp for installation source 
2. Unpack config.tgz to config 
3. Put config in temp 
4. Put&nbsp; from temp/config/\* to temp/\*&nbsp; -- I don't think all files are needed here. I just haven't got around to finding which ones are! 
5. Copy other two tgz files to temp/ folder 
6. Go to temp folder 
7. Rename the main folder containing everything to smlnj
8. Copy this folder to Isabelle\_home/contrib/ 
9. Run install.sh 

**Setting up Isabelle to Use HOL+OCL**

Take a look at Section 7.2.1 of HOL-OCL Book   
After copying smlnj folder to isabelle\_home/contrib/:   
Recompile Isabelle using sml/nj :   
Overwrite $hol-ocl\_dir$/contrib/defs.ML to $isabelle\_home$/src/Pure/defs.ML -- you can get this file from the hol-ocl installation folder  
edit: /usr/local/Isabelle2005/etc/settings -- uncomment smlnj portion, comment out polyml portion  
Go to isabelle\_home  
build -m HOL-Complex HOL   
this may take a while ... sml/nj is a little slow during compilation

**get Hol-ocl**   
Extract to isabelle\_home/  
Go to isabelle\_home/hol-ocl-0.9.0/src   
isatool make   
set environment variable HOLOCL\_HOME

**Get ArgoUML**  
http://argouml.tigris.org/  
Java jar file. Easy to run. Works beautifully

**Get Dresden OCL1.2 for OCL2**  
From: http://dresden-ocl.sourceforge.net/index.html  
run using: java -jar ocl20parsertools.jar

**Take a look at their Publications**  
[http://www.brucker.ch/projects/hol-ocl/](http://www.brucker.ch/projects/hol-ocl/)  
A Model Transformation Semantics and Analysis Methodology for SecureUML.

And now that I've done it, I'm not sure I'm going to use it but I may give it a try. It seems promising for a specific area of application of formal methods.


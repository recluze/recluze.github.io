---
layout: post
title: Writing a basic SELinux LPM
date: 2008-08-27 07:49:54.000000000 +06:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Tutorials
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
permalink: "/2008/08/27/writing-a-basic-selinux-lpm/"
---
<p>I couldn't find a straight forward tutorial on how to create an LPM in SELinux. So, here goes. Notice that this is for educational purposes only and would only take you so far. You need to study the implications of LPMs and how SELinux works before you can actually use them.</p>
<p><strong>Assumptions: </strong></p>
<ol>
<li>You know what SELinux is.</li>
<li>You know what types, attributes, macros etc are in SELinux.</li>
<li>You have read about Loadable Policy Modules (LPMs) and want to use them.</li>
<li>You don't know how to write and compile/use an LPM.</li>
</ol>
<p><strong>Setup:</strong></p>
<ol>
<li>Set SELinux to permissive. (Not enforcing. This isn't a complete tutorial!)</li>
<li>Get <em>setools</em> package (possibly from yum)</li>
<li>Install <em>selinux-policy-devel</em> package (possibly from yum)</li>
</ol>
<p><strong>Operations</strong>: (<em>su</em> whenever you need to)</p>
<ol>
<li>Create a directory. I'm assuming /home/user/lpm</li>
<li>cd into the directory and create a sample policy. (See below for policy where it will be explained). Let's call it <em>myapp.te</em></li>
<li>Copy the LPM makefile from /usr/share/selinux/devel. (This comes with selinux-policy-devel)</li>
<li>Run "make"  &lt; compiles the .te file</li>
<li>Run "semodule -i myapp.pp"&lt; loads the LPM</li>
<li>Run "cp /usr/bin/tail ./tt2" &lt; copies the tail script here for testing purposes</li>
<li>Run "touch myapplog.log" &lt; create a dummy log file</li>
<li>Run "chcon -t myapp_exec_t tt2" &lt; Assign label to executable (see policy for description)</li>
<li>Run "chcon -t myapp_log_t myapplog.log"  &lt; Assign label to log file</li>
<li>Run "seaudit". Open log file "/var/log/messages" if you do not have auditd installed or "/var/log/audit/audit.log" if you do.</li>
<li>Run "./tt2 myapplog.log" &lt; Run the file.</li>
<li>Take a look at the seaudit for auditting details. (See attached screenshots for details)</li>
<li>Notice the denies. (tail requires many allows which we haven't put in the LPM. You can continue to fix these to get rid of all the denies.)</li>
</ol>
<p><strong>The policy:</strong></p>
<pre>-----------------------|      myapp.te       |---------------------

policy_module(myapp,1.0.0)

# Adopted from /usr/share/selinux/devel/example.te

# Declarations

require{
type fs_t;
type unconfined_devpts_t;
}

type myapp_t;
type myapp_exec_t;
domain_type(myapp_t)
# myapp_t is a process (belongs to domain attribute)

domain_entry_file(myapp_t, myapp_exec_t)
# allow myapp_t to be transitioned to using myapp_exec_t

type myapp_log_t;
logging_log_file(myapp_log_t)

type myapp_tmp_t;
files_tmp_file(myapp_tmp_t)

domain_auto_trans(domain, myapp_exec_t, myapp_t)
# transition from 'domain' (any process) to myapp_t through myapp_exec_t executable

#
# Myapp local policy
#
allow myapp_exec_t fs_t:filesystem associate;

allow myapp_t unconfined_devpts_t : chr_file *;
# allow myapp_t access to the terminal

allow domain myapp_exec_t : file {execute read write} ;
# allow any process to run myapp_exec_t

auditallow myapp_t myapp_log_t:file ra_file_perms;
auditallow myapp_t myapp_log_t:file read;
# auditallow myapp_t to read myapp_log_t

allow myapp_t myapp_tmp_t:file manage_file_perms;
files_tmp_filetrans(myapp_t,myapp_tmp_t,file)

-----------------------------------------------------------
 **Screencaps:**

1. SETroubleshoot showing error message (denied access to terminal) [[see here](http://i11.photobucket.com/albums/a181/recluzepb/seaudit1.png)]
2. SEAudit showing log with denies and grants [[see here](http://i11.photobucket.com/albums/a181/recluzepb/seaudit2.png)]

**audit2allow:(updated)**

If you want to generate allow rules automatically, use audit2allow:

audit2allow -i /var/log/audit/audit.log

This will show you the rules which need to be added to the .te file for the whole thing to work.


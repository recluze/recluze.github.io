---
layout: post
title: Geting started with Hadoop 2.2.0 -- Building
date: 2014-01-23 05:54:39.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Geek stuff
- Hadoop
- Linux
- Tutorials
tags:
- big data
- linux
- tutorial
- virtualbox
meta:
  _wp_old_slug: '860'
  _edit_last: '2'
  _s2mail: 'yes'
  _syntaxhighlighter_encoded: '1'
  original_post_id: '860'
  _publicize_pending: '1'
  _wpas_done_all: '1'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2014/01/23/geting-started-with-hadoop-2-2-0-building/"
---
<p>I wrote a tutorial on <a title="Install, Configure and Execute Apache Hadoop from Source" href="http://www.csrdu.org/nauman/2010/09/25/install-configure-execute-apache-hadoop-from-source/" target="_blank">getting started with Hadoop</a> back in the day (around mid 2010). Turns out that the distro has moved on quite a bit with the latest versions. The tutorial is unlikely to work. I tried setting up Hadoop on a single-node "cluster" using Michael Knoll's <a href="http://www.michael-noll.com/tutorials/running-hadoop-on-ubuntu-linux-single-node-cluster/" target="_blank">excellent tutorial</a> but that too was out of date. And of course, the official documentation on Hadoop's site is lame.</p>
<p>Having struggled for two days, I finally got the steps smoothed out and this is an effort to document it for future use.</p>
<p><!--more--></p>
<p>I'm going to try to break this up in a couple of posts so that it's easier to read. This first part is going to be discussing the setup of a workable environment and then building Hadoop from the source. The reason for building from source is that if you have a 64-bit OS, the Hadoop tarball will not include 'native libraries' for your system and you will get weird errors such as this one:</p>
<p><code>WARN util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable<br />
</code></p>
<p>It's just a warning but it messes up with some startup scripts enough to make things unstable. So, we build from the source. First, though, let's setup an environment that we can re-use if we mess things up. If you really don't want a VM and instead want to go with a physical machine, just go ahead and install <strong>Ubuntu 12.04.3 LTS Server</strong> on a physical machine and skip the next section. Just name the main user '<em>hadoop</em>' and keep the password as '<em>hadoop</em>' as well so that you can follow along the rest of the tutorial with ease.</p>
<h2>Environment Setup</h2>
<p>My main machine is a Ubuntu 13.10 64-bit system but that is not important because we are going to set up a Virtual Box machine. That has the major advantage of easy backup if we mess things up.</p>
<p>So, download virtualbox in any way you want. For Ubuntu, that would be simply:</p>
<p><code>sudo aptitude install virtualbox -y<br />
</code></p>
<p>Afterwards, it's best to add a separate host-only adapter to virtualbox and add a network interface to your machine.</p>
<ol>
<li>For the first step, start virtualbox, click on 'File -&gt; Preferences -&gt; Network' and simply click on the 'Add Host-Only Network' button.</li>
<li>Then, create a 64-bit Ubuntu machine (I kept the default settings of 8GB hard drive and 1GB RAM). Once that is done, right-click on the machine (I named my ub64_1) and in the network settings, add another interface with Host-Only Network setting. That way, you will have internet access through NAT and host-connectivity through this second interface.</li>
</ol>
<p>Alright, with that done, we can start the virtual machine, attach an ISO file to the new machine and install <strong>Ubuntu 12.04.3 64-bit Server</strong>. Defaults work fine -- just set the main user's username as '<em>hadoop</em>' with '<em>hadoop</em>' as the password. Reboot the machine and make sure you can ping the host machine and the network.</p>
<p>I had a problem with the machine when it started -- eth1 was missing and thus host-guest connectivity was gone. If that is the case, edit <code>/etc/networking/interfaces</code> and add eth1 below eth0 with auto settings. That and a reboot should fix the connectivity. Btw, you can start the VM in headless mode to save some resource using <code>VBoxHeadless -startvm hdub_64_1<br />
</code> </p>
<h2>Downloading and Building Hadoop</h2>
<p>Alright, now that we have a clean working machine, let's get the build essentials for Hadoop first. For that, you need to use the following command:</p>
<p>[sourcecode lang="bash"]<br />
sudo apt-get install -y&amp;nbsp;<br />
gcc g++ make maven cmake zlib zlib1g-dev libcurl4-openssl-dev<br />
[/sourcecode]</p>
<p>You will notice that Hadoop's official documentation mentions protoc but we aren't installing that. The reason is that the protoc version in Ubuntu's repos is older than what is needed. So, we will be building protoc from source as well.</p>
<p>To build protobuf, we download the source and bulid it from source. The following commands should work fine:</p>
<p>[sourcecode lang="bash"]<br />
curl -# -O https://protobuf.googlecode.com/files/protobuf-2.5.0.tar.gz<br />
gunzip protobuf-2.5.0.tar.gz<br />
tar -xvf protobuf-2.5.0.tar<br />
cd protobuf-2.5.0<br />
./configure --prefix=/usr<br />
make<br />
make install<br />
protoc --version<br />
[/sourcecode]</p>
<p>The last command should tell you that you have protoc version 2.5.0 installed. Of couse, we also need the Java bindings of protobuf for Hadoop to use. For that, do the following: </p>
<p>[sourcecode lang="bash"]<br />
cd java<br />
mvn install<br />
mvn package<br />
[/sourcecode]</p>
<p>That's it for protobuf. Now, to finally get building Hadoop itself. Download the source for 2.2.0 (current stable version) from the <a href="http://www.apache.org/dyn/closer.cgi/hadoop/common/" target="_blank">Hadoop releases page</a>. Pick a mirror and download the latest source. I downloaded this one for example, <a href="http://www.eu.apache.org/dist/hadoop/common/stable/hadoop-2.2.0-src.tar.gz" target="_blank">http://www.eu.apache.org/dist/hadoop/common/stable/hadoop-2.2.0-src.tar.gz</a>.  </p>
<p>[sourcecode lang="bash"]<br />
wget http://www.eu.apache.org/dist/hadoop/common/stable/hadoop-2.2.0-src.tar.gz<br />
tar zxf hadoop-2.2.0-src.tar.gz<br />
[/sourcecode]</p>
<p>Now, there is a problem with the source. One of the maven pom files is incorrect. To fix that, apply the following patch: </p>
<p>[sourcecode lang="diff"]<br />
--- hadoop/common/trunk/hadoop-common-project/hadoop-auth/pom.xml	2013/11/18 22:09:24	1543189<br />
+++ hadoop/common/trunk/hadoop-common-project/hadoop-auth/pom.xml	2013/11/18 22:11:11	1543190<br />
@@ -54,6 +54,11 @@<br />
     &lt;/dependency&gt;<br />
     &lt;dependency&gt;<br />
       &lt;groupId&gt;org.mortbay.jetty&lt;/groupId&gt;<br />
+      &lt;artifactId&gt;jetty-util&lt;/artifactId&gt;<br />
+      &lt;scope&gt;test&lt;/scope&gt;<br />
+    &lt;/dependency&gt;<br />
+    &lt;dependency&gt;<br />
+      &lt;groupId&gt;org.mortbay.jetty&lt;/groupId&gt;<br />
       &lt;artifactId&gt;jetty&lt;/artifactId&gt;<br />
       &lt;scope&gt;test&lt;/scope&gt;<br />
     &lt;/dependency&gt;<br />
[/sourcecode] </p>
<p>After that, simply build all the projects using the following command: </p>
<p>[sourcecode lang="bash"]<br />
mvn clean install -DskipTests<br />
[/sourcecode] </p>
<p>You should get an output ending with something like this: </p>
<p>[sourcecode lang="bash"]<br />
...<br />
[INFO] Apache Hadoop Tools ............................... SUCCESS [0.376s]<br />
[INFO] Apache Hadoop Distribution ........................ SUCCESS [1.613s]<br />
[INFO] Apache Hadoop Client .............................. SUCCESS [0.925s]<br />
[INFO] Apache Hadoop Mini-Cluster ........................ SUCCESS [0.623s]<br />
[INFO] ------------------------------------------------------------------------<br />
[INFO] BUILD SUCCESS<br />
[INFO] ------------------------------------------------------------------------<br />
[INFO] Total time: 10:33.592s<br />
[INFO] Finished at: Wed Jan 22 07:04:11 PKT 2014<br />
[INFO] Final Memory: 77M/237M<br />
[INFO] ------------------------------------------------------------------------
  
[/sourcecode] 

Then, following the official instructions, issue the following commands:

[sourcecode lang="bash"]  
cd hadoop-mapreduce-project  
export Platform=x64  
mvn clean install assembly:assembly -Pnative  
[/sourcecode]

Of course, it wouldn't be any fun if they didn't give you an error. So, if you get the following error:

`Error: Failed to execute goal org.apache.maven.plugins:maven-assembly-plugin:2.2.1:assembly (default-cli) on project hadoop-mapreduce: Error reading assemblies: No assembly descriptors found. -> [Help 1]`

Issue the following command instead (while still being in the `hadoop-mapreduce-project` folder:

[sourcecode lang="bash"]  
mvn package -Pdist,native -DskipTests=true -Dtar  
cd .. # move back to top-level folder  
mvn package -Pdist,native -DskipTests=true -Dtar  
[/sourcecode]

The compiled tarball should now be in top-level-folder/hadoop-dist/target -- sitting there innocently as hadoop-2.2.0.tar.gz. Next step, get it to actually run but that will have to be another day.


---
layout: post
title: Hadoop 2.2.0 - Single Node Cluster
date: 2014-01-25 06:56:06.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Hadoop
- Tutorials
tags:
- big data
- linux
- tutorial
meta:
  _wp_old_slug: '880'
  original_post_id: '880'
  _s2mail: 'yes'
  _syntaxhighlighter_encoded: '1'
  videourl: ''
  attitude_sidebarlayout: default
  _edit_last: '2'
  _wpas_done_all: '1'
  _publicize_pending: '1'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2014/01/25/hadoop-2-2-0-single-node-cluster/"
---
We're going to use the the Hadoop tarball we compiled earlier to run a pseudo-cluster. That means we will run a one-node cluster on a single machine. If you haven't already read the tutorial on building the tarball, please head over and do that first.

> [Geting started with Hadoop 2.2.0 — Building](http://www.csrdu.org/nauman/2014/01/23/geting-started-with-hadoop-2-2-0-building/ "Geting started with Hadoop 2.2.0 — Building")

Start up your (virtual) machine and login as the user 'hadoop'. First, we're going to setup the essentials required to run Hadoop. By the way, if you are running a VM, I suggest you kill the machine used for building Hadoop and re-start from a fresh instance of Ubuntu to avoid any issues with compatibility later. For reference, the OS we are using is 64-bit Ubuntu 12.04.3 LTS.

<!--more-->

## Environment Setup

First thing we need to do is create an RSA keypair for our user.

[sourcecode lang="bash"]  
ssh-keygen -t rsa # Don't enter a password, pick all defaults  
cat ~/.ssh/id\_rsa.pub \>\> ~/.ssh/authorized\_keys  
ssh localhost  
[/sourcecode]

We just created a key and added it to our user's authorized keys so that we can do password-less login to our own machine. The last command above should login without asking for password.

Next, we want to call this system 'master'. It's a master of itself -- this will come in handy in the future. We need to change the hostname and then configure our hosts file.

[sourcecode lang="bash"]  
sudo hostname master  
sudo vi /etc/hostname  
[/sourcecode]

The `hostname` file should have a single line:

[sourcecode lang="bash"]  
master  
[/sourcecode]

Next, modify `/etc/hosts` file and just after the `localhost` line, add an entry identifying 'master':

[sourcecode lang="bash"]  
127.0.0.1 localhost  
192.168.56.101 master  
[/sourcecode]

This is assuming your machine has the IP address `192.168.56.101`. Make sure that this address is accessible from other machines. We will be using it for looking at some stats inshaallah.

Next, we install Java. OpenJDK 7 works fine.

[sourcecode lang="bash"]  
sudo apt-get install -y openjdk-7-jdk  
[/sourcecode]

Now we can start setting up Hadoop. Copy the tarball over to master. You can use scp or winscp for that, or put it on a webserver and access it from there. After you have the compiled tar in hadoop user's home folder on master, it's time to extract and configure it.

[sourcecode lang="bash"]  
cd /usr/local  
sudo tar zxf ~/hadoop-2.2.0.tar.gz  
sudo chown hadoop:hadoop -R hadoop-2.2.0/ # change ownership  
sudo ln -s hadoop-2.2.0 hadoop # create a symbolic link for future upgrades  
sudo chown hadoop:hadoop -R hadoop

# create DFS storage location and set permissions  
sudo mkdir -p /app/hadoop/tmp  
sudo chown hadoop:hadoop /app/hadoop/tmp/ -R  
[/sourcecode]

Ok. That was easy. Now, let's go ahead and append hadoop's executable folders to our path definition. I made the changes in `/etc/environment` but you can also modify your `~/.bashrc` file. Your choice. Just append the following to your path definition:

[sourcecode lang="bash"]  
:/usr/local/hadoop/bin:/usr/local/hadoop/sbin  
[/sourcecode]

Now, source the file to put it into effect:

[sourcecode lang="bash"]  
. /etc/environment  
[/sourcecode]

## Configuration

It is now time to create some configuration files. They are plenty but don't worry. I'm going to try and explain them and they're fairly straight forward -- and they work as of today.

[sourcecode lang="bash"]  
cd /usr/local/hadoop  
mkdir conf  
touch conf/core-site.xml  
touch conf/mapred-site.xml  
touch conf/hdfs-site.xml  
touch conf/yarn-site.xml  
touch conf/capacity-scheduler-site.xml  
touch conf/hadoop-env.sh  
touch conf/slaves  
[/sourcecode]

The first one `conf/core-site.xml` is pretty easy.

[sourcecode lang="xml"]  
\<?xml version="1.0" encoding="UTF-8"?\>  
\<?xml-stylesheet type="text/xsl" href="configuration.xsl"?\>  
\<configuration\>  
 \<property\>  
 \<name\>hadoop.tmp.dir\</name\>  
 \<value\>/app/hadoop/tmp\</value\>  
 \<description\>A base for other temporary directories.\</description\>  
 \</property\>

\<property\>  
 \<name\>fs.default.name\</name\>  
 \<value\>hdfs://master:54310/\</value\>  
 \</property\>  
\</configuration\>  
[/sourcecode]

The first property is of interest -- well, both are but the second is left to the default. The first one tells where to put the Hadoop FS (meta) data. That's the directory we created above. The rest will be put by Hadoop within subfolders. The second property `fs.default.name` tells Hadoop where to look for the HDFS. If you see the machine's local filesystem when you later try to retrieve directory listing of HDFS, you will know that you messed this setting up. Notice the host 'master' over here. Port is best left to default.

Next file is `conf/mapred-site.xml`. It only has one setting:

[sourcecode lang="xml"]  
\<?xml version="1.0" encoding="UTF-8"?\>  
\<?xml-stylesheet type="text/xsl" href="configuration.xsl"?\>  
\<configuration\>  
 \<property\>  
 \<name\>mapred.job.tracker\</name\>  
 \<value\>master:54311\</value\>  
 \<description\>The host and port that the MapReduce job tracker runs  
 at. If "local", then jobs are run in-process as a single map  
 and reduce task.  
 \</description\>  
 \</property\>  
\</configuration\>  
[/sourcecode]

The description basically says it all. The HDFS configurations are given in `hdfs-site.xml` is also straight forward as we are not doing any customization for now.

[sourcecode lang="xml"]  
\<?xml version="1.0" encoding="UTF-8"?\>  
\<?xml-stylesheet type="text/xsl" href="configuration.xsl"?\>  
\<configuration\>  
 \<property\>  
 \<name\>dfs.permissions.superusergroup\</name\>  
 \<value\>hadoop\</value\>  
 \</property\>  
 \<property\>  
 \<name\>dfs.replication\</name\>  
 \<value\>1\</value\>  
 \<description\>Default block replication.  
 The actual number of replications can be specified when the file is created.  
 The default of 3 is used if replication is not specified.  
 \</description\>  
 \</property\>  
\</configuration\>  
[/sourcecode]

The last one is the most detailed but is still pretty simple. This is the listing for `yarn-site.xml` which basically replaces Job Tracker and Task Tracker of MapReduce 1.

[sourcecode lang="xml"]  
\<?xml version="1.0" encoding="UTF-8"?\>  
\<?xml-stylesheet type="text/xsl" href="configuration.xsl"?\>  
\<configuration\>  
 \<property\>  
 \<name\>yarn.log-aggregation-enable\</name\>  
 \<value\>true\</value\>  
 \</property\>  
 \<property\>  
 \<name\>yarn.dispatcher.exit-on-error\</name\>  
 \<value\>true\</value\>  
 \</property\>  
 \<property\>  
 \<name\>yarn.app.mapreduce.am.staging-dir\</name\>  
 \<value\>/user\</value\>  
 \</property\>  
 \<property\>  
 \<name\>yarn.application.classpath\</name\>  
 \<value\>  
 $HADOOP\_CONF\_DIR,  
 $HADOOP\_COMMON\_HOME/\*,$HADOOP\_COMMON\_HOME/lib/\*,  
 $HADOOP\_HDFS\_HOME/\*,$HADOOP\_HDFS\_HOME/lib/\*,  
 $HADOOP\_MAPRED\_HOME/\*,$HADOOP\_MAPRED\_HOME/lib/\*,  
 $HADOOP\_YARN\_HOME/\*,$HADOOP\_YARN\_HOME/lib/\*  
 \</value\>  
 \</property\>

\<property\>  
 \<name\>yarn.resourcemanager.scheduler.address\</name\>  
 \<value\>master:8030\</value\>  
 \</property\>  
 \<property\>  
 \<name\>yarn.resourcemanager.resource-tracker.address\</name\>  
 \<value\>master:8031\</value\>  
 \</property\>  
 \<property\>  
 \<name\>yarn.resourcemanager.address\</name\>  
 \<value\>master:8032\</value\>  
 \</property\>  
 \<property\>  
 \<name\>yarn.resourcemanager.admin.address\</name\>  
 \<value\>master:8033\</value\>  
 \</property\>  
 \<property\>  
 \<name\>yarn.web-proxy.address\</name\>  
 \<value\>master:8034\</value\>  
 \</property\>  
 \<property\>  
 \<name\>yarn.resourcemanager.webapp.address\</name\>  
 \<value\>master:8088\</value\>  
 \</property\>  
\</configuration\>  
[/sourcecode]

The bottom half is of somewhat importance to us right now. These are different port configurations for services offered by the YARN resource manager. Make a note of the last one. That's the web front-end we can use to monitor our cluster.

Next, we put the following content in `conf/capacity-scheduler-site.xml`.

[sourcecode lang="xml"]  
\<?xml version="1.0" encoding="UTF-8"?\>  
\<?xml-stylesheet type="text/xsl" href="configuration.xsl"?\>  
\<configuration\>  
 \<property\>  
 \<name\>yarn.scheduler.capacity.maximum-am-resource-percent\</name\>  
 \<value\>0.1\</value\>  
 \</property\>  
 \<property\>  
 \<name\>yarn.scheduler.capacity.root.queues\</name\>  
 \<value\>default\</value\>  
 \</property\>  
 \<property\>  
 \<name\>yarn.scheduler.capacity.root.default.capacity\</name\>  
 \<value\>100\</value\>  
 \</property\>  
 \<property\>  
 \<name\>yarn.scheduler.capacity.root.default.user-limit-factor\</name\>  
 \<value\>1\</value\>  
 \</property\>  
 \<property\>  
 \<name\>yarn.scheduler.capacity.root.queues\</name\>  
 \<value\>default\</value\>  
 \</property\>  
 \<property\>  
 \<name\>yarn.scheduler.capacity.root.default.maximum-capacity\</name\>  
 \<value\>100\</value\>  
 \</property\>  
 \<property\>  
 \<name\>yarn.scheduler.capacity.root.default.state\</name\>  
 \<value\>RUNNING\</value\>  
 \</property\>  
 \<property\>  
 \<name\>yarn.scheduler.capacity.root.default.acl\_submit\_applications\</name\>  
 \<value\>\*\</value\>  
 \</property\>  
 \<property\>  
 \<name\>yarn.scheduler.capacity.root.default.acl\_administer\_queue\</name\>  
 \<value\>\*\</value\>  
 \</property\>  
 \<property\>  
 \<name\>yarn.scheduler.capacity.node-locality-delay\</name\>  
 \<value\>-1\</value\>  
 \</property\>  
\</configuration\>  
[/sourcecode]

The last file we want to configure is the environment file `conf/hadoop-env.sh`. This will be read by the different script and can be used to setup different environment variables specific to Hadoop.

[sourcecode lang="bash"]  
export JAVA\_HOME=/usr/lib/jvm/java-7-openjdk-amd64

export HADOOP\_HOME=/usr/local/hadoop  
export HADOOP\_CONF\_DIR=/usr/local/hadoop/conf  
export HADOOP\_OPTS=-Djava.net.preferIPv4Stack=true

export HADOOP\_COMMON\_HOME=/usr/local/hadoop  
export HADOOP\_HDFS\_HOME=/usr/local/hadoop  
export HADOO\_MAPRED\_HOME=/usr/local/hadoop  
export HADOOP\_YARN\_HOME=/usr/local/hadoop

export YARN\_CONF\_DIR=/usr/local/hadoop/conf  
[/sourcecode]

We also need another `.sh` file but that is the same as the above. So, let's just copy it.

[sourcecode lang="bash"]  
cp conf/hadoop-env.sh conf/yarn-env.sh  
[/sourcecode]

One final thing we need to do is to tell Hadoop about our slaves. For now, we have only one so put the following in `conf/slaves`:

[sourcecode lang="bash"]  
master  
[/sourcecode]

Well, that's done. Now, let's see if we can execute it.

## Cluster Startup

Since we are only on one node, starting it up is pretty easy (although, to look at the official docs, you'd think this was rocket science).

First, we need to format our namenode.

[sourcecode lang="bash"]  
hdfs namenode -format  
[/sourcecode]

The hdfs command is actually in `/user/local/hadoop/bin` but since we have that added in the path, this works fine. After this, we need to start our HDFS.

[sourcecode lang="bash"]  
. /etc/environment  
start-dfs.sh  
# Alternative commands to start namenode and datanode  
# hadoop-daemon.sh --config $HADOOP\_CONF\_DIR --script hdfs start namenode  
# hadoop-daemon.sh --config $HADOOP\_CONF\_DIR --script hdfs start datanode  
[/sourcecode]

If at a later run, you get an error like this:

`There appears to be a gap in the edit log. We expected txid 1, but got txid 705.`

Append `-recover` to the namenode command above.

Check which resources are running by executing the Java ps command:

[sourcecode lang="bash"]  
jps  
[/sourcecode]

You sould see a NameNode and DataNode along with JPS itself.

And now the YARN daemons.

[sourcecode lang="bash"]  
yarn-daemon.sh --config $HADOOP\_CONF\_DIR start resourcemanager  
yarn-daemon.sh --config $HADOOP\_CONF\_DIR start nodemanager  
[/sourcecode]

JPS should now list a NameNode, a DataNode, a ResourceManager, a NodeManager and JPS itself. To test the HDFS, you can issue the following command:

[sourcecode lang="bash"]  
hdfs dfs -ls /  
[/sourcecode]

It shouldn't return anything at this point. If it lists your local system files, re-check the `fs.default.name` settings. If everything works fine, go ahead and try to see if you can run the hadoop examples.

## Executing an Example Job

Let's first get some files to upload to our NFS. As usual, we will get a few files form the Gutenberg project. See details here: [http://www.gutenberg.org](http://www.gutenberg.org)

[sourcecode lang="bash"]  
cd /tmp  
mkdir gutenberg  
cd gutenberg  
wget http://www.gutenberg.org/cache/epub/20417/pg20417.txt  
wget http://www.gutenberg.org/cache/epub/5000/pg5000.txt  
wget http://www.gutenberg.org/cache/epub/4300/pg4300.txt  
[/sourcecode]

Now, let's create a folder in our HDFS and upload the folder there.

[sourcecode lang="bash"]  
hdfs dfs -mkdir -p /user/hadoop/  
hdfs dfs -copyFromLocal /tmp/gutenberg /user/hadoop/  
hdfs dfs -ls /user/hadoop/gutenberg  
[/sourcecode]

If you can see the three files listed properly, we're all good to go here and we can now run the wordcount example on this.

[sourcecode lang="bash"]  
cd /usr/local/hadoop  
find . -name \*examples\*.jar  
# see where the file is found and use it below

cp share/hadoop/mapreduce/hadoop-mapreduce-examples-2.2.0.jar ./  
hadoop jar hadoop-mapreduce-examples-2.2.0.jar wordcount /user/hadoop/gutenberg /user/hadoop/gutenberg-out  
[/sourcecode]

That should run for a bit and then produce something like the following at the end:

[sourcecode lang="bash"]  
File System Counters  
 FILE: Number of bytes read=813183  
 FILE: Number of bytes written=4754129  
 FILE: Number of read operations=0  
 FILE: Number of large read operations=0  
 FILE: Number of write operations=0  
 HDFS: Number of bytes read=8241626  
 HDFS: Number of bytes written=0  
 HDFS: Number of read operations=24  
 HDFS: Number of large read operations=0  
 HDFS: Number of write operations=3  
 Map-Reduce Framework  
 Map input records=77931  
 Map output records=629172  
 Map output bytes=6076101  
 Map output materialized bytes=1459156  
 Input split bytes=352  
 Combine input records=629172  
 Combine output records=101113  
 Reduce input groups=0  
 Reduce shuffle bytes=0  
 Reduce input records=0  
 Reduce output records=0  
 Spilled Records=101113  
 Shuffled Maps =0  
 Failed Shuffles=0  
 Merged Map outputs=0  
 GC time elapsed (ms)=516  
 CPU time spent (ms)=0  
 Physical memory (bytes) snapshot=0  
 Virtual memory (bytes) snapshot=0  
 Total committed heap usage (bytes)=524660736  
 File Input Format Counters  
 Bytes Read=3671523  
 File Output Format Counters  
 Bytes Written=4753421  
[/sourcecode]

You can now do a usual `dfs -ls` on the output folder to check and then get the output using the following command

[sourcecode lang="bash"]  
hdfs dfs -getmerge /user/hadoop/gutenberg-out/part-r-00000 /tmp/gutenberg-wordcount  
# Alternative command  
# hdfs dfs -copyToLocal /user/hadoop/gutenberg-out /tmp/

head /tmp/gutenberg-wordcount  
[/sourcecode]

The contents should look something like this:

[sourcecode lang="bash"]  
"(Lo)cra" 1  
"1490 1  
"1498," 1  
"35" 1  
"40," 1  
"A 2  
"AS-IS". 1  
"A\_ 1  
"Absoluti 1  
"Alack! 1  
[/sourcecode]

And that's it. How do you turn this single-node cluster to a multi-node cluster? That's not difficult but you'll have to wait a few days for that.

Let me know in the comments section if you face any problem. I might be able to point you in the right direction.


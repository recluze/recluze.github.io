---
layout: post
title: Install, Configure and Execute Apache Hadoop from Source
date: 2010-09-25 09:35:35.000000000 +05:00
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
  _wp_old_slug: '478'
  original_post_id: '478'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2010/09/25/install-configure-execute-apache-hadoop-from-source/"
---
Hadoop is Apache's implementation of the brand-spanking new programming model called MapReduce, along with some other stuff such as Hadoop Distributed Filesystem (HDFS). It can be used to parallelize (or distribute) and thus massively speedup certain kinds of data processing. This tutorial will talk about installing, configuring and running the Hadoop framework on a single node. In a future tutorial, we might create a project that actually uses Hadoop for problem solving through multiple clustered nodes. Here, we start by looking at the setup of a single node.

Installing from the source is important if you want to make changes to the Hadoop framework itself. I've found that it's also the easier method if you simply want to deploy Hadoop. Whichever path you want to take, going with SVN is probably the best way. So, first checkout the source of a stable branch. I used 0.20.2 because it is the 'stable' branch at the time and because I was having trouble with checking out 0.20.

But before that, you need to setup the dependencies. Here they are:

1. JDK (I found 1.6+ to be compatible with the 0.20.2 branch)
2. Eclipse (SDK or 'classic'. This is required for the building the Hadoop eclipse plugin. I used 3.6.1)
3. Ant (for processing the install/configuration scripts)
4. xerces-c (the XML parser)
5. SSH server
6. g++

By the way, I used Ubuntu 10.04 as my dev box. Download binaries of Eclipse, ant and xerces-c. Extract them in your home folder and remember their folder names. We'll be needing them later.

Install the rest of the dependencies with:

[sourcecode language="bash"]  
$ sudo apt-get install sun-java6-jdk ssh g++  
[/sourcecode]

Also, ssh server needs to be setup so that it doesn't require password. You can check it with 'ssh localhost'. If it does require a password, disable that using:

[sourcecode language="bash"]  
$ ssh-keygen -t dsa -P '' -f ~/.ssh/id\_dsa  
$ cat ~/.ssh/id\_dsa.pub \>\> ~/.ssh/authorized\_keys  
[/sourcecode]

Now, go you your home directory, setup environment variables and checkout the Hadoop source:

[sourcecode language="bash"]  
nam@zenbox:~$&nbsp;cd ~  
nam@zenbox:~$ export JAVA\_HOME=/usr/lib/jvm/java-6-sun  
nam@zenbox:~$ export PATH=$PATH:/usr/share/apache-ant-1.8.1  
nam@zenbox:~$ svn co http://svn.apache.org/repos/asf/hadoop/common/branches/branch-0.21 hadoop  
[/sourcecode]

When you do this, you get pre-built hadoop binaries. (We're skipping the actual build part here. We'll come back to this shortly.) You can setup the requirements and the examples and then test the 'pi' example so:

[sourcecode language="bash"]  
nam@zenbox:~$&nbsp;cd hadoop  
nam@zenbox:~/hadoop$ ant  
nam@zenbox:~/hadoop$ ant examples  
nam@zenbox:~/hadoop$ bin/hadoop  
nam@zenbox:~/hadoop$ bin/hadoop jar hadoop-0.20.2-examples.jar pi 10 1000000  
[/sourcecode]

Here's (part of) what I got as output:

[sourcecode language="bash"]  
Number of Maps = 10  
Samples per Map = 1000000  
Wrote input for Map #0  
Wrote input for Map #1  
...  
Starting Job  
10/09/25 15:01:21 INFO jvm.JvmMetrics: Initializing JVM Metrics with processName=JobTracker, sessionId=  
10/09/25 15:01:21 INFO mapred.FileInputFormat: Total input paths to process : 10  
10/09/25 15:01:21 INFO mapred.JobClient: Running job: job\_local\_0001  
10/09/25 15:01:21 INFO mapred.FileInputFormat: Total input paths to process : 10  
10/09/25 15:01:21 INFO mapred.MapTask: numReduceTasks: 1  
10/09/25 15:01:21 INFO mapred.MapTask: io.sort.mb = 100  
10/09/25 15:01:21 INFO mapred.MapTask: data buffer = 79691776/99614720  
10/09/25 15:01:21 INFO mapred.MapTask: record buffer = 262144/327680  
10/09/25 15:01:22 INFO mapred.MapTask: Starting flush of map output  
10/09/25 15:01:22 INFO mapred.MapTask: Finished spill 0  
10/09/25 15:01:22 INFO mapred.TaskRunner: Task:attempt\_local\_0001\_m\_000000\_0 is done. And is in the process of commiting  
...  
10/09/25 15:01:24 INFO mapred.LocalJobRunner:  
10/09/25 15:01:24 INFO mapred.TaskRunner: Task attempt\_local\_0001\_r\_000000\_0 is allowed to commit now  
10/09/25 15:01:24 INFO mapred.FileOutputCommitter: Saved output of task 'attempt\_local\_0001\_r\_000000\_0' to hdfs://localhost:9000/user/nam/PiEstimator\_TMP\_3\_141592654/out  
10/09/25 15:01:24 INFO mapred.LocalJobRunner: reduce \> reduce  
10/09/25 15:01:24 INFO mapred.TaskRunner: Task 'attempt\_local\_0001\_r\_000000\_0' done.  
10/09/25 15:01:24 INFO mapred.JobClient: map 100% reduce 100%  
10/09/25 15:01:24 INFO mapred.JobClient: Job complete: job\_local\_0001  
10/09/25 15:01:24 INFO mapred.JobClient: Counters: 15  
10/09/25 15:01:24 INFO mapred.JobClient: FileSystemCounters  
10/09/25 15:01:24 INFO mapred.JobClient: FILE\_BYTES\_READ=1567406  
10/09/25 15:01:24 INFO mapred.JobClient: HDFS\_BYTES\_READ=192987  
10/09/25 15:01:24 INFO mapred.JobClient: FILE\_BYTES\_WRITTEN=199597  
10/09/25 15:01:24 INFO mapred.JobClient: HDFS\_BYTES\_WRITTEN=1781093  
10/09/25 15:01:24 INFO mapred.JobClient: Map-Reduce Framework  
10/09/25 15:01:24 INFO mapred.JobClient: Reduce input groups=20  
10/09/25 15:01:24 INFO mapred.JobClient: Combine output records=0  
10/09/25 15:01:24 INFO mapred.JobClient: Map input records=10  
10/09/25 15:01:24 INFO mapred.JobClient: Reduce shuffle bytes=0  
10/09/25 15:01:24 INFO mapred.JobClient: Reduce output records=0  
10/09/25 15:01:24 INFO mapred.JobClient: Spilled Records=40  
10/09/25 15:01:24 INFO mapred.JobClient: Map output bytes=180  
10/09/25 15:01:24 INFO mapred.JobClient: Map input bytes=240  
10/09/25 15:01:24 INFO mapred.JobClient: Combine input records=0  
10/09/25 15:01:24 INFO mapred.JobClient: Map output records=20  
10/09/25 15:01:24 INFO mapred.JobClient: Reduce input records=20  
Job Finished in 3.58 seconds  
Estimated value of Pi is 3.14158440000000000000  
[/sourcecode]

So, now that you know that Hadoop is actually running and working as it should, it's time to setup the server. First, you need to define the node configurations in the conf/core-site.xml

[sourcecode language="bash"]  
\<!-- Put site-specific property overrides in this file. --\>  
\<configuration\>  
 \<property\>  
 \<name\>fs.default.name\</name\>  
 \<value\>hdfs://localhost:9000\</value\>  
 \</property\>  
 \<property\>  
 \<name\>mapred.job.tracker\</name\>  
 \<value\>hdfs://localhost:9001\</value\>  
 \</property\>  
 \<property\>  
 \<name\>dfs.replication\</name\>  
 \<value\>1\</value\>  
 \<!-- set to 1 to reduce warnings when running on a single node --\>  
 \</property\>  
\</configuration\>  
[/sourcecode]

Also, setting the JAVA\_HOME environment variable does not work when starting the hadoop service. So, you need to set it up in conf/hadoop-env.sh:

[sourcecode language="bash"]  
# The java implementation to use. Required.  
export JAVA\_HOME=/usr/lib/jvm/java-6-sun  
[/sourcecode]

Then format the namenode specified in the configuration file above. See help for more details.

[sourcecode language="bash"]  
nam@zenbox:~/hadoop$ bin/hadoop namenode help  
10/09/25 15:17:18 INFO namenode.NameNode: STARTUP\_MSG:  
/\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*  
STARTUP\_MSG: Starting NameNode  
STARTUP\_MSG: host = zenbox/127.0.1.1  
STARTUP\_MSG: args = [help]  
STARTUP\_MSG: version = 0.20.3-dev  
STARTUP\_MSG: build = -r ; compiled by 'nam' on Sat Sep 25 11:41:00 PKT 2010  
\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*/  
Usage: java NameNode [-format] | [-upgrade] | [-rollback] | [-finalize] | [-importCheckpoint]  
10/09/25 15:17:18 INFO namenode.NameNode: SHUTDOWN\_MSG:  
/\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*  
SHUTDOWN\_MSG: Shutting down NameNode at zenbox/127.0.1.1  
\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*/

nam@zenbox:~/hadoop$ bin/hadoop namenode -format  
[/sourcecode]

Now you can start the service with the start-all.sh script and hopefully see the output as follows:

[sourcecode language="bash"]  
nam@zenbox:~/hadoop$ bin/start-all.sh  
starting namenode, logging to /home/nam/hadoop/hadoop-0.20.2/bin/../logs/hadoop-nam-namenode-zenbox.out  
localhost: starting datanode, logging to /home/nam/hadoop/hadoop-0.20.2/bin/../logs/hadoop-nam-datanode-zenbox.out  
localhost: starting secondarynamenode, logging to /home/nam/hadoop/hadoop-0.20.2/bin/../logs/hadoop-nam-secondarynamenode-zenbox.out  
starting jobtracker, logging to /home/nam/hadoop/hadoop-0.20.2/bin/../logs/hadoop-nam-jobtracker-zenbox.out  
localhost: starting tasktracker, logging to /home/nam/hadoop/hadoop-0.20.2/bin/../logs/hadoop-nam-tasktracker-zenbox.out  
[/sourcecode]

Finally, you can put a file in the hadoop filesystem, get the file listing and cat a file in the HDFS.

[sourcecode language="bash"]  
nam@zenbox:~/hadoop$ bin/hadoop dfs -put ~/a.txt a.txt  
nam@zenbox:~/hadoop$ bin/hadoop dfs -ls  
Found 1 items  
-rw-r--r-- 3 nam supergroup 5 2010-09-25 15:20 /user/nam/a.txt  
nam@zenbox:~/hadoop$ bin/hadoop dfs -cat a.txt  
[contents of a.txt here]  
nam@zenbox:~/hadoop$ bin/hadoop dfs -rm a.txt  
Deleted hdfs://localhost:9000/user/nam/a.txt  
[/sourcecode]

We'll get to the building of source in another installment of this tutorial inshaallah.


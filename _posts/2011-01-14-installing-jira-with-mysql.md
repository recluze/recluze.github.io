---
layout: post
title: Installing Jira with MySQL
date: 2011-01-14 12:13:51.000000000 +05:00
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
  _wp_old_slug: '542'
  original_post_id: '542'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2011/01/14/installing-jira-with-mysql/"
---
Jira is an extremely well-known issue tracking system and is used widely for project management in a wide array of fields. It has quite a detailed documentation but it's in the form of a wiki and as we all know, wikis are the worst way of creating software documentation. Anyway, in order to install Jira with MySQL, you will have to click and click and click. This tutorial aims to ease this issue by providing step-by-step instructions on how to install jira and enable it to connect with MySQL for storage. So let's begin.

Note: These instructions are for the standalone version of Jira. You can use them quite easily for the WAR/EAR version but if you're going on that route, you probably don't need this article.

Ok, first download and install Java (I usually go with JDK) -- version 6 is preferred. You can get the .bin file for Linux from java.sun.com (I refuse to call it Oracle Java). Make it executable and run it. JDK will be extracted in your current directory. Move it to /usr/share. Then set the JAVA\_HOME variable.

[sourcecode lang="bash"]  
JAVA\_HOME=/usr/share/jdk1.6.0\_23  
export JAVA\_HOME  
[/sourcecode]

You might want to set this in your `~/.bash_profile` file.

Next, create a user with which we will start jira -- for security reasons.

[sourcecode lang="bash"]  
sudo /usr/sbin/useradd --create-home --home-dir /usr/local/jira --shell /bin/bash jira  
[/sourcecode]

Download and extract the jira standalone .tar.gz file to /usr/local/jira and change ownership of all the files to the jira user:

[sourcecode lang="bash"]  
chown jira:jira /usr/local/jira -R  
[/sourcecode]

Open port 8080 which is used by jira (by default) -- edit the file `/etc/sysconfig/iptables` and enter the following rule:

[sourcecode lang="bash"]  
-A RH-Firewall-1-INPUT -m state --state NEW -m tcp -p tcp --dport 80 -j ACCEPT  
[/sourcecode]

Set the required jira.home property in the file `/usr/local/jira/atlassian-jira/WEB-INF/classes/jira-application.properties`

[sourcecode lang="bash"]  
mkdir /usr/local/jira/jirahome  
vi /usr/local/jira/atlassian-jira/WEB-INF/classes/jira-application.properties  
# set the variable jira.home to /usr/local/jira/jirahome  
[/sourcecode]

Restart the firewall and start jira using the following command:

[sourcecode lang="bash"]  
sudo -u jira nohup /usr/local/jira/bin/catalina.sh run & \> jira-nohup.log  
[/sourcecode]

The use of sudo will run jira as the user `jira` and `nohup` will ensure that jira won't stop running as soon as you close the shell. The output produced by the command will be saved to `jira-nohup.log `

Open the browser on location `http://your.ip.add.ress:8080/` and ensure that you can see the jira setup page. Don't bother proceeding with the setup because as soon as we connect jira to MySQL, this information will be lost. Let's do that now.

**Connecting with MySQL**

Begin by stopping jira, installing mysql server, setting it to always start on system startup and starting the server.

[sourcecode lang="bash"]  
/usr/local/jira/bin/shutdown.sh  
yum install mysql mysql-server  
chkconfig mysql on  
service mysqld start  
[/sourcecode]

Then start mysql, create a database and user for jira and assign all rights to the new user on the new database.

[sourcecode lang="bash"]  
mysql  
create database jiradb character set utf8;  
grant all privileges on jiradb.\* to jira@localhost identified by '[your new password]';  
q  
[/sourcecode]

Now, edit the `conf/server.xml` in the jira directory and change the data source as follows:

[sourcecode lang="bash"]  
\<Resource name="jdbc/JiraDS" auth="Container" type="javax.sql.DataSource"  
 username="jira"  
 password="[jira user password]"  
 driverClassName="com.mysql.jdbc.Driver"  
 url="jdbc:mysql://localhost/jiradb?useUnicode=true&amp;characterEncoding=UTF8"  
 maxActive="20"  
 validationQuery="select 1"/\>  
[/sourcecode]

Note that the ampersand code in the connection string is not a formatting problem. It really has to say amp with an ampersand and a semicolon at either end.

Finally, edit the `atlassian-jira/WEB-INF/classes/entityengine.xml` file to set the final attribute:

[sourcecode lang="bash"]  
\<datasource name="defaultDS" field-type-name="mysql"  
 helper-class="org.ofbiz.core.entity.GenericHelperDAO"  
 check-on-start="true"  
 use-foreign-keys="false" ...  
[/sourcecode]

Delete the `schema-name="PUBLIC"` attribute immediately after the changed line to ensure that the database is populated properly.

Start jira once again and now you can enter the setup information. Open MySQL and ensure that jira is, in fact, using this engine.


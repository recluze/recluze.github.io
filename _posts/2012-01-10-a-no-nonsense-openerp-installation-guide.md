---
layout: post
title: A No-nonsense OpenERP Installation Guide
date: 2012-01-10 04:14:26.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- OpenERP
- Tutorials
tags: []
meta:
  _wpas_done_all: '1'
  _publicize_pending: '1'
  _syntaxhighlighter_encoded: '1'
  _s2mail: 'yes'
  _edit_last: '2'
  original_post_id: '801'
  _wp_old_slug: '801'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2012/01/10/a-no-nonsense-openerp-installation-guide/"
---
This is a no-nonsense guide to the installation of [OpenERP](http://www.openerp.com/) -- the popular open source and customizable ERP solution -- aimed at the complete newbie. Of course, there has to just a little bit of "nonsense" to get you started. So, here it is: (a) You need to have [PostgreSQL](http://www.postgresql.org/) installed as the database backend for OpenERP. (b) OpenERP is written in python so you'll need some packages for that part. (c) There is a server and a client. The server is important -- client can be both a desktop client or a web client. (d) We'll cover all of this except the web client. You don't need that to get started. (e) We're using OpenERP on Ubuntu 11.10 but an older version should also work.

<!--more-->

**Setting up PostgreSQL**  
This is fairly straight-forward. You need to issue the following commands. (If you're new to Linux, the (parts of) lines starting with `#` are comments.)

[sourcecode lang="bash"]  
sudo apt-get install postgresql pgadmin3  
sudo su postgres # login as postgres user

createuser openerp  
# Answer y to the following question:  
# Shall the new role be a superuser? (y/n) y

psql template1  
alter role openerp with password 'postgres';  
# ALTER ROLE  
# Enter Ctrl+D to exit

# create database for openerp with owner openerp  
createdb -O openerp openerp  
exit # to go back to the normal user  
[/sourcecode]

**Setting up OpenERP Server**

First, we need to download the sources:

[sourcecode lang="bash"]  
cd ~  
mkdir temp  
wget http://www.openerp.com/download/stable/source/openerp-server-6.0.3.tar.gz  
wget http://www.openerp.com/download/stable/source/openerp-client-6.0.3.tar.gz  
[/sourcecode]

Then, we install all the required dependencies:

[sourcecode lang="bash"]  
sudo apt-get -y install python-lxml  
 python-mako python-dateutil python-psycopg2  
 python-pychart python-pydot python-tz  
 python-reportlab python-yaml python-vobject python-setuptools  
[/sourcecode]

Extract and install the server:

[sourcecode lang="bash"]  
cd ~/tmp  
tar zxf openerp-server-6.0.3.tar.gz  
cd openerp-server-6.0.3  
sudo python setup.py install  
[/sourcecode]

Create an OS user for openerp to run as:

[sourcecode lang="bash"]  
sudo useradd openerp  
sudo passwd openerp  
# give it password 'postgres' for simplicity  
[/sourcecode]

And finally, start the server:

[sourcecode lang="bash"]  
sudo su openerp # we should run openerp as its own user  
openerp-server  
[/sourcecode]

**Using the Client**

Leave that terminal running and open up another one. First, we'll install the dependencies for the client:

[sourcecode lang="bash"]  
sudo apt-get -y install python-gtk2  
 python-glade2 python-matplotlib python-egenix-mxdatetime  
 python-dateutil python-pydot python-tz python-hippocanvas  
[/sourcecode]

The package `python-xml` (suggested by the official documentation) is deprecated and is no longer available. You don't need it anyway since you can use the xml support in core python.

[sourcecode lang="bash"]  
cd ~/tmp  
tar zxf openerp-client-6.0.3.tar.gz  
cd openerp-client-6.0.3  
[/sourcecode]

To test out that the server is working properly:

[sourcecode lang="bash"]  
cd bin  
./openerp-client.py  
[/sourcecode]

You should now see the login screen similar to this one:

[caption id="attachment\_806" align="aligncenter" width="300" caption="OpenERP Client"][![]({{ site.baseurl }}/assets/images/2012/01/openerp-client-test-300x187.png "OpenERP Client")](http://recluze.files.wordpress.com/2012/01/openerp-client-test.png)[/caption]

Login using the following credentials:

[sourcecode]  
username: admin  
password: admin  
[/sourcecode]

Installation of the client is giving me trouble right now. I'll post the installation instructions after I sort them out inshaallah.


---
layout: post
title: Varnish Cache for Wordpress on cPanel
date: 2011-07-21 04:42:10.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Linux
- resources
- Tutorials
tags: []
meta:
  _wpas_done_all: '1'
  _publicize_pending: '1'
  _edit_last: '2'
  video_type: "#NONE#"
  Image: ''
  _syntaxhighlighter_encoded: '1'
  _s2mail: 'yes'
  original_post_id: '628'
  _wp_old_slug: '628'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2011/07/21/varnish-cache-for-wordpress-on-cpanel/"
---
Varnish is an extremely easy to configure server cache software that can help you counter the 'slashdot effect' -- high traffic over a small period of time. The way Varnish does this is by sitting between the client and the webserver and providing cached results to the client so that the server doesn't have to process every page. It's better than memcache etc because the request never gets to the webserver. You can avoid one of the bottlenecks this way. In this tutorial, we'll cover how to setup Varnish on a VPS (or dedicated server) where you have root access and are running your site using cPanel/WHM. It also applies to situations where you don't have cPanel/WHM. You can just skip the cPanel portion if that's the case. So, let's get started.

<!--more-->First, you need to get Varnish. It's very easy to setup since it comes with its own repository for CentOS. It does have on dependency that's normally missing. That dependency is jemalloc.so. When you try to install varnish, it gives the error:

Missing Dependency: libjemalloc.so.1()(64bit) is needed by package varnish-3.0.0-1.el5.x86\_64 (varnish-3.0)

Get this file and install it using the following commands:

`wget http://download.fedora.redhat.com/pub/epel/5/x86_64/jemalloc-2.1.3-2.el5.x86_64.rpm`  
`rpm -ivh jemalloc-2.1.3-2.el5.x86_64.rpm`

Now we have the dependency. Head over to [Varnish Docs page](https://www.varnish-cache.org/docs) and read the instructions for your operating system. Since I'm describing CentOS, here are the instructions for that:

`rpm --nosignature -i http://repo.varnish-cache.org/redhat/varnish-3.0/el5/noarch/varnish-release-3.0-1.noarch.rpm`

`yum install varnish`

Now to edit the varnish configuration file. It's located at:&nbsp;`etc/varnish/default.vcl`. Insert the following code in the file. Explanation of the different constructs follows:

[sourcecode]  
backend default {  
 .host = "your.primary.domainname.com";  
 .port = "80";  
}  
sub vcl\_recv {  
 if (req.http.Accept-Encoding) {  
 if (req.url ~ ".(jpg|png|gif|gz|tgz|bz2|lzma|tbz)(?.\*|)$") {  
 remove req.http.Accept-Encoding;  
 } elsif (req.http.Accept-Encoding ~ "gzip") {  
 set req.http.Accept-Encoding = "gzip";  
 } elsif (req.http.Accept-Encoding ~ "deflate") {  
 set req.http.Accept-Encoding = "deflate";  
 } else {  
 remove req.http.Accept-Encoding;  
 }  
 }  
 if (req.url ~ "^/[^?]+.(jpeg|jpg|png|gif|ico|js|css|txt|gz|zip|lzma|bz2|tgz|tbz|html|htm)(?.\*|)$") {  
 unset req.http.cookie;  
 }  
 if (req.request == "GET" &amp;&amp; req.url ~ "cron\_job" ||&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;req.url ~ "something\_else"&nbsp; &nbsp; &nbsp; &nbsp; ) {  
 return ( pass );  
 }  
}  
[/sourcecode]

The configuration file is fairly straight forward. Just a couple of things that need explanation. Backend defines your webserver. You can have multiple backends and load balance between them but I'm not covering that here. Read up on varnish docs for that.

The sub vcl\_recv portion gets called before a request gets passed to the backend or gets checked in the cache. You can define different rules here. For example, the rule `if (req.url ~ "^/[^?]+.(jpeg| ... ` says that if the requested URL matches one of those extensions, the http cookie should be unset. This is important because if a cookie is present in any request, varnish will always bypass the cache and send the request to the webserver. By unsetting the cookie, you're giving varnish a chance to check if a cache hit will occur.

The second important line here is the `return(pass); ` directive. Whenever this gets called, the cache is ignored again and the request is passed through to the webserver. In our case, if the request URL contains either the word 'cron\_job' or 'something\_else', it gets ignored by varnish. You might want to do this if (as in this case), there's a cron job that does not have a cookie but still needs to be called on the webserver each time.

Ok, enough talk. Let's start varnish. Here's the command:

`varnishd -f /etc/varnish/default.vcl -s malloc,1G -T 127.0.0.1:2000 -a 0.0.0.0:8080`

It reads the configuration file given by the `-f` directive, allocates 1GB memory to varnish, sets up an admin interface on port 2000 and sets up the varnish listening port on 8080. Notice that we currently have varnish set on 8080 and the webserver on 80. This is so that we can test varnish without disrupting the normal processing of the server. After we're done testing, we'll change the webserver to 8080 and varnish to 80.

To see the status of varnish request processing, run `varnishtop` on the shell and send a request to your server on port 8080.

To configure a running instance of varnish, you can use the `varnishadm` command. For example, run `varnishadm` and issue the following commands to reload the configuration file (after you've made some changes to it).

`help`  
`vcl.load reload01 /etc/varnish/default.vcl`  
`vcl.use reload01`

Finally, when you have everything ready, it's time to kill varnish, change the server port to 8080 and re-run varnish on port 80. First,

`killall varnishd`

Edit the configuration file and change backend port to 8080 instead of 80.

**cPanel/WHM configuration**

This one's easy. If you're just using apache, change all listening ports to 8080 and change your vhost directives. If you're using cPanel/WHM, go to WHM -\> Tweak Settings and change "Apache non-SSL IP/port" to "0.0.0.0:8080". (If you have apache listening on a specific IP, you can change the 0s accordingly).

Now, save, restart apache and issue the following command to start varnish:

`varnishd -f /etc/varnish/default.vcl -s malloc,1G -T 127.0.0.1:2000 -a 0.0.0.0:80`

You should now be able to browse the site and check varnishtop to see that varnish is processing the requests. You might also want to put the command (prefixing it with /usr/bin/varnishd instead of varnishd) in /etc/rc.local so that varnish starts on reboot.


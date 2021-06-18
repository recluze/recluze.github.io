---
layout: post
title: Troubleshooting vTiger CRM Install on PHP 5.2
date: 2010-12-16 13:27:12.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- resources
- Tutorials
tags: []
meta:
  _wpas_done_all: '1'
  _publicize_pending: '1'
  _edit_last: '2'
  _syntaxhighlighter_encoded: '1'
  _wp_old_slug: '529'
  original_post_id: '529'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2010/12/16/troubleshooting-vtiger-crm-install-on-php-5-2/"
---
I recently had to deploy vTiger CRM 5 on a machine running PHP 5.2. Turned out that vTiger does not like PHP 5.2 because of some differences between PHP 5.0 and 5.2. As soon as you start the install script, you get the following error:

[sourcecode lang="bash"]  
Cannot redeclare class DateTime  
[/sourcecode]

The problem is that vTiger defines its own DateTime class and so does PHP 5.2. The solution therefore (see vTiger [wiki](http://wiki.vtiger.com/index.php/Developers_How_To%27s)) was to rename the class in vTiger source. To do that, all you need to do is to run the following commands from the vtiger source root (e.g. /var/www/html/vtiger):

[sourcecode lang="bash"]  
mv modules/Calendar/Date.php modules/Calendar/Date.php.back  
sed s/ DateTime/ com\_vtiger\_DateTime/ \< modules/Calendar/Date.php.back \> modules/Calendar/Date.php  
mv modules/Calendar/Appointment.php modules/Calendar/Appointment.php.back  
sed s/ DateTime/ com\_vtiger\_DateTime/ \< modules/Calendar/Appointment.php.back \> modules/Calendar/Appointment.php  
mv include/utils/RecurringType.php include/utils/RecurringType.php.back  
sed s/ DateTime/ com\_vtiger\_DateTime/ \< include/utils/RecurringType.php.back \> include/utils/RecurringType.php  
[/sourcecode]

This script modifies the files Date.php, Appointment.php and RecurringType.php by first taking the backup of the file and then replacing all occurrences of " DateTime" with " com\_vtiger\_DateTime". The backup is kept in the same location.

After that, you can run the install script and get to the login screen. When you login, you get a new error (something to this effect):

[sourcecode]  
Catchable fatal error: Object of class \<ClassName\> could not be converted to string in /var/www/xxx on line yyy  
[/sourcecode]

The solution of this came from [this great post](http://www.ilexius.de/neuigkeiten/tutorials-detail/archive/2008/Januar/article/vtiger-crm5-and-php-52/). You need to create a custom error handler (called ErrorHandler.php) in the vtiger source root with the following content:

[sourcecode lang="php"]  
\<?php  
function compatibilityErrorHandler($errno, $errstr, $errfile, $errline)  
{  
 switch ($errno) {  
 case&nbsp; E\_RECOVERABLE\_ERROR:  
 break;  
 default:  
 echo "Unknown error type: [$errno] $errstr n";  
 break;  
 }  
}

// set to the user defined error handler  
$old\_error\_handler = set\_error\_handler("compatibilityErrorHandler", E\_RECOVERABLE\_ERROR);  
?\>  
[/sourcecode]

Finally, you need to include this error handler through the config.inc.php. For that, execute the following commands:

[sourcecode lang="bash"]  
mv config.inc.php config.inc.php.back  
sed "/include('vtigerversion.php');/ a  
require\_once('ErrorHandler.php');" \< config.inc.php.back \> config.inc.php  
[/sourcecode]

Notice the line break after the a. The first command makes a backup. The second inserts the require\_once directive after the line with the include directive.


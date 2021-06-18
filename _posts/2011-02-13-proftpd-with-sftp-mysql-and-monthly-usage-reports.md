---
layout: post
title: ProFTPD with SFTP, MySQL and Monthly Usage Reports
date: 2011-02-13 03:49:41.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Tutorials
- Web
tags: []
meta:
  _wpas_done_all: '1'
  _publicize_pending: '1'
  _edit_last: '2'
  _syntaxhighlighter_encoded: '1'
  video_type: "#NONE#"
  Image: ''
  _wp_old_slug: '570'
  original_post_id: '570'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2011/02/13/proftpd-with-sftp-mysql-and-monthly-usage-reports/"
---
To install ProFTPD with MySQL-based authentication and SFTP support, you need to download the latest version of the source code and build it with customized options. But first, some prerequisites. (These instructions are for ubuntu but can easily be modified for CentOS).  
<!--more-->

Download the dependencies:

[sourcecode lang="bash"]  
apt-get install mysql mysql-server mysql-client libmysql++-dev libssl-dev build-essential libncurses-dev  
[/sourcecode]

Setup the ftpgroup and ftpuser which will own all the files on the server. The virtual MySQL users will be mapped to these two:

[sourcecode lang="bash"]  
groupadd -g 2001 ftpgroup  
useradd -u 2001 -s /sbin/false -d /bin/null -c "proftpd user" -g ftpgroup ftpuser  
[/sourcecode]

Create mysql database structure required by proftpd

[sourcecode lang="sql"]  
/etc/init.d/mysqld start  
mysqladmin -root -p password 'yourpassword'  
mysql -uroot -p

CREATE DATABASE ftp;  
USE ftp;

CREATE TABLE ftpgroup (  
groupname varchar(16) NOT NULL default '',  
gid smallint(6) NOT NULL default '5500',  
members varchar(16) NOT NULL default '',  
KEY groupname (groupname)  
) TYPE=MyISAM COMMENT='ProFTP group table';

CREATE TABLE ftpquotalimits (  
name varchar(30) default NULL,  
quota\_type enum('user','group','class','all') NOT NULL default 'user',  
per\_session enum('false','true') NOT NULL default 'false',  
limit\_type enum('soft','hard') NOT NULL default 'soft',  
bytes\_in\_avail int(10) unsigned NOT NULL default '0',  
bytes\_out\_avail int(10) unsigned NOT NULL default '0',  
bytes\_xfer\_avail int(10) unsigned NOT NULL default '0',  
files\_in\_avail int(10) unsigned NOT NULL default '0',  
files\_out\_avail int(10) unsigned NOT NULL default '0',  
files\_xfer\_avail int(10) unsigned NOT NULL default '0'  
) TYPE=MyISAM;

CREATE TABLE ftpquotatallies (  
name varchar(30) NOT NULL default '',  
quota\_type enum('user','group','class','all') NOT NULL default 'user',  
bytes\_in\_used int(10) unsigned NOT NULL default '0',  
bytes\_out\_used int(10) unsigned NOT NULL default '0',  
bytes\_xfer\_used int(10) unsigned NOT NULL default '0',  
files\_in\_used int(10) unsigned NOT NULL default '0',  
files\_out\_used int(10) unsigned NOT NULL default '0',  
files\_xfer\_used int(10) unsigned NOT NULL default '0'  
) TYPE=MyISAM;

CREATE TABLE ftpuser (  
id int(10) unsigned NOT NULL auto\_increment,  
userid varchar(32) NOT NULL default '',  
passwd varchar(32) NOT NULL default '',  
uid smallint(6) NOT NULL default '5500',  
gid smallint(6) NOT NULL default '5500',  
homedir varchar(255) NOT NULL default '',  
shell varchar(16) NOT NULL default '/sbin/nologin',  
count int(11) NOT NULL default '0',  
accessed datetime NOT NULL default '0000-00-00 00:00:00',  
modified datetime NOT NULL default '0000-00-00 00:00:00',  
PRIMARY KEY (id),  
UNIQUE KEY userid (userid)  
) TYPE=MyISAM COMMENT='ProFTP user table';

CREATE TABLE IF NOT EXISTS `xferlog` (  
 `username` varchar(100) NOT NULL,  
 `timestamp` datetime NOT NULL,  
 `bytes` int(20) NOT NULL,  
 `file` varchar(255) NOT NULL,  
 `direction` varchar(1) NOT NULL,  
 `ip` varchar(20) NOT NULL,  
 KEY `username` (`username`)  
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

GRANT ALL PRIVILEGES ON FTP.\* to proftpd@localhost identified by 'yourpassword';

INSERT INTO `ftpgroup` (`groupname`, `gid`, `members`) VALUES ('ftpgroup', 2001, 'ftpuser');  
INSERT INTO `ftpuser` (`id`, `userid`, `passwd`, `uid`, `gid`, `homedir`, `shell`, `count`, `accessed`, `modified`) VALUES (1, 'exampleuser', 'secret', 2001, 2001, '/home/www.example.com', '/sbin/nologin', 0, '', '');

quit;  
[/sourcecode]

Download, compile and install proftpd

[sourcecode lang="bash"]  
wget ftp://ftp1.at.proftpd.org/ProFTPD/distrib/source/proftpd-1.3.3c.tar.bz2  
tar jxf proftpd-1.3.3c.tar.bz2  
cd proftpd-1.3.3c  
install\_user=root install\_group=root ./configure --with-modules=mod\_sql:mod\_sql\_mysql:mod\_quotatab:mod\_quotatab\_sql:mod\_sftp --with-includes=/usr/include/mysql/ --with-libraries=/usr/lib/mysql/ --enable-timeout-linger --enable-timeout-stalled --sysconfdir=/etc --localstatedir=/var --prefix=/usr  
make && make install  
[/sourcecode]

Create the init scripts for proftpd in `/etc/ini.d/proftpd` if it doesn't already exist.

[sourcecode lang="bash"]  
#!/bin/sh

### BEGIN INIT INFO  
# Provides: proftpd  
# Required-Start: $syslog $local\_fs $network  
# Required-Stop: $syslog $local\_fs $network  
# Should-Start: $remote\_fs $named  
# Should-Stop: $remote\_fs $named  
# Default-Start: 2 3 4 5  
# Default-Stop: 0 1 6  
# Short-Description: Starts ProFTPD daemon  
# Description: This script runs the FTP service offered  
# by the ProFTPD daemon  
### END INIT INFO

# Start the proftpd FTP daemon.

PATH=/bin:/usr/bin:/sbin:/usr/sbin  
DAEMON=/usr/sbin/proftpd  
NAME=proftpd

# Defaults  
RUN="no"  
OPTIONS=""

PIDFILE=`grep -i 'pidfile' /etc/proftpd/proftpd.conf | sed -e 's/pidfile[t]+//i'`  
if ["x$PIDFILE" = "x"];  
then  
 PIDFILE=/var/run/proftpd.pid  
fi

# Read config (will override defaults)  
[-r /etc/default/proftpd] && . /etc/default/proftpd

trap "" 1  
trap "" 15

test -f $DAEMON || exit 0

. /lib/lsb/init-functions

#  
# Servertype could be inetd|standalone|none.  
# In all cases check against inetd and xinetd support.  
#  
if ! egrep -qi "^[[:space:]]\*ServerType.\*standalone" /etc/proftpd/proftpd.conf  
then  
 if [$(dpkg-divert --list xinetd|wc -l) -eq 1]  
 then  
 if egrep -qi "server[[:space:]]\*=[[:space:]]\*/usr/sbin/proftpd" /etc/xinetd.conf 2\>/dev/null ||  
 egrep -qi "server[[:space:]]\*=[[:space:]]\*/usr/sbin/proftpd" /etc/xinetd.d/\* 2\>/dev/null  
 then  
 RUN="no"  
 INETD="yes"  
 else  
 if ! egrep -qi "^[[:space:]]\*ServerType.\*inetd" /etc/proftpd/proftpd.conf  
 then  
 RUN="yes"  
 INETD="no"  
 else  
 RUN="no"  
 INETD="no"  
 fi  
 fi  
 else  
 if egrep -qi "^ftp.\*/usr/sbin/proftpd" /etc/inetd.conf 2\>/dev/null  
 then  
 RUN="no"  
 INETD="yes"  
 else  
 if ! egrep -qi "^[[:space:]]\*ServerType.\*inetd" /etc/proftpd/proftpd.conf  
 then  
 RUN="yes"  
 INETD="no"  
 else  
 RUN="no"  
 INETD="no"  
 fi  
 fi  
 fi  
fi

# /var/run could be on a tmpfs

[! -d /var/run/proftpd] && mkdir /var/run/proftpd

start()  
{  
 log\_daemon\_msg "Starting ftp server" "$NAME"

start-stop-daemon --start --quiet --pidfile "$PIDFILE" --oknodo --exec $DAEMON -- $OPTIONS  
 if [$? != 0]; then  
 log\_end\_msg 1  
 exit 1  
 else  
 log\_end\_msg 0  
 fi  
}

signal()  
{

if ["$1" = "stop"]; then  
 SIGNAL="TERM"  
 log\_daemon\_msg "Stopping ftp server" "$NAME"  
 else  
 if ["$1" = "reload"]; then  
 SIGNAL="HUP"  
 log\_daemon\_msg "Reloading ftp server" "$NAME"  
 else  
 echo "ERR: wrong parameter given to signal()"  
 exit 1  
 fi  
 fi  
 if [-f "$PIDFILE"]; then  
 start-stop-daemon --stop --signal $SIGNAL --quiet --pidfile "$PIDFILE"  
 if [$? = 0]; then  
 log\_end\_msg 0  
 else  
 SIGNAL="KILL"  
 start-stop-daemon --stop --signal $SIGNAL --quiet --pidfile "$PIDFILE"  
 if [$? != 0]; then  
 log\_end\_msg 1  
 [$2 != 0] || exit 0  
 else  
 log\_end\_msg 0  
 fi  
 fi  
 if ["$SIGNAL" = "KILL"]; then  
 rm -f "$PIDFILE"  
 fi  
 else  
 log\_end\_msg 0  
 fi  
}

case "$1" in  
 start)  
 if ["x$RUN" = "xyes"] ; then  
 start  
 else  
 if ["x$INETD" = "xyes"] ; then  
 echo "ProFTPd is started from inetd/xinetd."  
 else  
 echo "ProFTPd warning: cannot start neither in standalone nor in inetd/xinetd mode. Check your configuration."  
 fi  
 fi  
 ;;

force-start)  
 if ["x$INETD" = "xyes"] ; then  
 echo "Warning: ProFTPd is started from inetd/xinetd (trying to start anyway)."  
 fi  
 start  
 ;;

stop)  
 if ["x$RUN" = "xyes"] ; then  
 signal stop 0  
 else  
 if ["x$INETD" = "xyes"] ; then  
 echo "ProFTPd is started from inetd/xinetd."  
 else  
 echo "ProFTPd warning: cannot start neither in standalone nor in inetd/xinetd mode. Check your configuration."  
 fi  
 fi  
 ;;

force-stop)  
 if ["x$INETD" = "xyes"] ; then  
 echo "Warning: ProFTPd is started from inetd/xinetd (trying to kill anyway)."  
 fi  
 signal stop 0  
 ;;

reload)  
 signal reload 0  
 ;;

force-reload|restart)  
 if ["x$RUN" = "xyes"] ; then  
 signal stop 1  
 sleep 2  
 start  
 else  
 if ["x$INETD" = "xyes"] ; then  
 echo "ProFTPd is started from inetd/xinetd."  
 else  
 echo "ProFTPd warning: cannot start neither in standalone nor in inetd/xinetd mode. Check your configuration."  
 fi  
 fi  
 ;;

status)  
 if ["x$INETD" = "xyes"] ; then  
 echo "ProFTPd is started from inetd/xinetd."  
 exit 0  
 else  
 if [-f "$PIDFILE"]; then  
 pid=$(cat $PIDFILE)  
 else  
 pid="x"  
 fi  
 if [`pidof proftpd|grep "$pid"|wc -l` -ne 0] ; then  
 echo "ProFTPd is started in standalone mode, currently running."  
 exit 0  
 else  
 echo "ProFTPd is started in standalone mode, currently not running."  
 exit 3  
 fi  
 fi  
 ;;

check-config)  
 $DAEMON -t \>/dev/null && echo "ProFTPd configuration OK" && exit 0  
 exit 1  
 ;;

\*)  
 echo "Usage: /etc/init.d/$NAME {start|status|force-start|stop|force-stop|reload|restart|force-reload|check-config}"  
 exit 1  
 ;;  
esac

exit 0  
[/sourcecode]

Create the server keys for use with SFTP

[sourcecode lang="bash"]  
ssh-keygen -t rsa  
ssh-keygen -t dsa  
[/sourcecode]

Edit `/etc/proftpd/proftpd.conf` and append the following to the end:

[sourcecode lang="bash"]  
SFTPEngine on # use SFTP instead of FTP  
Port 2222  
SFTPHostKey /root/.ssh/id\_rsa  
SFTPHostKey /root/.ssh/id\_dsa

DefaultRoot ~ # Jail the FTP users to within their homedir  
SQLAuthTypes Plaintext Crypt  
SQLAuthenticate users\* groups\*

# Connection string in the format database@host user password  
SQLConnectInfo ftp@localhost root yourpassword  
SQLUserInfo ftpuser userid passwd uid gid homedir shell  
SQLGroupInfo ftpgroup groupname gid members  
SQLMinID 500  
CreateHome on

SQLLog PASS updatecount  
SQLNamedQuery updatecount UPDATE "count=count+1, accessed=now() WHERE userid='%u'" ftpuser  
SQLLog STOR,DELE modified  
SQLNamedQuery modified UPDATE "modified=now() WHERE userid='%u'" ftpuser

RootLogin off  
RequireValidShell off

# IMPORTANT: required for bandwidth accounting  
TransferLog /var/log/proftpd/xferlog  
SystemLog /var/log/proftpd/proftpd.log  
[/sourcecode]

Enable the required modules by uncommenting the following lines in `/etc/proftpd/modules.conf`.

[sourcecode lang="bash"]  
LoadModule mod\_sql.c  
LoadModule mod\_sql\_mysql.c  
[/sourcecode]

Start the proftpd server and test it out by connecting to it through your FTP client. In this example, the username is `exampleuser` and password is `secret`.

[sourcecode lang="bash"]  
/etc/init.d/proftpd start  
[/sourcecode]

For the monthly bandwidth accounting report, you need to enable logrotate and call it through cron. First, setup the database configurations and helper functions. This will be `/usr/src/ftpan/config.php`:

[sourcecode lang="php"]  
// Database credentials  
$db\_host = "localhost";  
$db\_user = "username";  
$db\_pass = "yourpassword";  
$db\_sele = "ftp";  
$db\_table = "xferlog";  
$db\_user\_table = "ftpuser";  
$TO\_EMAIL = "admin@email.address.com";

function log\_error($str){  
 return;  
}  
function str\_log($str){  
 global $verbose;  
 if($verbose \> 0)  
 echo $str . "n";  
}  
function byte\_size($bytes){  
 $size = $bytes / 1024;  
 if($size \< 1024)  
 {  
 $size = number\_format($size, 2);  
 $size .= ' KB';  
 }  
 else  
 {  
 if($size / 1024 \< 1024)  
 {  
 $size = number\_format($size / 1024, 2);  
 $size .= ' MB';  
 }  
 else if ($size / 1024 / 1024 \< 1024)  
 {  
 $size = number\_format($size / 1024 / 1024, 2);  
 $size .= ' GB';  
 }  
 }  
 return $size;  
 }  
?\>  
[/sourcecode]

Then, create a script that will read a transfer log file and populate the database: `/usr/src/ftpan/analyze-proftpd.php`.

[sourcecode lang="php"]  
\<?php  
require\_once('config.php');  
$verbose = 1;

// get the file name  
$logfile = $argv[1];  
str\_log("Processing log file: $logfile =================================================== ");  
/// connect to the db  
mysql\_connect($db\_host, $db\_user, $db\_pass);  
@mysql\_select\_db($db\_sele) or die( "Unable to access database");

// open the logfile and process it line by line  
$fp = fopen($logfile, 'r');  
while ( ($inline = fgets($fp)) !== false) {  
 // process the file and insert all logs  
 $inline = trim($inline);

$tok = strtok($inline, " ");  
 $weekday = $tok; $tok = strtok(" ");  
 $month = $tok; $tok = strtok(" ");  
 $day = $tok; $tok = strtok(" ");  
 $timestamp = $tok; $tok = strtok(" ");  
 $year = $tok; $tok = strtok(" ");  
 $skip = $tok; $tok = strtok(" ");  
 $ip = $tok; $tok = strtok(" ");  
 $bytes = $tok; $tok = strtok(" ");  
 $file = $tok; $tok = strtok(" ");  
 $skip = $tok; $tok = strtok(" ");  
 $skip = $tok; $tok = strtok(" ");  
 $direction = $tok; $tok = strtok(" ");  
 $skip = $tok; $tok = strtok(" ");  
 $user= $tok; $tok = strtok(" ");

$str\_stamp = "$month $day $year $timestamp";  
 $stamp = date('Y-m-d H:i:s', strtotime($str\_stamp));

str\_log("Retrieved data: $user $stamp $bytes $file $direction $ip");

// select to make sure this exact record has not already been entered. (Just in case)  
 $query = "select \* from $db\_table where username = '$user' AND timestamp='$stamp' AND bytes='$bytes' AND direction='$direction' AND ip='$ip';";  
 $result = mysql\_query($query);

if(mysql\_num\_rows($result) \> 0){  
 str\_log("Log entry at stamp $stamp for user $user already exists. Skipping.");  
 continue;  
 }

// if not, insert it  
 $query = "INSERT into $db\_table (username, timestamp, bytes, file, direction, ip)  
 VALUES ('$user', '$stamp', '$bytes', '$file', '$direction', '$ip'); ";

$result = mysql\_query($query);  
 echo mysql\_error();

if($result \< 1)  
 str\_log("error inserting query: $user $stamp");

}  
// (manually) call the generate CSV for the generation of CSV reports  
?\>  
[/sourcecode]

Finally, create a CSV generation script that will get data from the database and send it through email as well as saving it in the folder. We call it `/usr/src/ftpan/generate-csv.php`.

[sourcecode lang="php"]  
\<?php  
require\_once('config.php');  
$verbose = 1;

// select the data into a CSV and write to the file named as this stamp;  
$date\_now = date('Y-m-d');  
$this\_month = date('m');  
$this\_year = date('Y');  
// make sure this is changed to LAST month instead of this month when deploying : done  
$date\_begin = date('Y-m-d H:i:s', mktime(0, 0, 0, $this\_month -1, 1, $this\_year));  
$date\_end = date('Y-m-d H:i:s', mktime(11, 59, 59, $this\_month, 0, $this\_year));

str\_log("Processing on date: $date\_now =======================================================");  
str\_log($date\_begin);  
str\_log($date\_end);

$OUTFILE = "proftpd-usage-report-" . $date\_now . ".csv";

$fo = fopen($OUTFILE, "w");

mysql\_connect($db\_host, $db\_user, $db\_pass);  
@mysql\_select\_db($db\_sele) or die( "Unable to access database");

// find the distinct usernames from the table  
$query = "select userid, homedir from $db\_user\_table;";  
$result = mysql\_query($query);

while($row = mysql\_fetch\_array($result)){  
 // for each user  
 $username = $row['userid'];  
 $homedir = $row['homedir'];

str\_log("Finding totals for $username");

// select the total "in" in this month  
 $query2 = "select sum(bytes) from $db\_table where username = '$username'  
 AND direction = 'i'  
 AND timestamp \>= '$date\_begin' AND timestamp \<= '$date\_end';";  
 str\_log($query2);  
 $result2 = mysql\_query($query2);

$row2 = mysql\_fetch\_array($result2);  
 $in\_total = intval($row2[0]);  
 str\_log("In total was: $in\_total");

// select the total "out" in this month  
 $query2 = "select sum(bytes) from $db\_table where username = '$username'  
 AND direction = 'o'  
 AND timestamp \>= '$date\_begin' AND timestamp \<= '$date\_end';";  
 $result2 = mysql\_query($query2);

$row2 = mysql\_fetch\_array($result2);  
 $out\_total = intval($row2[0]);  
 str\_log("In total was: $out\_total");

// set the total  
 $grand\_total = byte\_size($in\_total + $out\_total);  
 str\_log("Grand total was: $grand\_total");

//output to the CSV file  
 $outline = "$username, $homedir, $in\_total, $out\_total, $grand\_total, $this\_month, $this\_year";  
 str\_log("Gen: $outline");  
 fwrite($fo, trim($outline) . "n");  
}  
mysql\_close();

$to = $TO\_EMAIL;  
$subject = 'ProFTPd usage report';  
$random\_hash = md5(date('r', time()));  
$headers = "From: admin@jasonn.comrnReply-To: admin@jasonn.com";  
$headers .= "rnContent-Type: multipart/mixed; boundary="PHP-mixed-".$random\_hash.""";  
$attachment = chunk\_split(base64\_encode(file\_get\_contents($OUTFILE)));  
ob\_start(); //Turn on output buffering  
?\>  
--PHP-mixed-\<?php echo $random\_hash; ?\>  
Content-Type: multipart/alternative; boundary="PHP-alt-\<?php echo $random\_hash; ?\>"

--PHP-alt-\<?php echo $random\_hash; ?\>  
Content-Type: text/plain; charset="iso-8859-1"  
Content-Transfer-Encoding: 7bit

Attached is the usage report CSV for proftpd server.

--PHP-alt-\<?php echo $random\_hash; ?\>  
Content-Type: text/html; charset="iso-8859-1"  
Content-Transfer-Encoding: 7bit

Attached is the usage report CSV for proftpd server.

--PHP-alt-\<?php echo $random\_hash; ?\>--

--PHP-mixed-\<?php echo $random\_hash; ?\>  
Content-Type: application/zip; name="\<?php echo $OUTFILE; ?\>"  
Content-Transfer-Encoding: base64  
Content-Disposition: attachment

\<?php echo $attachment; ?\>  
--PHP-mixed-\<?php echo $random\_hash; ?\>--

\<?php  
$message = ob\_get\_clean();  
$mail\_sent = @mail( $to, $subject, $message, $headers );  
//if the message is sent successfully print "Mail sent". Otherwise print "Mail failed"  
echo $mail\_sent ? "Mail sent" : "Mail failed";  
?\>  
[/sourcecode]

The final thing we need is to have our trasnfer log rotated and then these scripts called on the the last month's logrotate. For that, edit (or create) the `/etc/logrotate.d/proftpd-basic` file and add the following rule to it:

[sourcecode lang="bash"]  
/var/log/proftpd/xferlog  
# /var/log/proftpd/xferreport  
{  
 monthly  
 missingok  
 rotate 7  
 compress  
 delaycompress  
 # keep 1/2 year worth of logs  
 rotate 6  
 notifempty  
 create 640 root adm  
 sharedscripts  
 prerotate  
 endscript  
 postrotate  
 # reload could be not sufficient for all logs, a restart is safer  
 invoke-rc.d proftpd restart 2\>/dev/null \>/dev/null || true

# call the analyzer and pass it the last log file  
 /usr/bin/php /usr/src/ftpan/analyze-proftpd.php /var/log/proftpd/xferlog.1 \>\> /usr/src/ftpan/analysis.log  
 /usr/bin/php /usr/src/ftpan/generate-csv.php \>\> /usr/src/ftpan/generation.log  
 endscript  
}  
[/sourcecode]

Logrotate should be called daily (our files will be rotated monthly but logrotate itself should be called on a daily basis). If it isn't enabled already, enable it by adding the following line to `crontab -e`.

[sourcecode lang="bash"]  
1 0 \* \* \* /usr/sbin/logrotate /etc/logrotate.conf  
[/sourcecode]


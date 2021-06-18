---
layout: post
title: Enabling Voicemail for A2billing
date: 2011-02-08 09:25:25.000000000 +05:00
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
  video_type: "#NONE#"
  _edit_last: '2'
  Image: ''
  _syntaxhighlighter_encoded: '1'
  _wp_old_slug: '560'
  original_post_id: '560'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2011/02/08/enabling-voicemail-for-a2billing/"
---
So you've setup a2billing and have everything working out, all the DIDs are forwarded to a2billing and all the call plans are set. All you're missing is a voicemail system. Wait no more. Here's how to enable voicemail for a2billing users.

First, you need to change the A2billing class to enable it to forward unavailable or unattended calls to the voicemail. For that, edit the `[a2billing-home]/common/lib/Class.A2billing.php file` file. The two functions that need changing are the `call_did` and `call_sip_buddies`. In version 1.8.5, the changes are around line 1160 and 1330. You can just search for the following code to reach there. (Remember, there are two instances that need changing.)

[sourcecode lang="php"]  
//# Ooh, something actually happend!  
if ($dialstatus == "BUSY") {  
[/sourcecode]

Now, it needs to be changed so that the caller is redirected to the voicemail if the `dialstatus` is `CHANUNAVAIL`, `CONGESTION` or `NOANSWER`. Note that we need to get rid of the existing checks for these statuses and introduce our own code. The complete code would be as follows:

[sourcecode lang="php"]  
$answeredtime."-DIALSTATUS=".$dialstatus."]");  
$lang = "en";  
if (($dialstatus =="CHANUNAVAIL") || ($dialstatus == "CONGESTION") ||($dialstatus == "NOANSWER") || ($dialstatus =="BUSY") )  
{  
 // The following section will send the caller to VoiceMail with the unavailable priority.  
 $did\_ext\_number = substr($this-\>destination, 4);  
 // get the actual did  
 // BAD but a hack for now  
 $db\_host = $this-\>config['database']['hostname'];  
 $db\_user = $this-\>config['database']['user'];  
 $db\_pass = $this-\>config['database']['password'];  
 $db\_sele = $this-\>config['database']['dbname'];

mysql\_connect($db\_host, $db\_user, $db\_pass);  
 @mysql\_select\_db($db\_sele) or die( "Unable to access database");  
 $query = "select S.name, D.did, C.language from cc\_sip\_buddies S, cc\_card C , cc\_did\_destination E, cc\_did D  
 where S.id\_cc\_card =C.id and E.id\_cc\_card = C.id and E.id\_cc\_did = D.id and  
 S.name = '$did\_ext\_number';";

$result = mysql\_query($query);  
 $did\_number = $did\_ext\_number;  
 if ($row = mysql\_fetch\_array($result)){  
 if($dialstatus =="BUSY")  
 $did\_number = "b".$row["did"];  
 else  
 $did\_number = "u".$row["did"];

// set the language  
 $lang = $row["language"];  
 }

$this -\> write\_log("[STATUS] CHANNEL UNAVAILABLE - DIVERT TO VOICEMAIL ($did\_number)");  
 $lang\_str = "LANGUAGE()=$lang";  
 $agi-\>exec (Set, $lang\_str);  
 $agi-\> exec(VoiceMail,$did\_number);  
}

// the old code for BUSY is commented out  
//# Ooh, something actually happend!  
/\* if ($dialstatus == "BUSY") {  
 $answeredtime = 0;  
 if ($this-\>agiconfig['busy\_timeout'] \> 0)  
 $res\_busy = $agi-\>exec("Busy ".$this-\>agiconfig['busy\_timeout']);  
 $agi-\> stream\_file('prepaid-isbusy', '#');  
} elseif ($this-\>dialstatus == "NOANSWER") {  
 $answeredtime = 0;  
 $agi-\> stream\_file('prepaid-noanswer', '#');  
} else  
\*/

if ($dialstatus == "CANCEL") {  
 $answeredtime = 0;  
} elseif ($dialstatus == "ANSWER") {  
 $this -\> debug( DEBUG, $agi, \_\_FILE\_\_, \_\_LINE\_\_, "-\> dialstatus : $dialstatus, answered time is ".$answeredtime." n");  
} elseif ($k+1 == $sip\_buddies+$iax\_buddies) {  
 $prompt="prepaid-dest-unreachable";  
 $agi-\> stream\_file($prompt, '#');  
}

/\*  
// AGAIN, the old code for the statuses is commented out  
if (($dialstatus == "CHANUNAVAIL") || ($dialstatus == "CONGESTION"))  
 continue;  
\*/  
[/sourcecode]

Find the similar code in the other function and change that too.

Now, we need to change the asterisk voicemail configuration to recognize the DID as a mailbox. For that, first enable asterisk realtime. (It's a simple matter of compiling asterisk and then compiling asterisk-addons.) After that is done, change the `/etc/asterisk/res_mysql.conf` file as follows:

[sourcecode lang="bash"]  
[general]  
dbhost = 127.0.0.1  
dbname = a2billingdb  
dbuser = [asteriskuser]  
dbpass = [yourpassword]  
dbport = 3306  
dbsock = /tmp/mysql.sock  
[/sourcecode]

Also, in the `/etc/asterisk/extconfig.conf` add the following line:

[sourcecode]  
voicemail =\>mysql,a2billingdb,voicemail\_users  
[/sourcecode]

This will make sure that the voicemail application tries to find the list of mailboxes in the `voicemail_users` table in the `a2billingdb`. Let's create that table:

[sourcecode lang="sql"]  
CREATE TABLE `voicemail_users` (  
`uniqueid` int(11) NOT NULL auto\_increment,  
`customer_id` int(20) NOT NULL default '0',  
`context` varchar(50) NOT NULL default '',  
`mailbox` varchar(20) NOT NULL default '0',  
`password` varchar(20) NOT NULL default '8888',  
`fullname` varchar(50) NOT NULL default '',  
`email` varchar(50) NOT NULL default '',  
`pager` varchar(50) NOT NULL default '',  
`stamp` timestamp(14) NOT NULL,  
PRIMARY KEY (`uniqueid`),  
KEY `mailbox_context` (`mailbox`,`context`)  
) TYPE=MyISAM;  
[/sourcecode]

... and synchronize it with the rest of the a2billing database so that the users can use their DID and SIP secret for their mailboxes.

[sourcecode lang="sql"]  
insert into voicemail\_users(customer\_id,context,mailbox, password, fullname, email)  
select S.id\_cc\_card, 'default', D.did, S.secret, concat(C.lastname,' ',C.firstname) fullname, C.email  
from cc\_sip\_buddies S, cc\_card C , cc\_did\_destination E, cc\_did D  
where S.id\_cc\_card =C.id  
and E.id\_cc\_card = C.id  
and E.id\_cc\_did = D.id;  
[/sourcecode]

You might want to add the following cronjob to perform this synchronization automatically.

[sourcecode lang="bash"]  
0 \* \* \* \* mysql -ua2billinguser -p[yourpassword] -D a2billingdb -e "truncate table voicemail\_users; insert into voicemail\_users(customer\_id,context,mailbox, password, fullname, email) select S.id\_cc\_card, 'default', D.did, S.secret, concat(C.lastname,' ',C.firstname) fullname, C.email from cc\_sip\_buddies S, cc\_card C , cc\_did\_destination E, cc\_did D where S.id\_cc\_card =C.id and E.id\_cc\_card = C.id and E.id\_cc\_did = D.id ;"  
[/sourcecode]

That should fix the whole voicemail recording business. However, we still need to enable the voicemail interface provided by FreePBX. Since the ARI does not support asterisk realtime, we need to change the `login.php` file in `/var/www/html/admin/includes` folder. Search out the code where the authentication is being done. The code first tries to autenticate using the configuration file. It then tries SIP authentication (whatever that is). After that, we insert our own DB authentication like so:

[sourcecode lang="php"]  
// check database login: recly  
if(!$auth){  
 // BAD but a hack for now  
 $db\_host = "localhost";  
 $db\_user = "a2billinguser";  
 $db\_pass = "[yourpassword]";  
 $db\_sele = "a2billingdb";

mysql\_connect($db\_host, $db\_user, $db\_pass);  
 @mysql\_select\_db($db\_sele) or die( "Unable to access database");

$query = "select \* from `voicemail_users` where mailbox = '$username' and password= '$password'";  
 $result = mysql\_query($query);

if ($row = mysql\_fetch\_array($result)){  
 $auth = true;  
 $extension = $row["mailbox"];  
 $outboundCID = "";  
 $displayname = $row["fullname"];  
 $vm\_password = $row["password"];  
 $category = "";  
 $context = $row["context"];  
 $voicemail\_enabled = "1";  
 $voicemail\_email\_address = $row["email"];  
 $voicemail\_pager\_address = $row["pager"];  
 $voicemail\_email\_enable = "yes";  
 $voicemail\_email = array('');  
 $default\_page = $ARI\_DEFAULT\_USER\_PAGE;  
 }  
}  
// the original login failure lines follow

// let user know bad login  
if (!$auth) {  
 $\_SESSION['ari\_error'] = \_("Incorrect Username or Password");  
}  
[/sourcecode]

And that should enable you to login using your ARI. One final thing: You might also want to enable your users to check their mailbox. For that, change the dialplan in `extensions_a2billing.conf`:

[sourcecode lang="bash"]  
[a2billing]  
exten =\> 9999,1,VoicemailMain()  
exten =\> \_X.,1,Answer  
exten =\> \_X.,n,Wait(1)  
exten =\> \_X.,n,DeadAGI(a2billing.php|1)  
exten =\> \_X.,n,Hangup  
[/sourcecode]

Now your users can dial 9999 and check up on their voicemail.


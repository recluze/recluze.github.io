---
layout: post
title: Web Fax for Asterisk
date: 2010-10-18 13:47:32.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Geek stuff
- Linux
- resources
- Tutorials
tags: []
meta:
  _wpas_done_all: '1'
  _publicize_pending: '1'
  _edit_last: '2'
  _syntaxhighlighter_encoded: '1'
  _wp_old_slug: '506'
  original_post_id: '506'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2010/10/18/web-fax-for-asterisk/"
---
Over the past few weeks, I have been working with the popular telephony software asterisk and all the stack that stands on top of it. I have (in coordination with a [friend](http://csrdu.org/toqeer)) setup asterisk, FreePBX, a2billing, fax for asterisk and vicidial on several production servers. Combined, these provide a complete telephony solution for a wide range of commercial organizations. As a side note, I might be writing tutorials about some of these things in the future.

One of most problematic of these technologies was getting fax to work with asterisk. We tried many variations and finally found out that Digium's Fax for Asterisk, or Free Fax for Asterisk (FFA) is currently the most stable and easy to set up. However, it does not provide an easy way to let your end users send faxes if they don't have SIP enabled fax machines. What's more, there is no software available that would allow you to do that! So, in one of our projects, we had to come up with a custom interface and we decided to open it up so that many others who need it can benefit from our efforts and hopefully build on it.

We call this PHP-based script _Web Fax for Asterisk_ and are releasing it under GPLv3. For those of you who just want to get the code, you can get it from [sourceforge.net](http://sf.net/projects/webfax). You can also get it from the SF [SVN repo](https://sourceforge.net/scm/?type=svn&group_id=363461) if you want to contribute. (In that case, gimme a shout and I'll allow you to commit.)

For those of you who want to learn how it's made, please read on.

<!--more-->

First you need to install asterisk and get FFA to work. Search for any asterisk installation tutorial (you'll need to go with 1.6 if you want the more stable T.38 support) and then follow [this guide](http://downloads.digium.com/pub/telephony/fax/README) to setup FFA. You should also setup FreePBX and get the Fax Configuration module from Schmoozecom. That would help you configure FFA so that your clients can receive faxes in their mailboxes. After that, you can begin with our Web Fax script to enable sending.

**Web Fax for Asterisk**

The rest of this post will first describe the code that has gone into Web Fax 0.1. At the end, we will cover the installation instructions to get your started. Let's begin with the HTML form that the users see. It's a fairly simple form which has some error checking. Web Fax currently supports DOC and PDF formats so you should include some instructions about this in your form. I'll post the skeleton code here. The Web Fax archive contains a much better interface. So, the form:

[sourcecode lang="html"]  
\<form action="sendfax.php" method="post" enctype="multipart/form-data" name="form1" id="form1"\>  
 \<table\>  
 \<tr\>  
 \<td width="188" class="formLabel"\>FAX Header\</td\>  
 \<td width="232"\>  
 \<input name="faxHeader" type="text" id="faxHeader" value="CSRDU" /\>\</td\>  
 \</tr\>  
 \<tr\>  
 \<td class="formLabel"\>Local Station Identifier\</td\>  
 \<td\>  
 \<input name="localID" type="text" id="localID" value="3239366136" /\>\</td\>  
 \</tr\>  
 \<tr\>  
 \<td class="formLabel"\>Notification Email Address \</td\>  
 \<td\>  
 \<input name="email" type="text" id="email" value="recluze@gmail.com" /\>\</td\>  
 \</tr\>  
 \<tr\>  
 \<td class="formLabel"\>FAX Destination\</td\>  
 \<td\>  
 \<input name="dest" type="text" id="dest" value="14809073626" /\>\</td\>  
 \</tr\>  
 \<tr\>  
 \<td class="formLabel"\>Attach file\</td\>  
 \<td\>  
 \<input type="file" name="faxFile" id="faxFile" /\>\</td\>  
 \</tr\>  
 \<tr\>  
 \<td\>&nbsp;\</td\>  
 \<td\>\<input type="submit" name="sendFax" id="sendFax" value="Send FAX" /\>\</td\>  
 \<td\>&nbsp;\</td\>  
 \</tr\>  
 \</table\>  
\</form\>  
[/sourcecode]

The sendfax.php script does all the heavy lifting of communicating the information provided by the user to asterisk. It first uploads the document, converts it to tif format as required by Fax for Asterisk and then makes a call through asterisk. Let's take a look at the salient parts of this script.

**SendFax script**

Uploading the document is easy. All we need to do is to check what format the document is in. We currently support .doc and .pdf formats. The strategy for .doc is to first convert it to .pdf. For that, we use the wvPDF command. (wvPDF requires tetex-latex or another package providing latex). We first save the uploaded .doc file with a temporary name in /tmp. Then we convert it.

[sourcecode lang="php"]  
$input\_file\_noext = unique\_name("/tmp", "");  
$input\_file = $input\_file\_noext . ".pdf";  
$input\_file\_tif = $input\_file\_noext . ".tif";  
$input\_file\_doc = $input\_file\_noext . ".doc";

// needs the following in /etc/sudoers  
// asterisk ALL=(ALL) NOPASSWD: /usr/bin/wvPDF  
$wv\_command = "sudo /usr/bin/wvPDF $input\_file\_doc $input\_file" ;  
$wv\_command\_output = system($wv\_command, $retval);  
[/sourcecode]

Notice the commented out lines. For some reason, latex won't run from PHP. So, we add the wvPDF to /etc/sudoers file for user asterisk -- we're running apache as the user asterisk.

Now that we have a .pdf file -- whether through conversion from .doc or originally from the user -- we can convert it to .tif through ghostscript. (Make sure it's installed.)

[sourcecode lang="php"]  
$gs\_command = "gs -q -dNOPAUSE -dBATCH -dSAFER -sDEVICE=tiffg3 -sOutputFile=${input\_file\_tif} -f $input\_file " ;  
$gs\_command\_output = system($gs\_command, $retval);  
$doc\_convert\_output = $gs\_command\_output;  
[/sourcecode]

Finally, we need to create a .call file that will automate asterisk making a call. We set some parameters, create the file and move it to asterisk's outgoing directory.

[sourcecode lang="php"]  
$faxHeader = $\_POST["faxHeader"];  
$localID = $\_POST["localID"];  
$email = $\_POST["email"];  
$dest = $\_POST["dest"];

$outbound\_route = "@outbound-allroutes";  
$outboundfax\_context = "outboundfax";

$callfile = "Channel: Local/$dest$outbound\_routen" .  
 "MaxRetries: 1n" .  
 "RetryTime: 60n" .  
 "WaitTime: 60n" .  
 "Archive: yesn" .  
 "Context: $outboundfax\_context n" .  
 "Extension: sn" .  
 "Priority: 1n" .  
 "Set: FAXFILE=$input\_file\_tifn" .  
 "Set: FAXHEADER=$faxHeadern" .  
 "Set: TIMESTAMP=" . date("d/m/y : H:i:s",time()) . "n" .  
 "Set: DESTINATION=$destn".  
 "Set: LOCALID=$localIDn" .  
 "Set: EMAIL=$emailn";

// create the call file in /tmp  
$callfilename = unique\_name("/tmp", ".call");  
$f = fopen($callfilename, "w");  
fwrite($f, $callfile);  
fclose($f);

// $asterisk\_spool\_folder is usually /var/spool/asterisk/outgoing  
rename($callfilename, $asterisk\_spool\_folder . "/" . substr($callfilename,4));  
[/sourcecode]

Notice the channel and context fields in the call file. The channel will depend on your outbound route. I found that outboud-allroutes worked for my settings. You might want to try that if you're not sure of the route. The last thing we need to do is to create a context for sending fax within asterisk conf files.

**Outbout Fax Context**

The context should ideally be created in /etc/asterisk/extensions\_additional.conf. You should also make sure that this file is 'included' in extensions.conf. The content of the context follow:

[sourcecode]  
[outboundfax]  
exten =\> s,1,Set(FAXOPT(filename)=${FAXFILE})  
exten =\> s,n,Set(FAXOPT(ecm)=yes)  
exten =\> s,n,Set(FAXOPT(headerinfo)=${FAXHEADER})  
exten =\> s,n,Set(FAXOPT(localstationid)=${LOCALID})  
exten =\> s,n,Set(FAXOPT(maxrate)=14400)  
exten =\> s,n,Set(FAXOPT(minrate)=2400)  
exten =\> s,n,SendFAX(${FAXFILE},d)  
exten =\> s,n,System(${ASTVARLIBDIR}/bin/faxnotify.php INIT "${EMAIL}" "${DESTINATION}" "${TIMESTAMP}" "NO\_STATUS" "NO\_PAGES")  
exten =\> h,1,NoOp(FAXOPT(ecm) : ${FAXOPT(ecm)})  
exten =\> h,n,NoOp(FaxStatus : ${FAXSTATUS})  
exten =\> h,n,NoOp(FaxStatusString : ${FAXSTATUSSTRING})  
exten =\> h,n,NoOp(FaxError : ${FAXERROR})  
exten =\> h,n,NoOp(RemoteStationID : ${REMOTESTATIONID})  
exten =\> h,n,NoOp(FaxPages : ${FAXPAGES})  
exten =\> h,n,NoOp(FaxBitRate : ${FAXBITRATE})  
exten =\> h,n,NoOp(FaxResolution : ${FAXRESOLUTION})  
exten =\> h,n,System(${ASTVARLIBDIR}/bin/faxnotify.php NOTIFY "${EMAIL}" "${DESTINATION}" "${TIMESTAMP}" "${FAXSTATUSSTRING}" "${FAXPAGES}")  
; end of outboundfax context  
[/sourcecode]

The important lines are the ones with 'SendFax' and 'System' calls. SendFax sends the fax (duh!) and system calls out notification script that sends an email to the user describing the status of the transmission. The notification script is essentially a mailer. You can refer to the Web Fax source for the complete script.

And that is how we implemented the Web Fax for Asterisk script.


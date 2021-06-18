---
layout: post
title: Setting up Exim to Use Amazon Simple Email Service (SES)
date: 2011-08-12 13:42:12.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Tutorials
tags: []
meta:
  _wpas_done_all: '1'
  _publicize_pending: '1'
  _s2mail: 'yes'
  _edit_last: '2'
  _syntaxhighlighter_encoded: '1'
  original_post_id: '659'
  _wp_old_slug: '659'
  _oembed_e0bb97a12d49d7bcef8971ff3f39fa31: "{{unknown}}"
  _oembed_13dd34142d680e0c83c9404bcb1d926d: "{{unknown}}"
  _oembed_aa1fc8e61d21d528cb8fb2a691140d62: "{{unknown}}"
  _oembed_166fa5c23c78d69d89cde7b11f01f410: "{{unknown}}"
  _oembed_670330ca24daa9435d7d8f9a60491099: "{{unknown}}"
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2011/08/12/setting-up-exim-to-use-amazon-simple-email-service-ses/"
---
Amazon Simple Email Service (SES) is a Email Marketer's dream come true. It allows you to send bulk emails to customers without fear of having your email land in their spam/junk folder -- unless of course you're sending spam and a huge majority of your "customers" start marking it as such.

More to the point, it's very easy to setup SES with [sendmail](http://docs.amazonwebservices.com/ses/latest/DeveloperGuide/index.html?IntegratingWithServer.Sendmail.html) and [postfix](http://docs.amazonwebservices.com/ses/latest/DeveloperGuide/index.html?IntegratingWithServer.Postfix.html). However, if you're like most small/medium businesses, you're using cPanel to host your site and that comes with Exim as the mail server. Of course, Amazon forgot to add instructions for Exim and so, here you are. Let's begin.<!--more-->

First, I assume you're using the standard cPanel Exim configuration which is a combined file. If you're using a split config, you should take a look at [this page](http://www.debian-administration.org/users/lee/weblog/42) (which is where I learned this stuff in the first place).

So, the first thing you want to do is sign up with AWS and then SES and get your _AWS Access Key_ and _Secret_ (try [this link](http://www.sdbexplorer.com/documentation/simpledb--what-is-my-aws-access-and-secret-key-simpledb.html) if you don't know what that is). Once you have that, it's time to download the basic official perl scripts that interact with SES.

[sourcecode lang="bash"]  
cd /usr/local/  
wget http://aws-catalog-download-files.s3.amazonaws.com/AmazonSES-2011-03-03.zip  
unzip AmazonSES-2011-03-03.zip  
cd bin/  
vi aws-credentials  
[/sourcecode]

Add the following two lines to it:

[sourcecode]  
AWSAccessKeyId=your+access+key+id  
AWSSecretKey=secret  
[/sourcecode]

Then run:

[sourcecode lang="bash"]  
./ses-get-stats.pl -k aws-credentials -s  
./ses-verify-email-address.pl -k aws-credentials --verbose -v new\_email@here.com  
[/sourcecode]

Receive an email on the address you provided, click on the link. Access to that email inbox is all you need to verify. After that, you can use this email address to send emails from SES. This is important. When you first sign up, you are in "sandbox" mode. You can only send emails from verified emails and to verified emails. After you're done testing, you can [request production access](http://aws.amazon.com/ses/fullaccessrequest) and you will be able to send emails to unverified emails. From addresses always need to be verified -- which is a good thing.

After the verification, you can send an email like so:

[sourcecode lang="bash"]  
root@ec2-50-19-42-220:~/ses-script/bin# ./ses-send-email.pl -k /usr/local/bin/aws-credentials -s Test -f verified@email.com another\_verified@email.com \< test.txt  
root@ec2-50-19-42-220:~/ses-script/bin# ./ses-send-email.pl -k /usr/local/bin/aws-credentials -s Test -f verified@email.com unverified@email.com \< test.txt  
Email address is not verified.  
[/sourcecode]

Finally, copy the SES.pm file to the Perl library and make the credential files readable.

[sourcecode lang="bash"]  
cp SES.pm /usr/local/lib/perl5/5.8.8/  
chmod 644 /usr/local/bin/aws\_credentials  
[/sourcecode]

Or wherever your Perl libraries are. So, that's all good. Now that we have SES scripts setup, we need to tell Exim how to use it. Open up `/etc/exim.conf` (or whereever those config are) and add the following to the top:

[sourcecode]  
AWS\_SES\_SEND\_EMAIL = /usr/local/bin/ses-send-email.pl  
## File must be readable by the running exim group (e.g. Debian-exim)  
AWS\_CREDENTIALS\_FILE = /usr/local/bin/aws-credentials  
## the SES verified sender  
AWS\_SES\_SENDER = lsearch\*@;/usr/local/bin/ses\_senders  
## currently useless as there's only one endpoint offered. We're not using it.  
# AWS\_SES\_ENDPOINT = https://email.us-east-1.amazonaws.com/  
[/sourcecode]

Define a router for the email using the following just after `begin router` construct.

[sourcecode]  
begin routers

aws\_ses:  
 debug\_print = "R: aws\_ses for $local\_part@$domain"  
 driver = accept  
 senders = AWS\_SES\_SENDER  
 require\_files = AWS\_SES\_SEND\_EMAIL : AWS\_CREDENTIALS\_FILE  
 transport = aws\_ses\_pipe  
 no\_more  
[/sourcecode]

The most important line there is the `senders` command. Notice the variable use. We defined this variable above. Simply put all your verified emails line-separated in the file `/usr/local/bin/ses_senders` and make sure Exim can read it. It basically says that this router will be fired/picked if the sender is in the file pointed to by this variable. The effect of this is that you can put all your SES verified email addresses in the ses\_senders file and the SES routing will be used only for those emails that come from these verified emails. All other emails will go through the normal route -- which is good since Amazon will reject all emails coming from non-verified email addresses. If your usecase is such that you absolutely don't want any email going out unless the email is verified, you can simply comment out the `senders` line. That way, _all_ emails will go through SES and get rejected if they aren't from verified addresses. Phew! That was long-winded.

Anyway, the final change is to add the following just after `begin transports`:

[sourcecode]  
begin transports

aws\_ses\_pipe:  
 debug\_print = "T: aws\_ses\_pipe for $local\_part@$domain"  
 driver = pipe  
 command = AWS\_SES\_SEND\_EMAIL -k AWS\_CREDENTIALS\_FILE -r  
 "${if !eq{AWS\_SES\_ENDPOINT}{} {-e}}"  
 "${if !eq{AWS\_SES\_ENDPOINT}{} {AWS\_SES\_ENDPOINT}}"  
 -f $h\_from: $local\_part@$domain  
 freeze\_exec\_fail = true  
 message\_prefix =  
 return\_fail\_output = true  
[/sourcecode]

The important parameter to the command above is the `-r`. Well, they're all important but this specific one tell the SES script that a raw email will be sent to it instead of just the message body. That's what Exim sends and that's what the script should expect. (By the way, if you get an error in your exim\_mainlog saying `Child process of aws_ses_pipe transport returned 1 from command: /usr/local/bin/ses-send-email.pl`, you might want to try getting rid of the two lines with the `${if...}`. They mess up the parameters to the SES script in some cases.

Finally, to test it out, you can create a simple PHP script that sends emails:

[sourcecode lang="php"]  
\<?php  
$headers = 'From: verified@email.com';  
mail('another\_verified@email.com', 'Test email from SES', "Testbody n Some more lines.", $headers);  
?\>  
[/sourcecode]

And `tail -f /var/log/exim_mainlog` to see what's going on with the email.


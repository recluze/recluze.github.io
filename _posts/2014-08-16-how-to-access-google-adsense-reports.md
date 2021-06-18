---
layout: post
title: How to Access Google Adsense Reports
date: 2014-08-16 10:38:09.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Tutorials
tags:
- Access control
- API
- OAuth 2.0
- tutorial
meta:
  _wpas_done_all: '1'
  _publicize_pending: '1'
  _edit_last: '2'
  videourl: ''
  _s2mail: 'yes'
  original_post_id: '934'
  _wp_old_slug: '934'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2014/08/16/how-to-access-google-adsense-reports/"
---
So, Admob was acquired a while ago by Google and it was recently announced that the publisher reports by Admob would no longer be available through the old APIs. Instead, they now have to be retrieved through the AdSense API -- which is based on OAuth 2.0 and thus a real pain for those just getting started.

Turns out, the process is quite straight-forward but extremely poorly documented. You can go through the AdSense reporting docs, the Google API library and the OAuth 2.0 specs but you would soon be lost. After spending a couple of days decoding the requirements, I found out the bare-metal approach to accessing the stats. And here is how.

<!--more-->

First, you really should read up on the OAuth 2.0 flow but the basic idea is that you first try to get an `access token`. When you do, the user is presented with a consent screen where they click on 'Allow' and the browser is redirected back so that you can save the access token. Of course, this means that you cannot access the data without the user being present. To do that, you need to request _offline access_. When you do, you are given a `refresh token` instead of an access token (and the user is warned that offline access is being requested).

If the user consents, you can save the refresh token and use it to get an access token later on. So, the deal is, request for a refresh token, save it somewhere and later, use it to request an access token and use _that_ to get the reports.

The code below shows the two steps in two functions.

```
set\_include\_path(get\_include\_path() . PATH\_SEPARATOR . dirname(\_\_FILE\_\_) . '/google-api-php-client/src'); require\_once('Google/Client.php'); require\_once('Google/Service/AdSense.php');
```

That part is just to set up the `google-api-php-client` that you can get from over [here](https://github.com/google/google-api-php-client "Official API").

The first function gets the refresh token that you can save anywhere.

```
public function get\_refresh\_token() { $client\_id = 'YOUR\_CLIENT\_ID'; // looks like: yyYzz-zzZzz.apps.googleusercontent.com $client\_secret = 'YOUR\_CLIENT\_SECRET'; // looks like xxxx-xxxxxxxxxxxxxxxxxxxxx $redirect\_uri = 'http://' . $\_SERVER['SERVER\_NAME'] . '/adsenseauth.php'; $client = new Google\_Client(); $client-\>setClientId($client\_id); $client-\>setClientSecret($client\_secret); $client-\>setRedirectUri($redirect\_uri); $client-\>addScope('https://www.googleapis.com/auth/adsense.readonly'); $client-\>setAccessType('offline'); if(isset($\_GET['code']) && $\_GET['code'] != '') { $code = $\_GET['code']; // sleep(30); // This can help if your server time is off a bit $client-\>authenticate($code); $access\_token = $client-\>getAccessToken(); $tokens = json\_decode($access\_token, true); $refresh\_token = $tokens['refresh\_token']; echo $refresh\_token; // or save it somewhere return; } $authUrl = $client-\>createAuthUrl(); redirect($authUrl); return ; }
```

To get a `client_id` and `client_secret`, you need to create an API Project in your Google Management Console. Make sure you give it a correct name and email along with all the other required information or you will get weird errors during authorization. Here's what you need for that:

1. Go to https://console.developers.google.com/
2. Enable AdSense Management API from APIs & Auth -\> APIs
3. Edit Consent Screen from the same menu and enter required information
4. In Credentials screen, create a new Client ID and take note of the ID and secret from there

Also make sure you set the `$redirect_uri` to this same page (the one which has this function and make sure you call this function in that page, of course. After that, you can go to this page and should be taken to the OAuth consent screen.

Once that is done, it's time to access the stats using the following function.

```
public function get\_stats() { $ch = start\_curl\_session(); $start\_date = 'YYYY-mm-dd'; $end\_date = 'YYYY-mm-dd'; $client = new Google\_Client(); $client-\>setClientId($this-\>client\_id); $client-\>setClientSecret($this-\>client\_secret); // the refresh token saved by get\_refresh\_token() $refresh\_token = $refresh\_token; try { $client-\>refreshToken($refresh\_token); $access\_token = $client-\>getAccessToken(); $client-\>setAccessToken($access\_token); $service = new Google\_Service\_AdSense($client); /\* If you want to get the account list, you can use the following: $accounts = $service-\>accounts-\>listAccounts(); foreach($accounts as $account) { } \*/ $opt\_params = array( 'metric' =\> array('earnings', 'clicks', 'individual\_ad\_impressions'), 'dimension' =\> array('date', 'ad\_unit\_name') ); $reports = $service-\>reports-\>generate($start\_date, $end\_date, $opt\_params); $rows = $reports['rows']; } catch(Exception $e) { // do whatever } }
```

It's pretty self-explanatory. The only thing is to request the correct metrics and dimensions that you can see [here](https://developers.google.com/adsense/management/metrics-dimensions).


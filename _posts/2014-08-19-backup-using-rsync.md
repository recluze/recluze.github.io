---
layout: post
title: Backup Using rsync
date: 2014-08-19 10:07:57.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Geek stuff
- Tutorials
tags:
- linux
- rsync
- shell
- tutorial
meta:
  _wpas_done_all: '1'
  _publicize_pending: '1'
  _edit_last: '2'
  videourl: ''
  _s2mail: 'yes'
  _publicize_twitter_user: "@recluze"
  original_post_id: '972'
  _wp_old_slug: '972'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2014/08/19/backup-using-rsync/"
---
Here's a mini howto on backing up files&nbsp; on a remote machine using `rsync`. It shows the progress while it does its thing and updates any remote files while keeping files on the remote end that were deleted from your local folder.

```
rsync -v -r --update --progress -e ssh /media/nam/Documents/ nam@192.168.0.105:/media/nam/backup/documents/
```

Here,&nbsp; `/media/nam/Documents/` is the local folder and `/media/nam/backup/documents/` is the backup folder on the machine with IP `192.168.0.105`.


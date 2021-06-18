---
layout: post
title: Creating Multiple Volumes on Amazon EC2
date: 2011-01-03 10:38:05.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Cloud
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
  _wp_old_slug: '538'
  original_post_id: '538'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2011/01/03/creating-multiple-volumes-on-amazon-ec2/"
---
For those of you who have used Amazon AWS (EC2 specifically) for [more than just testing](http://www.csrdu.org/nauman/2010/09/30/getting-started-with-amazon-ec2-install-configure-connect/) would know that the / partition in an AMI does not go beyond 10GB. So, if you need more space you need to mount more volumes. This is a beginner's guide to do just that.

First off, create an AMI with EBS storage type and take a note of the zone in which that AMI sits. You can find this through the details pane in the 'instances' section of your AWS management console. Then, go over to the 'volumes' section and create a new volume.

[![]({{ site.baseurl }}/assets/images/2011/01/ec2-create-volume-300x134.png "Create Volumes with EC2")](http://recluze.files.wordpress.com/2011/01/ec2-create-volume.png)

Here, you need to make sure that you create the volume in the same zone as your AMI or you won't be able to use the volume with it. Specify the capacity of the volume. That's all that's required at this stage. Click create and wait until the new volume becomes available. Then right-click on the volume and 'Attach Volume'. Make sure you select the right instance and then specify the new device name. You can use something like '/dev/sdd'. Just use fdisk -l in your running instance to make sure it's not already in use.

After that, login to your AMI and fdisk -l again to make sure that the new volume is available. Now, you need to create a partition and format it for linux to use. Then, mount it someplace. Here we're going to move the whole /var to this new partition so that our logs etc can have more free space to grow.

[sourcecode lang="bash"]  
mkfs.ext3 /dev/sdd  
mkdir /mnt/var  
mount /dev/sdd /mnt/var  
cp -R /var/\* /mnt/var  
touch /mnt/var/new-vol  
[/sourcecode]

The last line is there to verify after boot that you are indeed using the newly volume. You can also use df -h after reboot to test this but I just feel better this way.

Finally, open up the /etc/fstab file and enter the new device /dev/sdd and the mount point /var.

[sourcecode lang="bash"]  
/dev/sdd /var ext3 defaults 0 0  
[/sourcecode]

And reboot.


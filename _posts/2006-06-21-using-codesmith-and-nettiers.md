---
layout: post
title: Using Codesmith and .netTiers
date: 2006-06-21 05:30:22.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Tutorials
- VB.net
tags: []
meta:
  _oembed_5724e39394c0454e9677cfc3391f103d: "{{unknown}}"
  _oembed_586c01983c12f90f4c2a670140717bb9: "{{unknown}}"
  _wpas_done_all: '1'
  _oembed_3488b528a476fa039d4d7d3e25069787: "{{unknown}}"
  _oembed_d433a0d3ba6390d2ec0980c554fdc5f9: "{{unknown}}"
  _oembed_825e824726df6e7be06bdbb7f43e6eb5: "{{unknown}}"
  _oembed_8379d6692ec5be5e67f8ef6ac0947b80: "{{unknown}}"
  _oembed_d93cde42989cc1837bebd47a54a699cd: "{{unknown}}"
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2006/06/21/using-codesmith-and-nettiers/"
---
I recently came across Codesmith and .netTiers. It's one of the best things to happen to me since i started working in VB.NET. You can view the details of what these two are in their sites. Here's the gist:

Codesmith is an engine for creating code dynamically based on templates. It saves time. .netTiers is a template for Codesmith which creates code for handling SQL Server databases. It creates classes for performing DML (and other operations) on all database tables. This is done by creating collections. You can use it as simply as a collection!

Now, the [tutorial](http://www.codeproject.com/showcase/CodeSmith.asp) I tried to learn from - their official one - is incomplete! Put simply, it doesn't work. So, I decided to write my own.<!--more-->

**Tutorial**

- Download [Codesmith](http://www.codesmithtools.com/) trial and [.netTiers](http://www.nettiers.com/). Install them!
- Open _Codesmith Explorer_ from the start menu.
- Click on _Open Folder_ button in the toolbar and navigate to the _Templates_ folder in the location where you installed .netTiers.
- Right-click on _netTiers.cst_ file and _Execute_.

![]({{ site.baseurl }}/assets/images/2006/06/1.gif)

- Select the database (refer to the screenshot below).
- Set _Entire Database_ to true.
- Select _Output Directory_.
- Set a namespace name.
- _Generate_!

![]({{ site.baseurl }}/assets/images/2006/06/2.gif)

- If all goes well, you'll have a new solution in the folder you selected as output directory. Open the solution. You'll see that it has three projects. All three set to produce DLLs.
- Now add another project to the solution. This can be a C# or a Vb.NET project. I'm using VB.NET. I've named it _NorthwindFront_.
- Add a new item to the project. Select _Application Configuration File_ as the type. It's called App.conf by default. Leave it as it is.
- Open Enterprise Library Configuration from .netTiers program folder in the start menu.
- Click on Open File and select the App.Conf you just created.
- Right-click on _Application_ and click _netTiers Block_ from _New_ submenu.
- Set these properties. (See screenshot for reference.)
- .nettiers Application block \> data providers \> sql data provider instance \> DataBase instance: Database instance (select from drop down)
- .nettiers Application block \> cache manager : cache manager (select from drop down)
- DataAccess application block \> connection strings \> sql connection string \> database \> value : [name of database] I used Northwind
- DataAccess application block \> connection strings \> sql connection string \> server \> value : [name of sql server machine] I used (local)
- Save the file. If there's an error, restart. If it still doesn't work, post a comment and tell me what it says!

![]({{ site.baseurl }}/assets/images/2006/06/3.gif)

- This generates some \*.conf files in your project directory. Go there and copy all of the \*.conf files to your _bin_ directory.
- That concludes the netTiers part of the tutorial. That's all you need to do to set netTiers up. Now, you need to see how to use it.

Here's a project I created while learning to put this netTiers to use. It's pretty basic but does all three DML operations. To run it, you need to have SQL server running on **(local)** with the default Northwind database using Integrated Security for login. To change these settings, see the last section of this tutorial.

[Download Project](http://recluzepage.googlepages.com/NetTiersTest.rar).

Run this project and try these tasks:

**View** the list of Employees. Try typing a name in the text box to see dynamic searching in action. You can also use up, down, page-up and page-down keys in the textbox for navigation.

**Enter** new employees. (Just enter the values and click on Add.)

**Modify** past records. This is the most functional part. You can enter an ID in the ID field and hit enter to load that record in the boxes below. If that ID doesn't exist, you're shown the view box in which you can select an employee and hit enter to load that.  
**Changing SQL server database and server**

If you want to change these settings, open up the _DataConfiguration.conf_ file from your _bin_ folder and edit the settings. (See screenshot.)

![]({{ site.baseurl }}/assets/images/2006/06/4.gif)

If you download the project and try running it, you'll notice that it doesn't work! This is because of the way references are created by netTiers. Here's what you need to do to fix it. I know this isn't the right solution. I'm trying to get to do this properly. If you find something, do leave me a note.

- Open the solution. Open the Properties of the Northwind.DataAccessLayer project.
- In the _References Path_ section of _Common Properties_, change the path to [$YourSolutionPath]/References.
- Do the same for Northwind.DataAccessLayer.SqlClient project.
- Compile/run the project.

If you find something wrong and/or missing in this tutorial, please let me know.


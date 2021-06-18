---
layout: post
title: Deploying Visual Studio.net + Crystal Reports Projects
date: 2007-09-05 09:31:59.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Articles
- Tutorials
- VB.net
tags: []
meta:
  _oembed_84444ee9aa1f015763a77049c605fbb5: "{{unknown}}"
  _oembed_4a88e2f4885207a4aecde77bcc85535b: "{{unknown}}"
  _oembed_620481c1ff9d87fab3f6a68e37d850ca: "{{unknown}}"
  _oembed_4c0e2255588a6bde4a7b2e4282093cbe: "{{unknown}}"
  _oembed_359f6a9cc07fff4567010f1cd48c4c4e: "{{unknown}}"
  _oembed_91a41ea4c56ca6838c65bc8248e7b144: "{{unknown}}"
  _oembed_03033260da2fcfb7b681a8718760498b: "{{unknown}}"
  _oembed_3dd5bb898fcc3fb71b622e11586c25b5: "{{unknown}}"
  _oembed_295a3a54282b2d3cf4580f8560f56fca: "{{unknown}}"
  _wpas_done_all: '1'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2007/09/05/deploying-visual-studionet-crystal-reports-projects/"
---
If you've been having trouble with deployment of Visual Studio .net 2005 (C# or VB) applications which use Crystal Reports, rest assured.&nbsp; You're not alone. You can find many posts and blogs saying you should add the merge modules but if you're having problems getting the setup to work, here's the solution:

1. First, search for this file (the CR.net redistributable package): **cr\_net\_2005\_mergemodules\_mlb\_x86.zip**
2. Extract it to get this file (merge module):  
**CrystalReportsRedist2005\_x86.msm**
3. Create a new "Setup Project" in your solution. (I'm assuming you're comfortable with this stuff.)
4. Right-click on the setup project and **Add-\>Merge Modules.** 
5. Browse to give the extracted merge module. It should be added to your setup project. 
6. Now, right-click on setup project again and click on **Properties**. 
7. In the properties dialog, click on **Prerequisites**. 
8. Check **.Net framework** , **Crystal Reports** and **Microsoft Data Access Components (MDAC)**
9. Also, select **Download from the Same Location as Project Setup** (or something to that effect.... I don't have VS.Net in front of me right now). 
10. Build the setup project and see the extra files there! 
11. Any Questions? 

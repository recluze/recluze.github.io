---
layout: post
title: Writing a Minimal Eclipse Plugin
date: 2010-04-15 14:22:38.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Java
- Tutorials
tags: []
meta:
  _wpas_done_all: '1'
  _edit_last: '2'
  twitter_cards_summary_img_size: a:7:{i:0;i:525;i:1;i:610;i:2;i:1;i:3;s:24:"width="525"
    height="610"";s:4:"bits";i:7;s:8:"channels";i:3;s:4:"mime";s:9:"image/gif";}
  original_post_id: '1013'
  _wp_old_slug: '1013'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2010/04/15/writing-a-minimal-eclipse-plugin/"
---
I have tried, on multiple occasions, to write an eclipse plugin. I always gave up in the middle of the process though, what with the different versions of eclipse floating around and the discrepancies between the tutorials and the version I was using. I finally decided to sit down and go through a simple 'hello world' plugin and write a tutorial in the process to guide those that are using the latest eclipse. This is a tutorial for eclipse 3.5 (galileo) and is a no BS tutorial with little or no explanation. That's because I believe in code first, think later approach when learning new technologies. So, download eclipse SDK version (not the Java or the C/C++ version) and read on.

<!--more-->

First, create a new project of type 'plugin development'. If you don't know what that means, try finding a basic tutorial for using eclipse. The following screenshot shows the options you need to set for the plugin project. (Click to enlarge.)

[![]({{ site.baseurl }}/assets/images/2010/04/plugin-3.gif "Create project options")](http://recluze.files.wordpress.com/2010/04/plugin-3.gif)

And

[![]({{ site.baseurl }}/assets/images/2010/04/plugin-41.gif?w=129 "Don't use a template")](http://recluze.files.wordpress.com/2010/04/plugin-41.gif)

When the project is created, you'll see the manifest file in the main editor view. (If you don't, just click on it in the manifest project in the project explorer.) See the different tabs in the bottom of the view.

[![]({{ site.baseurl }}/assets/images/2010/04/plugin-5.gif?w=150 "Tabs in the manifest editor")](http://recluze.files.wordpress.com/2010/04/plugin-5.gif)

In the 'Extensions' tab, you'll see the 'All Extensions' pane. Click on 'Add' and search for 'actionSets'. You need to create an extension of type 'org.eclipse.ui.actionSets'. This basically allows the plugin to extend the basic eclipse interface (i.e. a menu in our case).

[![]({{ site.baseurl }}/assets/images/2010/04/plugin-6.gif?w=150 "plugin-6")](http://recluze.files.wordpress.com/2010/04/plugin-6.gif)

Right-click on the actionSet just created and create a new 'menu'. (You would probably want to change the properties, especially the name, of the actionSet in an actual project.)

[![]({{ site.baseurl }}/assets/images/2010/04/plugin-7.gif?w=150 "Creating a menu")](http://recluze.files.wordpress.com/2010/04/plugin-7.gif)

Then, under the menu, create a new separator and give it a name. This will allow the placement of a menuitem later on.

[![]({{ site.baseurl }}/assets/images/2010/04/plugin-8.gif?w=150 "Insert separator")](http://recluze.files.wordpress.com/2010/04/plugin-8.gif)

Create an 'action' type under the actionset similar to the menu item. This will be the actual item that we can click on in the menu. Once you do that, give it a proper name and click on 'class' in the properties pane. This will allow you to associate a class with this action item. (This should remind you of action listeners but this is a lot more dependent on eclipse plugin architecture.) Give the class a name and place it in your package.

[![]({{ site.baseurl }}/assets/images/2010/04/plugin-9.gif?w=150 "Associate a class with the action")](http://recluze.files.wordpress.com/2010/04/plugin-9.gif)

Now, finally, for some code. Open the class you just created and you'll see that there is some placeholder text inserted in. (Not going into the theory of what this actually is and how it works. Code first, think later!) Here's the code. I've formatted the additions you need to make in a bold, blue typeface here.

`
public class HelloWorldAction implements IWorkbenchWindowActionDelegate {
IWorkbenchWindow window; 
@Override
public void init(IWorkbenchWindow window) {
// TODO Auto-generated method stub
this.window = window; `

` `

`}`

@Override  
public void run(IAction action) {  
// TODO Auto-generated method stub  
**MessageDialog.openInformation(window.getShell(), "Hello world", "Hello world! I am a new plugin!");**

` }`

And running the plugin is easy. Right click the project, Run-As and 'Eclipse Application'.

[![]({{ site.baseurl }}/assets/images/2010/04/plugin-11.gif?w=150 "Run plugin")](http://recluze.files.wordpress.com/2010/04/plugin-11.gif)

Finally, to deploy the project, just go to 'File' -\> 'Export' and select 'Deployable Plugins and Fragments'. Just give it an archive name and you will have a zip file that can be extracted in any eclipse directory to incorporate the new plugin in that project. You can also export it to a repository but that's another story. Last, but not least, see the screenshot and marvel at what you've done.

[![]({{ site.baseurl }}/assets/images/2010/04/plugin-12.gif?w=150 "Running Plugin")](http://recluze.files.wordpress.com/2010/04/plugin-12.gif)

What's next? See this [tutorial](http://www.vogella.de/articles/RichClientPlatform/article.html)on how to create an RCP application in eclipse. Maybe someday I'll write one of those too.


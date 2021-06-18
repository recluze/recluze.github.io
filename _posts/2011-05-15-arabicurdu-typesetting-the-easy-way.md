---
layout: post
title: Arabic/Urdu Typesetting the Easy Way
date: 2011-05-15 04:07:03.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Softwares
- Tutorials
- Typography
tags: []
meta:
  _wpas_done_all: '1'
  _publicize_pending: '1'
  _edit_last: '2'
  video_type: "#NONE#"
  Image: ''
  _syntaxhighlighter_encoded: '1'
  original_post_id: '606'
  _wp_old_slug: '606'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2011/05/15/arabicurdu-typesetting-the-easy-way/"
---
As the regular readers might know, I'm a [big fan](http://www.csrdu.org/nauman/2007/07/15/using-bibtex-for-references/) and [regular user](http://www.csrdu.org/nauman/2010/09/25/inserting-source-code-and-latex-in-wordpress/) of the [LaTeX](http://www.csrdu.org/nauman/2007/07/15/using-tables-with-latex/) typsetting system. Keeping to the tradition of occasionally posting a LaTeX tutorial on the blog, here's one that will be useful to all those that are trying to get up and running with [XeTeX](http://scripts.sil.org/xetex) -- the unicode support adding big brother to the TeX typesetting system. XeTeX basically allows you to use all the Opentype (and other) fonts installed on your system -- and it adds unicode support. That means you can use the latest Adobe fonts you've got as well as all the Arabic, Urdu, Chinese and Japanese fonts and typeset them as beautifully as you would any Latin script in LaTeX. It's a hassle to set it up though and you wouldn't find many tutorials or how-tos on the Internet.

So, here's one that will allow you to setup and start using XeTeX -- especially if you're trying to find a way to easily typeset Arabic/Urdu. Let's get started: First, download and install [MikTeX](http://miktex.org/) 2.7+ (for Windows or any other LaTeX package for your favourite OS). I use 2.8 but I guess you should download the latex (2.9). Everything after 2.6 t has XeTeX built-in. You should download the basic installer from [here](http://miktex.org/2.9/setup).

Install also the [TeXMaker IDE](http://www.xm1math.net/texmaker/). We're going to configure that in a little while to use XeTeX instead of LaTeX. Get the Scheherazade&nbsp;font from the [SIL page](http://scripts.sil.org/cms/scripts/page.php?item_id=ArabicFonts_Download). You can just extract the zip file anywhere and copy the `.ttf` file into `C:WindowsFonts` folder. That installs the font required for Arabic typesetting.

Now, fire up TexMaker, go to Options menu and click on 'Configure Texmaker'. In the Pdflatex section, replace `pdflatex` with `xelatex`.

[caption id="attachment\_609" align="aligncenter" width="300" caption="Configure texmaker for XeLaTeX"][![]({{ site.baseurl }}/assets/images/2011/05/configure-texmaker-300x207.png "Configure texmaker")](http://recluze.files.wordpress.com/2011/05/configure-texmaker.png)[/caption]

Create a new file and insert the following code:

[sourcecode lang="latex"]  
documentclass{article}  
usepackage{arabxetex}  
begin{document}

begin{arab}[novoc]  
mi\_tAl: aemph{45} darajaT  
end{arab}

end{document}  
[/sourcecode]

Before we build, you might need to refresh the font-cache for XeLaTeX (especially if you've used it before). For that, go to your MikTeX bin directory and enter the command `fc-cache.exe --force`. It might take a while but it should run without any errors.

[![]({{ site.baseurl }}/assets/images/2011/05/xetex-fc-cache-300x150.png "Clear Cache")](http://recluze.files.wordpress.com/2011/05/xetex-fc-cache.png)

Now, back to Texmaker &nbsp; and 'Quick Build'.

[caption id="attachment\_613" align="aligncenter" width="300" caption="Build ArabXeTeX"][![]({{ site.baseurl }}/assets/images/2011/05/build-arabxetex1-300x163.png "Build ArabXeTeX")](http://www.csrdu.org/nauman/wp-content/uploads/2011/05/build-arabxetex1.png)[/caption]

You should be able to see the output like so:

[caption id="attachment\_615" align="aligncenter" width="163" caption="Arabic Output"][![]({{ site.baseurl }}/assets/images/2011/05/arabxetex-output.png "arabxetex-output")](http://recluze.files.wordpress.com/2011/05/arabxetex-output.png)[/caption]

During the quick build, you might get a dialog box saying that a certain package is missing and you need to install it. If so, just click 'Ok' or 'Install' and it will be automatically installed on-the-fly by MikTeX. (You'll need an internet connection though.) If it simply exits giving some error about a missing .sty file (look at the bottom of the screen for the errors/output messages) -- you need to open up the "Package Manager" from the MikTeX folder in the start menu and install that package. For example, if you get the error, "Missing arabxetex.sty", search for arabxetex package, select it in the list and click on the 'install button'. Then try to quick build again. Let me know in the comments below if you have any errors and I'll try to help you out.

[caption id="attachment\_616" align="aligncenter" width="300" caption="Installing MikTeX Packages"][![]({{ site.baseurl }}/assets/images/2011/05/install-arabxetex-300x175.png "Installing MikTeX Packages")](http://recluze.files.wordpress.com/2011/05/install-arabxetex.png)[/caption]

Finally, you can look at the [original documentation for ArabXeTeX](http://www.tug.org/texlive/Contents/live/texmf-dist/doc/xelatex/arabxetex/arabxetex.pdf) for the details of use. I'll leave you with another output from the examples in that doc.

[caption id="attachment\_617" align="aligncenter" width="300" caption="Another example output from ArabXeTeX"][![]({{ site.baseurl }}/assets/images/2011/05/arabxetex-output2-300x60.png "Another example output")](http://recluze.files.wordpress.com/2011/05/arabxetex-output2.png)[/caption]


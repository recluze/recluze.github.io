---
layout: post
title: Beginning Programming with Python
date: 2017-11-11 05:33:23.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Articles
- Pedagogy
- python
- resources
- Tutorials
tags: []
meta:
  _wpas_done_all: '1'
  _rest_api_published: '1'
  _rest_api_client_id: "-1"
  _publicize_job_id: '11317860483'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2017/11/11/beginning-programming-with-python/"
---
So, I've been teaching CS101 - Introduction to Computing this semester (Fall 2017). We picked Python as the language. I've compiled the videos and all the lecture notebooks. These are being made available in the hopes that they can be useful for someone. Here's how to get started with these.&nbsp;<!--more-->

## Getting Started

First, download and install Anaconda distribution. We've used Python2.7 for this class due to several reasons. So, it's highly recommended that you install **Python2.7** version of Anaconda for your operating system from over here:&nbsp;[https://www.anaconda.com/download/](https://www.anaconda.com/download/)

(Once you're done with the course, it should be easy to move to Python3 as well _inshaallah_).

## Running Code

Once you've downloaded and installed Anaconda i.e. Python2.7, head over to our [github repo](https://github.com/recluze/intro-to-programming-python) or directly download the [zip file](https://github.com/recluze/intro-to-programming-python/archive/v1.1.zip), which contains all the needed resources. Unzip the file to get the whole folder.

Then, start with our video set over on [Vimeo](https://vimeo.com/album/4739729). Make sure you view the "Notebook Howto" video after Lecture 05. This will tell you exactly how to get started with code. (Videos prior to this are theoretical but are absolutely necessary for a thorough understanding of coding.)

## Assignments

Since it's absolutely necessary that you practice with some problems on your own, I'm also making the assignments set in the class publicly. You can see these assignments in the same zip file you extracted earlier.

To run the assignments, open Anaconda Prompt (or just the terminal if you're on Linux or Mac) and issue the following command:

```
pip install pytest-timeout
```

This installs a package necessary for running our assignment tests.

Then, go to the directory of an assignment (take a look at "Autograder howto" video for details on this or post a question in comments below for help). Once you're in the folder, you will need to modify the assignment file according to the instructions given in the PDF. Assignments need to be done after these videos:

Assignment **01** : After Lecture 06  
Assignment **02** :&nbsp;After Lecture 08  
Assignment **03** :&nbsp;After Lecture 11  
Assignment **04** :&nbsp;After Lecture 13  
Assignment **05** :&nbsp;After Lecture 13  
Assignment **06** :&nbsp;After Lecture 13  
Assignment **07** :&nbsp;After Lecture 15  
Assignment **08** :&nbsp;After Lecture 15  
Assignment **09** : After Lecture 16  
Assignment **10** : After Lecture 18  
Assignment **E01** (Optional): After Lecture 15

Once you've done some code, you need to make sure your code is correct. To do this, you need to run the following command from Anaconda Prompt (while you're in the assignment folder):

```
py.test
```

And that's it. If you need any help, post a comment below.

## Java

The java folder in the downloaded archive contains basic Java intro resources. Videos for these are included in the Vimeo link.


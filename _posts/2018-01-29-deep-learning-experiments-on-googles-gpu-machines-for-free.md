---
layout: post
title: Deep Learning Experiments on Google's GPU Machines for Free
date: 2018-01-29 11:35:22.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Announcements
- Articles
- Deep Learning
- Geek stuff
- Keras
- Machine Learning
- python
- research
- resources
- Tensorflow
- Tutorials
tags: []
meta:
  _wpas_done_all: '1'
  _edit_last: '2'
  geo_public: '0'
  timeline_notification: '1517225725'
  _rest_api_published: '1'
  _rest_api_client_id: "-1"
  _publicize_job_id: '14152214679'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2018/01/29/deep-learning-experiments-on-googles-gpu-machines-for-free/"
---
 **Update:** If you are interested in getting a running start to machine learning and deep learning, I have created a course that I’m offering to my dedicated readers for just $9.99. [Practical Deep Learning with Keras and Python](https://www.udemy.com/practical-deep-learning-with-keras/?couponCode=RECLYBLOG) .

So you've been working on Machine Learning and Deep Learning and have realized that it's a slow process that requires a lot of compute power. Power that is not very affordable. Fear not! We have a way of using a playground for running our experiments on Google's GPU machines for free. In this little how-to, I will share a link with you that you can copy to your Google Drive and use it to run your own experiments.

BTW, if you would like to receive updates when I post similar content, please signup below:

[Signup for promotions, course coupons and new content notifications through a short form here](http://eepurl.com/diop7L).

## Colaboratory

First, sign in to an account that has access to Google Drive (this would typically be any Google/Gmail account). Then, click on [this link over here that has my playground document](https://drive.google.com/file/d/1XaD0zaBgUPZhqy_FMs6p2oJ2iAA3Vh2N/view?usp=sharing) and follow the instructions below to get your own private copy.<!--more-->

![]({{ site.baseurl }}/assets/images/2018/01/colaboratory-02.png)

Click on "Open With" because it's a special document type that cannot be opened with the default applications.

![]({{ site.baseurl }}/assets/images/2018/01/colaboratory-03.png)

Click on "Connect more apps" and then select the "Colaboratory" app. If you cannot see it, you can search for it in the box to the top-right.

![]({{ site.baseurl }}/assets/images/2018/01/colaboratory-04.png)

Then click on "Connect" to authorize this app.

![]({{ site.baseurl }}/assets/images/2018/01/colaboratory-05.png)

Then, click on "Open with Colaboratory" to open it up.

![]({{ site.baseurl }}/assets/images/2018/01/colaboratory-06.png)

Once it opens up, first you want to make it executable by opening it up in the "Playground".

![]({{ site.baseurl }}/assets/images/2018/01/colaboratory-07.png)

Then, you want to make a copy of your own so that you can work it in peace.

![]({{ site.baseurl }}/assets/images/2018/01/colaboratory-08.png)

To enable GPU support, go to the "Edit" menu in the docs and click on "Notebook Settings".

![]({{ site.baseurl }}/assets/images/2018/01/colaboratory-09.png)

Make sure "GPU" is selected in the hardware accelerator dropdown.

![]({{ site.baseurl }}/assets/images/2018/01/colaboratory-10.png)

## Running Code

Now you can put your code in the cells just like jupyter notebooks (in fact, that's what's powering this thing) and do Shift+Enter to execute it. Tensorflow is installed by default, of course. To install keras, you can issue the command: `!pip install -q keras` and then `import keras` to verify that it's working.

![]({{ site.baseurl }}/assets/images/2018/01/colaboratory-11.png)

Go over to some[keras example](https://github.com/keras-team/keras/blob/master/examples/mnist_mlp.py) and get some code to test it out.

## What about my data?

You must be wondering how you can get your data inside this notebook? You can't see an upload button anywhere. You can follow the detailed instructions [here](https://colab.research.google.com/notebook#fileId=/v2/external/notebooks/io.ipynb) but the easiest way I could find was to upload your files somewhere and then use `data_utils` from keras.

![]({{ site.baseurl }}/assets/images/2018/01/colaboratory-12.png)

It has a very useful function called `get_file` (among others) that you can use to download and extract files off of the internet and then use then in your code. Take a look at the MNIST example I linked above for an example.

![]({{ site.baseurl }}/assets/images/2018/01/colaboratory-13.png)

And there you have it.

As before, if you would like to receive updates when I post similar content, please signup below:

[Signup for promotions, course coupons and new content notifications through a short form here](http://eepurl.com/diop7L).

&nbsp;


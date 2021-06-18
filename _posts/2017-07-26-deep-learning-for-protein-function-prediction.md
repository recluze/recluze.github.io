---
layout: post
title: Deep Learning for Protein Function Prediction
date: 2017-07-26 13:32:55.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Machine Learning
- python
- research
- resources
tags: []
meta:
  _wpas_done_all: '1'
  _rest_api_published: '1'
  _rest_api_client_id: "-1"
  _publicize_job_id: '7508982746'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2017/07/26/deep-learning-for-protein-function-prediction/"
---
Protein function prediction is taking information about a protein (such as its amino acid sequence, 2D and 3D structure etc.) and trying to predict which functions it will exhibit. This has implications in several areas of bioinformatics and affects how drugs are created and diseases are studied. This is typically an intensive task requiring inputs from biologists and computer experts alike and annotating newly found proteins requires empirical as well as computational results.

We, here at FAST NU, recently came up with a unique method (dubbed _DeepSeq --&nbsp;_since it's based on Deep Learning and works on protein sequences!) for predicting functions of proteins using only the amino acid sequences. This is the information that is the first bit we get when a new protein is found and is thus readily available. (Other pieces require a lot more effort.)

We have successfully applied DeepSeq to predict protein function from sequences alone without requiring any input from domain experts. The paper isn't peer reviewed yet but we have made the [paper available as preprint](http://www.biorxiv.org/content/early/2017/07/25/168120) and our [full code on github](https://github.com/recluze/deepseq) so you can review it yourself.

We believe DeepSeq is going to be a breakthrough _inshaallah_ in the field of bioinformatics and how function prediction is done. Let's see if I can come up with an update about this in a year after the paper has been read a few times by domain experts and we have a detailed peer review.

![DeepSeq]({{ site.baseurl }}/assets/images/2017/07/dl-arch-small.jpg)


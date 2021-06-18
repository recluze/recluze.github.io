---
layout: post
title: A Basic Naive Bayes classifier in Matlab
date: 2011-04-16 05:33:41.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Geek stuff
- Machine Learning
- research
- Tutorials
tags: []
meta:
  _wpas_done_all: '1'
  _edit_last: '2'
  video_type: "#NONE#"
  Image: ''
  _syntaxhighlighter_encoded: '1'
  original_post_id: '582'
  _wp_old_slug: '582'
  _publicize_job_id: '14633541068'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2011/04/16/a-basic-naive-bayes-classifier-in-matlab/"
---
 **Update:** If you are interested in getting a running start to machine learning and deep learning, I have created a course that I’m offering to my dedicated readers for just $9.99. [Access it here on Udemy](https://www.udemy.com/practical-deep-learning-with-keras/?couponCode=RECLYBLOG). If you are only here for Matlab, continue reading =]

This is the second in my series of implementing low-level machine learning algorithms in Matlab. We first did [linear regression with gradient descent](http://www.csrdu.org/nauman/2010/06/25/regression-with-gradient-descent-in-low-level-matlab/) and now we're working with the more popular naive bayes classifier. As is evident from the name, NB it is a classifier i.e. it sorts data points into classes based on some features. We'll be writing code for NB using low-level matlab (meaning we won't use matlab's implementation of NB). Here's the example we've taken (with a bit of modification) from [here](http://www.inf.ed.ac.uk/teaching/courses/lfd/lectures/lfd_2005_naive.pdf).

Consider the following vector:

(likes shortbread, likes lager, eats porridge, watched England play football, nationality)<sup>T</sup>

A vector $latex x = (1, 0, 1, 0, 1)^T $ would describe that a person likes shortbread, does not like lager, eats porridge, has not watched England play football and is a national of Scottland. The final point is the class that we want to predict and takes two values: 1 for Scottish, 0 for English.

Here's the data we're given:

`
X = [ 0 0 1 1 0 ;
1 0 1 0 0 ;
1 1 0 1 0 ;
1 1 0 0 0 ;
0 1 0 1 0 ;
0 0 1 0 0 ;
1 0 1 1 1 ;
1 1 0 1 1 ;
1 1 1 0 1 ;
1 1 1 0 1 ;
1 1 1 1 1 ;
1 0 1 0 1 ;
1 0 0 0 1 ];
`

Notice that usually when we represent data, we write features in columns, instances in rows. If this is the case, we need to get the data in proper orientation: features in rows, instances in columns. That's the convention. Also, we need to separate the class from the feature set:

[sourcecode lang="matlab"]  
Y = X(:,5);  
X = X(:,1:4)'; % X in proper format now.  
[/sourcecode]

Alright. Now, that we have the data, let's hear some theory. As always, this isn't a tutorial on statistics. Go read about the theory somewhere else. This is just a refresher:

In order to predict the class from a feature set, we need to find out the probability of Y given X (where

$latex X = ( x\_1, x\_2, ldots x\_n ) $

with n being the number of features. We denote the number of instances given to us as m. In our example, n = 4, m = 13. The probability of Y given X is:

$latex P(Y=1|X) = P(X|Y=1) \* P(Y=1) / P(X) $

Which is called the Bayes rule. Now, we make the NB assumption: All features in the feature set are independant of each other! Strong assumption but usually works. Given this assumption, we need to find $latex P(X|Y=1), P(Y) and P(X)$.

(The weird braces notation that follows is the indicator notation. $latex 1{ v }$ means use 1 only if condition v holds, 0 otherwise.)

$latex P(X) = P(X|Y=1) + P(X|Y=0)$

$latex P(X|Y=1) = prod\_j{P(x\_i|Y=1)} $

To find $latex P(X|Y=1)$, you just have to find $latex P(x\_i|Y=1)$ for all features and multiply them together. This is where the assumption comes in. You need the assumption of independence here for this.

$latex P(x\_i|Y=1) = sum\_j{1{x\_i^j = 1, y^j = 1}} / sum\_j{1{y^j = 1}}$

This equation basically means count the number of instances for which both x\_i and Y are 1 and divide by the count of Y being 1. That's the probability of x\_i appearing with Y. Fairly straight forward if you think about it.

$latex P(Y=1) = sum\_j{1{y^j = 1 }} / sum\_j{1{y^j = 1, y^j = 0 }}$

Same as above. Count the ratio of Y=1 with the total number of Ys. Notice that we need to calculate all these for both Y=0 and Y=1 because we need both in the first equation. Let's begin from the bottom up. For all of below, consider E as 0 and S as 1 since we consider being Scottish as being in class 1 (positive example).

P(Y):

[sourcecode lang="matlab"]  
pS = sum (Y)/size(Y,1); % all rows with Y = 1  
pE = sum(1 - Y)/size(Y,1); % all rows with Y = 0  
[/sourcecode]

P(x\_i|Y):

[sourcecode lang="matlab"]  
phiS = X \* Y / sum(Y); % all instances for which attrib phi(i) and Y are both 1  
 % meaning all Scotts with attribute phi(i) = 1  
phiE = X \* (1-Y) / sum(1-Y) ; % all instances for which attrib phi(i) = 1 and Y =0  
 % meaning all English with attribute phi(i) = 1  
[/sourcecode]

PhiS and PhiE are vectors that store the probabilities for all attributes. Now that we have the probabilities, we're ready to make a prediction. Let's get a test datapoint:

[sourcecode lang="matlab"]  
x=[1 0 1 0]'; % test point  
[/sourcecode]

And calculate the probabilities P(X|Y=1) and P(X|Y=0)

[sourcecode lang="matlab"]  
pxS = prod(phiS.^x.\*(1-phiS).^(1-x));  
pxE = prod(phiE.^x.\*(1-phiE).^(1-x));  
[/sourcecode]

And finally, the probabilities of P(Y=1|X) and P(Y=0|X)

[sourcecode lang="matlab"]  
pxSF = (pxS \* pS ) / (pxS + pxE)  
pxEF = (pxE \* pS ) / (pxS + pxE)  
[/sourcecode]

They should add upto 1 since there are only two classes. Now you can define a threshold for deciding whether the class should be considered 1 or 0 based on these probabilities. In this case, we can consider this test point to belong to class 1 since the probability pxSF \> 0.5.

And there you have it!


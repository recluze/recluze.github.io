---
layout: post
title: Regression with Gradient Descent in Low-level Matlab
date: 2010-06-25 00:40:25.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Articles
- Geek stuff
- Tutorials
tags: []
meta:
  _wpas_done_all: '1'
  _edit_last: '2'
  _wp_old_slug: '1013'
  _oembed_23e5aba3465bc0da1627a4ea396535d6: "{{unknown}}"
  _oembed_97a631235041c280216f1f4a33819c32: "{{unknown}}"
  _oembed_92c7cba5a7d24b8e7df4384a009318c5: "{{unknown}}"
  _oembed_f1fac3df53c2a73d4a7813b04f7a3d72: "{{unknown}}"
  _oembed_69384dc9e3661a2b6eeb6d3bbffad15f: "{{unknown}}"
  _oembed_25dd263b9e374c846453682bec086de1: "{{unknown}}"
  _oembed_be044b43ca0726f07884054edd101a09: "{{unknown}}"
  _oembed_a4ffa36f80cd381b61afc20165e29964: "{{unknown}}"
  _syntaxhighlighter_encoded: '1'
  original_post_id: '1013'
  _oembed_0ac8cde0c49a9a2f343d45e6dc11190e: "{{unknown}}"
  _oembed_b8430b3c202533e8368a590cb220abd0: "{{unknown}}"
  _oembed_353fc818545268cdd87bc79da58be84c: "{{unknown}}"
  _oembed_232d25ae246c90f449b5c5f1535aec1a: "{{unknown}}"
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2010/06/25/regression-with-gradient-descent-in-low-level-matlab/"
---
<p><strong>Update:</strong> If you are interested in getting a running start to machine learning and deep learning, I have created a course that I'm offering to my dedicated readers for just $9.99. <a href="https://www.udemy.com/practical-deep-learning-with-keras/?couponCode=RECLYBLOG" target="_blank" rel="noopener">Access it here on Udemy</a>. If you are only here for Matlab, continue reading =]</p>
<p>I just finished writing my first machine learning algorithm in Matlab. The algorithm is based on gradient descent search for estimating parameters of linear regression (but can be easily extended to quadratic or even higher-dimensional polynomials). It's fairly easy if you know the theory behind the model. So, first a very brief theory portion. This isn't a tutorial on statistics. Go read a book if you don't know about regression.</p>
<p><!--more--></p>
<p>Just to recall: Regression comes in when you want to estimate a response variable ($latex y$) given explanatory variables ($latex x_i$). The goal for linear regression is to come up with values for <em>parameters</em> ($latex \theta_i$) such that you get a 'best possible fit' for each jth instance in the dataset of m instances:</p>
<p>$latex y^j = \sum_{i=1}^m{\theta_i \times x_i^j}$</p>
<p>In matrix notation, that comes simply to:</p>
<p>$latex Y = \theta^T X$</p>
<p>(For ease, we assume that $latex x_1$ is a vector of all 1s thus making $latex \theta_1$ the y-intercept).</p>
<p>The idea of gradient descent is to come up with the best (locally) values of $latex \theta$. It does this by repeatedly updating the value of $latex \theta$ using the formula:</p>
<p>$latex \theta_i = \theta_i - \alpha * \sum_{j=1}^m{(\theta^T X^j - Y^j) X_i^j}$</p>
<p>If you have no idea what this is or if you want to know this in-depth, read till the end.</p>
<p>Here's the Matlab code for this whole procedure I wrote at first. Note the use of W for $latex \theta$:</p>
<p>[sourcecode language="matlab"]<br />
% Gradient descent algo for linear regression<br />
% author: Nauman (recluze@gmail.com)</p>
<p>%set the data<br />
X=[1 1 1 1 1 1 1; 22 49 80 26 40 54 91];<br />
Y=[20 24 42 22 23 26 55];<br />
hold on;<br />
plot(X(2,:),Y, 'x');</p>
<p>% set the actual values of W<br />
W = [5.775 0.474]';<br />
YAct = (W' * X);</p>
<p>% GRADIENT DESCENT<br />
W = zeros(2,1);     % initialize W to all zeros<br />
m = size(X,2);      % number of instances<br />
n = size(W,1);      % number of parameters<br />
alpha = 0.000025;    % gradient descent step size</p>
<p>disp('Starting Weights:');<br />
W</p>
<p>% 1) do the loop for W estimation using gradient descent ------------<br />
for iter = 1 : 20 % let's just do 5 iterations for now ... not til convergence<br />
% for each iteration<br />
for i = 1 : n       % looping for each parameter W(i)<br />
    % find the derivative of J(W) for all instances<br />
    sum_j = 0;<br />
    for j = 1 : m<br />
        hW_j = 0;<br />
        for inner_i = 1 : n<br />
            hW_j = hW_j + W(inner_i) * X(inner_i,j);<br />
        end<br />
        sum_j = sum_j + ( (hW_j - Y(j)) * X(i,j) ) ;<br />
    end<br />
    % calculate new value of W(i)<br />
    W(i) = W(i) - alpha * sum_j;<br />
end<br />
% plot the thingy<br />
newY = (W' * X);<br />
gColor = 0.05 * iter;<br />
plot(X(2,:),newY, 'Color', [0 gColor 0]);</p>
<p>% end 1) ------------
  
end  
% output the final weights  
disp ('Final calculated weights');  
W  
% output actual weights from formula in Red W = [5.775 0.474]'  
plot(X(2,:),YAct, 'Color',[1 0 0]);  
% finish off  
hold off;  
[/sourcecode]

Then I figured that I was just doing loops and didn't really need the matrices. So, I went back and thought about the whole nested loop thing and replaced the loop portion with this:

[sourcecode language="matlab"]  
for i = 1 : n % looping for each parameter W(i)  
 % calculate new value of W(i)  
 W(i) = W(i) - alpha \* sum( ((W'\*X) - Y) .\* X(i,:) );  
end  
[/sourcecode]

Seems suspiciously like the original formula, doesn't it? Here's what the plot look like. The red line shows the linear regression line calculated from a closed-form formula and the other lines show estimations of $latex \theta$ with the darkest colored ones being the initial guess and lighter ones are successive guesses.

![]({{ site.baseurl }}/assets/images/2010/06/grad-desc.jpg "Estimating regression parameters through gradient-descent")

And finally, as promised, here's where you can learn all about this stuff: [machine learning video lectures from Stanford](http://www.youtube.com/watch?v=UzxYlbK2c7E).


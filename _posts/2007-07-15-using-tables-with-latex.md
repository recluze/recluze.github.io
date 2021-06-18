---
layout: post
title: Using Tables with LaTeX
date: 2007-07-15 14:07:54.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories: []
tags: []
meta:
  _wpas_done_all: '1'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2007/07/15/using-tables-with-latex/"
---
Using tables with LaTeX is a little tricky. The good thing is, once you get the hang of it, it's really very clean. Here's a crash-tutorial on how to use tables.

We want to make this table:

| Cat/Term | apple | recipe | pudding |

| COOKING | 1 | 0.37 | 0.37 |

| SOCCER | 0 | 0 | 0 |

And here's the code to do it:

\begin{table}  
&nbsp;&nbsp;&nbsp; \centering  
&nbsp;&nbsp;&nbsp; \begin{tabular}{|l|c|c|c|}  
&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; \hline  
&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; Cat/Term & apple&nbsp; & recipe&nbsp;&nbsp;&nbsp; & pudding \\ \hline  
&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; COOKING&nbsp; & 1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; & 0.37&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; & 0.37&nbsp;&nbsp;&nbsp; \\ \hline   
&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; SOCCER&nbsp;&nbsp; & 0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; & 0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; & 0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \\ \hline  
&nbsp;&nbsp;&nbsp; \end{tabular}  
&nbsp;&nbsp;&nbsp; \caption{Example representation of a user profile}  
&nbsp;&nbsp;&nbsp; \label{fig:sampleM}  
\end{table}

Most of this is self-explanatory if you know a little LaTeX. I'll give a short guide on the rest. (Feel free to ask if you have any problems.)

The {|l|c|c|c|} means that there should be four columns: first one left aligned and the rest centered. Between each column, there should be a line. Try removing one of these pipes to see the difference.

The first \hline is used to insert a line at the top of the table.

Then, each line represents a row with the ampersands marking the column separations.

Each \hline at the end of rows means there should be a line between the rows. Try removing one of these to see what it does.

Of course, the \\ means line break; or in this case, row break.

Hope this helps.


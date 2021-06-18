---
layout: post
title: XPath Example
date: 2008-03-05 06:54:46.000000000 +05:00
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
  _wp_old_slug: '1013'
  original_post_id: '1013'
  _syntaxhighlighter_encoded: '1'
  _wpas_done_all: '1'
  _edit_last: '2'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2008/03/05/xpath-example/"
---
A simple XPath example using JAXP only:

```
package serg.xslt;import java.io.\*; import javax.xml.parsers.DocumentBuilderFactory; import javax.xml.transform.\*; import javax.xml.transform.dom.DOMSource; import javax.xml.transform.stream.StreamResult; import org.w3c.dom.\*; import org.w3c.dom.traversal.NodeIterator; import org.xml.sax.InputSource; import com.sun.org.apache.xpath.internal.CachedXPathAPI; public class PathSelector { public static void main(String arg[]) throws Exception { String filename = null; String xpath = null; filename = arg[0]; // xpath = arg[1]; xpath = "//book/following-sibling::\*"; // set up a dom tree InputSource in = new InputSource(new FileInputStream(filename)); DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance(); Document doc = dbf.newDocumentBuilder().parse(in); System.out.println("Querying Dom using : " + xpath); CachedXPathAPI path = new CachedXPathAPI(); NodeIterator nl = path.selectNodeIterator(doc, xpath); // the actual XPath selector Transformer trans = TransformerFactory.newInstance().newTransformer(); trans.setOutputProperty(OutputKeys.OMIT\_XML\_DECLARATION, "yes"); System.out.println(""); Node n; while ((n = nl.nextNode()) != null) { trans.transform(new DOMSource(n), new StreamResult( new OutputStreamWriter(System.out))); } System.out.println(""); } }
```

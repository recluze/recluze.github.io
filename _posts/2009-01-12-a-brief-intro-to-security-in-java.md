---
layout: post
title: A Brief Intro to Security in Java
date: 2009-01-12 03:49:24.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Articles
- research
tags: []
meta:
  _wp_old_slug: '1013'
  original_post_id: '1013'
  _edit_last: '2'
  _wpas_done_all: '1'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2009/01/12/a-brief-intro-to-security-in-java/"
---
_Disclaimer: This is not a how-to for implementing security frameworks. It will focus on the research aspects of Java Security Managers. If you need to find out how to implement the code, follow some of the references._

The Java SE platform provides a solid security framework. Aside from the cryptography libraries and Java Cryptography Extension (JCE) specification, it includes an important feature -- called Security Managers -- which enable a program writer (or the user) to specify the security constraints for a program.

Every call to the system resources goes through the Java Virtual Machine (JVM). The VM includes _hooks_, which call a _Security Manager_ and request a decision regarding system resource calls. These calls include reading and writing files, opening sockets and listening to ports. The assigned security manager reads the security policy and decides whether the system call should be allowed. If the call is to be granted, the security manager simply returns a value (the nature of which is not important). If it is not to be allowed, a _security exception_ is thrown, which signifies the denial of the call.

<!--more-->The security manger is disabled by default in a Java setup. To enable it, a system option has to be passed to the JVM when it is executed. The syntax is:

`java -Djava.security.manager`

Given a method call to read the environment variable for USER\_HOME\_DIR,

The JVM calls a method checkRead for the default security manager, which checks the call against the default security policy. The default is to deny the read call and thus a security exception is thrown. In order to allow the call, we must create our own security policy and tell the security manager to read that instead of the default policy. The policy file looks like this:

`grant codebase "file:/home/sampleapp/"{
permission java.util.PropertyPermission "user.home", "read";
};
`

If the JVM is called with the following command line, the call succeeds:

`java -Djava.security.manager -Djava.security.policy=policy.txt
`

Given that the sample Java class file resides in /home/sampleapp and the policy file is called policy.txt.

**Creating a custom security manager**

The Java framework also allows the creation of a custom security manager. A security manager only has to extend the java.lang.SecurityManger class and can then implement its own security policies or even its own security framework.

Building on this powerful extensibility, several papers have devised their own security mechanisms for the Java 2 SE platform. Here, we will discuss a few of these papers.

**Past Literaure**

Martinelli and Mori, in _Enhancing Java Security with History Based Access Control_, describe how they enhance the security framework for history based access control. The important aspect of this paper is the focus on the distributed nature of the environments in which Java applications execute. This distributed nature requires some sort of security policies to be applied to applications from any source. Since the applications may potentially contain malicious code, allowing them to execute without some type of sandboxing may lead to serious threats. They therefore describe security as a fundamental issue.

This approach is based on the previously developed history based policy language in which the decision to allow or deny a system call depends on the whole execution history of the application -- called the _trace_ of the execution. The policy is based on process-algebra. An example of a security policy is that an application is only allowed to open ten files at a time or that the application can only open four distinct files for writing. The architecture includes an application monitor (AM) and a policy decision point (PDP). The AM intercepts system calls and sends them to the PDP for decisions. If the system call is permitted by the PDP, the AM calls the PDP again for further checking (based on the return values of the call). If the PDP denies the call at this time, the application can possibly be stopped from further execution.

However, the problem with this approach is that the security policy is enforced at the system call level. This means that the policy can only work with those parameters that are passed to the system call e.g. the file to be read or the socket address. It cannot include information such as the authentication information of the application itself e.g. the username of the applications' user. This is a major limitation in our viewpoint because it does not allow information specific to an application to be used during policy execution.

Merz, in _Using the Dynamic Proxy Approach to Introduce Role-based Security to Java Data Objects_, defines a security manager and JAAS (Java Authentication and Authorization Service) based approach for incorporating fine-grained access control policies into the Java Data Objects architecture. The approach extends the JDO framework for security and proposed JDOSecure as an extension. While it offers a solid foundation for incorporating portable and code-independant policies for JDO, it is very implementation specific and cannot be used directly for other scenarios.

Security extensions for J2SE have been somewhat reduced in capacity in order to port them to the power-limited arenas of mobile platforms. The J2ME architecture does not include a security manager equivalent of J2SE. This poses serious issues for anyone interested in incorporating security policies in the J2ME architecture. Ion, Dragovick and Criso have defined a mechanism for _Extending the Java Virtual Machine to Enforce Fine-Grained Security Policies in Mobile Devices._ They extend the J2ME function call mechanism to check the calls against a user-defined policy before allowing or disallowing a specific operation. This exension is useful for J2ME based mobile devices. However, the implementation is the equivalent of the J2SE security manager and is not useful in Smartphones, which already have the basis of security management provided by the Java Virtual Machine.

**References:**

[1] Martinelli, F. and Mori, P. _Enhancing Java Security with History Based Access Control_. FOSAD 2006. LNCS 4677. pp 135-159, 2007.

[2] Matthiaz Merz. _Using the Dynamic Proxy Approach to Introduce Role-Based Security to Java Data Objects_. Eighteenth International Conference on Software Engineering and Knowledge Engineering (SEKE’06), San Francisco, USA.

[3] Ion, I. and Dragovic, B. and Crispo, B. _Extending the Java Virtual Machine to Enforce Fine-Grained Security Policies in Mobile Devices._ Twenty-Third Annual Computer Security Applications Conference, 2007. ACSAC 2007.

[4] Mark Petrovic. _Discovering a Java Application's Security Requirements._ At: http://www.onjava.com/pub/a/onjava/2007/01/03/discovering-java-security-requirements.html

[5] _Default Policy Implementation and Policy File Syntax_. http://java.sun.com/j2se/1.5.0/docs


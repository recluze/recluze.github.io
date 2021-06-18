---
layout: post
title: Agent Mobility with JADE and JIPMS
date: 2011-12-29 03:50:12.000000000 +05:00
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
  _publicize_pending: '1'
  _edit_last: '2'
  _s2mail: 'yes'
  _syntaxhighlighter_encoded: '1'
  videourl: ''
  original_post_id: '779'
  _wp_old_slug: '779'
  _oembed_496268550ef6277c8c310a85fbbadb7f: "{{unknown}}"
  _oembed_2946fd9d408a9e9a3e7ad2269d70f3cd: "{{unknown}}"
  _oembed_99d28b14fdf69a25f26fe2a7165c49b5: "{{unknown}}"
  _oembed_d791d42efffcac2adc0a2e6ea4451a88: "{{unknown}}"
  _oembed_05760ca63e75115d09926cd620552664: "{{unknown}}"
  _oembed_ae0fb887dd6ed38346d701f461c4645d: "{{unknown}}"
  _oembed_31092c90ea5c4678a44a18c596470060: "{{unknown}}"
  _oembed_d1303716eb4f9f2c0c41c2283da36535: "{{unknown}}"
  _oembed_c72f76c96b2a254a9efe4f2946d9275e: "{{unknown}}"
  _oembed_b35d4c9d330091a7566a549b4fb54e4e: "{{unknown}}"
  _oembed_9228dc2813bf923251f7f12e44ee5a38: "{{unknown}}"
  _oembed_3429310a6ebddf88cf8aa82cfe8403bf: "{{unknown}}"
  _oembed_ba149d3537658a77f2c619d434ff116e: "{{unknown}}"
  _oembed_0b7797e8fcd002c359fd2bdc89d320fa: "{{unknown}}"
  _oembed_45b6ea2b0ea3252a20922a9b8770e6a1: "{{unknown}}"
  _oembed_2fa4591dcfb1b09fc013f4b475c51545: "{{unknown}}"
  _oembed_fb44439fe0f91941b4add06d3c85c7ac: "{{unknown}}"
  _oembed_36858a5d403e1e6129b9ad13774dda44: "{{unknown}}"
  _oembed_ad2efa12154dd50d2d2c5c91609bedcf: "{{unknown}}"
  _oembed_db9c36c2845aebbc81b45fb140783449: "{{unknown}}"
  _oembed_50795ec629b172479b019a21cfd26f64: "{{unknown}}"
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2011/12/29/agent-mobility-with-jade-and-jipms/"
---
<p>A friend and I have been working on <em>Java Agent DEvelopment Framework (JADE)</em> for a while now. The idea is to enhance security mechanisms in the open source agent-deployment platform. The first step we decided to address was the actual mobility of an agent from one platform (in the sense of a dedicated machine running the JADE middleware) to another one. Turned out that it was much harder than one would imagine -- especially given the fact that these agents are supposed to be <em>mobile</em>. Anyway, after around two months of part-time efforts, we got the agent working. Since the whole ordeal involved a lot of missing documentation and bad support, I decided to document the process through this tutorial. So, here it is. Read on to see how you can create an agent on one platform, migrate it to another platform, have it do some computation there and come back to the source.&nbsp;</p>
<p><!--more--></p>
<p>First, you're going to need two machines running Ubuntu. (We used Ubuntu 11.10 oneric for this.) If you only have one machine, you can install VirtualBox, setup a Ubuntu instance in a VM and connect it to the host through a virtual interface. I prefer using two adapters, first one set to a NAT setting and another one set to Host-only setting. This way, I get Internet connectivity in the guest as well as host-to-guest simple addressing.</p>
<p><!--more--></p>
<p>We're going to use JADE 3.6 along with the <em>JADE Inter-platform Mobility Service (JIPMS)</em> 1.2 for our needs. Download <a href="http://jade.tilab.com/" target="_blank">JADE</a> and <a href="https://tao.uab.cat/ipmp/" target="_blank">JIPMS</a>.&nbsp; I used jade-binary package and extracted it in /home/documents/jade. I also extracted the JIPMS and moved the file migration.jar from its lib folder to the lib folder of jade binary. This makes it easier for us to change the classpath later on. We'll need these files on both machines.</p>
<p>Now we need to setup the machines. Here are the details of the setup on each machine:</p>
<p><strong>Host:</strong></p>
<p>hostname: slave1<br />
IP: 192.168.56.1 (set by VirtualBox automatically)</p>
<p>You can get the IP addresses of each machine through the ifconfig command. Edit /etc/hosts to insert the other machine's address. My hosts file on slave1 looks like this:</p>
<p>[sourcecode language="bash"]<br />
# 127.0.0.1&amp;nbsp;&amp;nbsp;     localhost<br />
127.0.0.1&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;     slave1<br />
192.168.56.101&amp;nbsp;&amp;nbsp;&amp;nbsp; slave2<br />
[/sourcecode]</p>
<p>Now, we can run jade using the following command:</p>
<p>[sourcecode language="bash"]<br />
java -cp lib/jade.jar:lib/migration.jar:lib/iiop.jar:<br />
         lib/jadeTools.jar:lib/http.jar:<br />
         lib/commons-codec/commons-codec-1.3.jar<br />
     jade.Boot<br />
         -gui<br />
         -platform-id slave1<br />
         -host slave1<br />
         -services jade.core.mobility.AgentMobilityService;<br />
                   jade.core.migration.InterPlatformMobilityService<br />
         -accept-foreign-agents true<br />
[/sourcecode]</p>
<p>You will need to use a little common sense about the line breaks and spaces here. I've formatted the command for highest readability. (Note the escaped ';' in the services param and the use of full colon instead of the semi-colon in the classpath. This is only required on *nix platforms.) Three switches are important here: platform-id, host and services.&nbsp; First two are self-explanatory. Third tells the IPMS to start the services that take care of the agent migration. We also need to enable the acceptance of foreign agents but I'm sure you already knew that from all the mailing list searches.</p>
<p><strong>Guest:</strong></p>
<p>hostname: slave2<br />
IP: 192.168.56.101 (set by VirtualBox automatically)<strong></strong></p>
<p>The hosts file looks like this:</p>
<p>[sourcecode language="bash"]<br />
# 127.0.0.1&amp;nbsp;&amp;nbsp;   localhost<br />
127.0.0.1&amp;nbsp;&amp;nbsp;  &amp;nbsp;&amp;nbsp; slave2<br />
192.168.56.1&amp;nbsp;&amp;nbsp;&amp;nbsp; slave1<br />
[/sourcecode]</p>
<p>Start jade on slave2 using the following command:</p>
<p>[sourcecode language="bash"]<br />
java -cp lib/jade.jar:lib/migration.jar:lib/iiop.jar:<br />
         lib/jadeTools.jar:lib/http.jar:<br />
         lib/commons-codec/commons-codec-1.3.jar<br />
     jade.Boot<br />
        -gui<br />
        -platform-id slave2<br />
        -host slave2<br />
        -services jade.core.mobility.AgentMobilityService;<br />
                  jade.core.migration.InterPlatformMobilityService<br />
        -accept-foreign-agents true<br />
[/sourcecode]</p>
<p><strong>The Agent:</strong></p>
<p>Now, we turn to the actual agent code that does the migration. For this, we can setup eclipse and code from within that. The code for the agent is fairly straight-forward:</p>
<p>[sourcecode language="java"]<br />
package org.csrdu.mobility;</p>
<p>import jade.core.AID;<br />
import jade.core.Agent;<br />
import jade.core.PlatformID;<br />
import jade.core.behaviours.TickerBehaviour;</p>
<p>@SuppressWarnings(&quot;serial&quot;)<br />
public class MobileAgent extends Agent {</p>
<p>    @Override<br />
    protected void setup() {<br />
        super.setup();<br />
        addBehaviour(new MyTickerBehaviour(this, 1000));</p>
<p>        System.out.println(&quot;Hello World. I am an agent!&quot;);<br />
        System.out.println(&quot;My LocalName: &quot; + getAID().getLocalName());<br />
        System.out.println(&quot;My Name: &quot; + getAID().getName());<br />
        System.out.println(&quot;My Address: &quot; + getAID().getAddressesArray()[0]);<br />
    }</p>
<p>    private class MyTickerBehaviour extends TickerBehaviour {<br />
        Agent agent;<br />
        // long interval;<br />
        int counter;</p>
<p>        public MyTickerBehaviour(Agent agent, long interval) {<br />
            super(agent, interval);<br />
            this.agent = agent;<br />
            // this.interval = interval;<br />
        }</p>
<p>        @Override<br />
        protected void onTick() {<br />
            if (counter == 3) {<br />
                // move out<br />
                AID remoteAMS = new AID(&quot;ams@slave2&quot;, AID.ISGUID);<br />
                remoteAMS.addAddresses(&quot;http://slave2:7778/acc&quot;);<br />
                PlatformID destination = new PlatformID(remoteAMS);<br />
                agent.doMove(destination);<br />
            }<br />
            if (counter == 10) {<br />
                // move back<br />
                AID remoteAMS = new AID(&quot;ams@slave1&quot;, AID.ISGUID);<br />
                remoteAMS.addAddresses(&quot;http://slave1:7778/acc&quot;);<br />
                PlatformID destination = new PlatformID(remoteAMS);<br />
                agent.doMove(destination);<br />
            }<br />
            if (counter &lt; 15)<br />
                System.out.println(counter++);<br />
            else<br />
                agent.doDelete();<br />
        }</p>
<p>    }<br />
}<br />
[/sourcecode]</p>
<p>For the sake of completion, here's the arguments that you have to pass when running the agent code from within eclipse.</p>
<p>[sourcecode]<br />
-container -agents mob:org.csrdu.mobility.MobileAgent<br />
  -services jade.core.mobility.AgentMobilityService;jade.core.migration.InterPlatformMobilityService<br />
[/sourcecode]</p>
<p>Also, add all the jade and mobility jars to the build path of the project. I'm not sure which ones are needed here so you will have to figure that out on your own. </p>
<p><strong>Caveats:</strong></p>
<ol>
<li>If you get this error:  <code>Destination slave2:1099/JADE does not exist or does not support mobility</code>, it most probably means that you (a) you don't have IPMS running, (b) you didn't put the -services switch properly (c) there's a firewall blocking your port 7778 or (d) your hostnames are messed up. In any case, the whole instructions above should work for you.
     </li>
<li>You will most probably need to change your /etc/hosts file and comment out the line that says '127.0.0.1 localhost'. It causes JADE to start the ams@slaveN service as http://localhost:7778/acc instead of http://slaveN:7778/acc and that means a lot of missed ACL messages and a lot of headaches. You usually get the dreaded <code>getContainerID() failed to find agent ams@slave1</code> error because of this. Do this for both the host and the guest. Make sure your JADE GUI looks like the following:<br />
<a href="http://recluze.files.wordpress.com/2011/12/rma_jade_slave.png"><img src="{{ site.baseurl }}/assets/images/2011/12/rma_jade_slave.png" alt="" title="JADE GUI for AMS Address" width="586" height="393" class="aligncenter size-full wp-image-784" /></a></li>
<li>Finally, if you need detailed logging, you can create the logging config file by the name of logging.properties given below and pass the <code>-Djava.util.logging.config.file=logging.properties</code> parameter when starting JADE. This will give much finer-grained logs. This is standard log4j syntax.
</li>
</ol>
<p>[sourcecode]<br />
handlers=java.util.logging.FileHandler, java.util.logging.ConsoleHandler<br />
.level=INFO<br />
jade.domain.mobility.level=ALL</p>
<p># --- ConsoleHandler ---<br />
java.util.logging.ConsoleHandler.level=ALL<br />
java.util.logging.ConsoleHandler.formatter=java.util.logging.SimpleFormatter</p>
<p># --- FileHandler ---
  
java.util.logging.FileHandler.level=ALL

java.util.logging.FileHandler.pattern=%h/java%u.log  
java.util.logging.FileHandler.limit=50000  
java.util.logging.FileHandler.count=1  
java.util.logging.FileHandler.formatter=java.util.logging.SimpleFormatter  
[/sourcecode]


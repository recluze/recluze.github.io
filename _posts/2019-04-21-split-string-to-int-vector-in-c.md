---
layout: post
title: Split string to int vector in C++
date: 2019-04-21 06:04:38.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Articles
- C++
- Geek stuff
- Tutorials
tags: []
meta:
  show_content_top_margin: default
  auxin_featured_color_enabled: '0'
  _edit_last: '1'
  _format_audio_embed: ''
  page_sidebar_style: default
  page_layout: default
  _format_video_embed: ''
  _format_quote_source_url: ''
  _format_quote_source_name: ''
  auxin_featured_color: "#1bb0ce"
  aux_post_title_show: default
  page_content_title_alignment: default
  aux_post_info_show: default
  post_content_style: default
  blog_single_show_media: default
  blog_archive_show_featured_image: default
  aux_title_bar_show: default
  subtitle_position: before
  aux_title_bar_preset: default
  aux_title_bar_enable_customize: '0'
  aux_title_bar_content_width_type: boxed
  aux_title_bar_content_section_height: auto
  aux_title_bar_title_show: '1'
  aux_title_bar_heading_bordered: '0'
  aux_title_bar_heading_boxed: '0'
  aux_title_bar_meta_enabled: '0'
  aux_title_bar_bread_enabled: '1'
  aux_title_bar_bread_bordered: '0'
  aux_title_bar_bread_sep_style: gt
  aux_title_bar_text_align: left
  aux_title_bar_overlay_pattern: none
  aux_title_bar_overlay_pattern_opacity: '0.15'
  aux_title_bar_color_style: dark
  aux_title_bar_bg_show: '0'
  aux_title_bar_bg_parallax: '0'
  aux_title_bar_bg_size: cover
  _format_video_player_skin: default
  _format_audio_player_skin: default
  aux_custom_bg_show: '0'
  aux_custom_bg_repeat: repeat
  aux_custom_bg_attach: scroll
  aux_custom_bg_position: left top
  aux_custom_bg_size: auto
  aux_metafields_custom_styles: ''
  _wpas_done_all: '1'
  _themeisle_gutenberg_block_styles: ''
  _themeisle_gutenberg_block_stylesheet: post-1503-1610487316
author:
  login: admin
  email: ''
  display_name: admin
  first_name: ''
  last_name: ''
permalink: "/2019/04/21/split-string-to-int-vector-in-c/"
---


As you guys might know, I’m not so fond of C++. The C language is great but the ++ additions are just not my thing. Here’s an example of why: If you want to split a comma separated string into integers in Python, it’s as simple as:&nbsp;



```
[int(s) for s in str.split()]
```


And you’re done! But in C++, you first have to create a stream and them put the string through the stream to tokenize is and then read again from the stream. The semantics are pretty much the same as Python but the syntax is just horrible. Anyway, here’s how you would do it in the cleanest way possible:&nbsp;



```
vector<int> split(const string &s, char delimiter) {     
    vector<int> tokens;     
    string token;     
    istringstream tokenStream(s);     
    while (getline(tokenStream, token, delimiter)) {      
        tokens.push_back(stoi(token));     
    }     
    return tokens;  
}
```


And to call it from wherever you need it, just do this:&nbsp;



```
string in = "1,2,4, 5";
vector<int> res = split(in, ',');
cout << res[3] << endl;
```



---
layout: post
title:  Using Deep Learning for Source Separation (Music Removal)
date: 2021-06-22 08:00:00.000000000 +05:00
published: true
status: publish
categories: 
- Geek Stuff 
- Site
- Open source 
---

I wanted to share a case study on how open source can help solve mundane, every day, personal, real world issues. 

I have limited screen time set for my kids. They are usually interested in watching documentaries in this time but I don't want to open YouTube up for three reasons: ads, lack of control and background music. 

<!-- more -->

So, I decided to solve the issue by downloading specific YouTube videos to a local linux machine (using Youtube-DL -- which is open source).

```bash
pip install youtube-dl 
youtube-dl [url of video to download]
```

Since removing music from videos is a difficult task especially since they are overlaid on top of narration in documentaries, I extract the audio track from the downloaded video (using FFMPEG, also open source). 

```bash
# -vn means don't include video, -an means remove audio
ffmpeg -i [video_src] -c:v copy -vn audio-file.wav 
ffmpeg -i [video_src] -c:v copy -an video-file.mp4
```

I then use another open source tool called Spleeter to do source separation (aka music removal) from the audio track. 

```bash
# 2stems means use the model that separates vocals from instrumentals
# -o is the output directory and -f is the naming scheme for output 

spleeter separate -p spleeter:2stems -o temp/ -f "{instrument}.{codec}" audio-file.wav
```

Spleeter, by default, can only do source separation for 10 minute audios. You can change it but it requires a lot of resources. The solution to this problem was fairly straight-forward: split the videos in parts of 10 minutes each. This can be done easily with ffmpeg. 

```bash 
!ffmpeg -i downloaded-video.mp4 -c copy -map 0 -segment_time 00:10:00 -f segment -reset_timestamps 1 video-Part-%02d.mkv
```

I then merge the cleaned audio track with the video using FFMPEG again. 

```bash
ffmpeg -i video-file.mp4 -i temp/vocals.wav -c copy output_video.mkv 
```

This new, pre-processed video is then copied over to a local library which is served to local machines using the Plex media server. Plex is mostly open source but there are fully open source variations for local media hosting available as well. The kids can then watch using a browser and that solves all three issues I had with YouTube. 

All of this is done using the Linux command line and takes me no more than a couple of commands and a few minutes. If anyone is interested, you can checkout the simple script to do all this here. [github.com/recluze/tinimir](https://github.com/recluze/tinimir)

---
title: Projects
permalink: /projects/
layout: single
---
### Experimental Song Extender
A song extender app - idea borrowed from [The Infinite Jukebox](http://labs.echonest.com/Uploader/index.html). Currently a proof-of-concept that could very potentially be polished/developed further if there is demand.

*Note:* Don't worry if the binaries show a warning when run - I did not code sign it.

First working version 30 Jan, 2017
Last updated 30 Jan, 2017

 + Try it (zip):
     + [Windows x64](https://s3-ap-southeast-1.amazonaws.com/desktop-app-packages/song-extender/song-extender-win32-x64.zip)
     + [Windows x86](https://s3-ap-southeast-1.amazonaws.com/desktop-app-packages/song-extender/song-extender-win32-ia32.zip)
 + [Repository](https://github.com/luungoc2005/song-extender-electron)

### Spotify Explorer
An artist explorer app for Spotify, making use of Spotify Web API for search, suggestions and track samples.
A good way to pass a few minutes. I myself found a few favorite tracks while testing it.
Does not support sample track playing on mobile, thanks to my implementation of volume fading and mobile browsers being picky about loading tracks (*ugh..*). There are workarounds, but it will take a while to implement and I still lack the means to test on iOS.

First working version on 19 November, 2016
Lasted update 5 December, 2016

 + [Try it]({{ site.url }}/projects/SpotifyExplorer)
 + [Repository](https://github.com/luungoc2005/SpotifyExplorer)

### To-do list using jQuery and Local Storage
This is essentially a copy of [this tutorial](https://www.sitepoint.com/building-list-jquery-local-storage/) as part of an assignment for an online course I attend. Below are some few modification I made

 + Upgrade to jQuery 3 instead of jQuery 1.1 dependency (I just feel like it)
 + Added Owner field
 + (Bug fix) Making tasks stay on top when dragged
 + (Feature) Change text color for overdue tasks
 + (Feature) CSS style tweaks, description can have multiple lines

Known issues:
 + Ordering of task items are not saved

I no longer maintain this project. However the repo can be found on my github.

 + [Try it]({{ site.url }}/projects/To-do List/index.html)
 + [Repository](https://github.com/luungoc2005/ToDoList-Update)

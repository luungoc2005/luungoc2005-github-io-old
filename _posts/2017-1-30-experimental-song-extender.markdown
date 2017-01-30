---
title:  "An Experimental Song Extender"
date: 2017-01-30 18:29:31 +7
comments: true
categories:
 - projects
 - electron
 - javascript
---
As a continuation of my Shazam algorithm experiment, I decided to build something new: a song extender. The idea is that, in the vast majority of contemporary music, there are often duplicated parts throughout the songs. The "Shazam algorithm" described in my previous post can be applied to identify these parts and ..loop them.

This could be a rather meaningless project, but it does have its use: to extend a favorite song to maybe 1.5x or 2x longer, or maybe to visually see for your self which parts of a song are similar - which may be interesting in itself.

This idea is actually stolen from [The Infinite Jukebox](http://labs.echonest.com/Uploader/index.html). I do use a completely different algorithm that does not involve beat detection, so the results will be vastly different. Mine does not identify similar beats, but rather long segments, so it tends to loop at the chorus and instrumental lead-ins. It also does not randomly jumps between parts, but rather just loops back when it reaches the later part of a similar segment.

![The Song Extender]({{ site.url }}/assets/images/song-extender-screenshot.png)

Again - this is one project that can be vastly improved/polished. Ideas that I have in mind (and totally possible) include:
- Ability to save the analysis in JSON format for loading
- Ability to save the extended file in MP3/Wave format
- Ability to extract the duplicate/loopable parts and save to MP3/Wave format (perhaps, to make ringtones?)
- Ability to find paths so that the song can actually loop indefinitely

There also remain ideas to simply polish the app:
- Removal of some hacks in the code
- Probability for looping the parts
- Display of a "self-similarity score": this is actually close to done but not shown on the interface: songs like Gangnam Style would have very high score compared to songs with a low score - which will often have trouble looping at all.
- The analysis can perhaps be more optimized for performance.

And...there are problems that I know still exists, but can't be bothered to fix right now:
- The preprocessing can take a while on certain files. Don't know why that is.
- No support for 24-bit audio or IEEE encoding yet. The only thing it accepts now is 16/32 bit PCM audio.
- Seeking & chart is currently buggy for a lot of songs. It was hacked together to illustrate the analysing algorithm, so...

For now, the repository is available on [my Github](https://github.com/luungoc2005/song-extender-electron). To try it, you need the following steps:
1. Have Node.js (with npm included) - installed.
2. Clone the repository, navigate to the local folder and run `npm install`.
3. _Once done_, navigate to `/node_modules/.bin/` and run `electron-rebuild`.
4. You can then debug with VSCode or run by `npm run start`.

The project makes use of the following packages
- Electron (amazing if still slightly buggy and heavy-weight - way to make cross-platform desktop applications)
- d3 (the amazing if hard to use SVG visualization libary)
- Howler (the go-to web audio library - I use this to seek to parts of the tracks as tradditional HTML5 audio produces noticable latency when seeking/toggle playing or pausing).
- node-lame & node-wav for audio decoding
- DSP.js for the fast fourier transform
- Bootstrap & jQuery

A standalone package will be uploaded once I iron out some remaining bugs, at least for Windows x64. (especially one with Howlerjs on Electron Chromium...).

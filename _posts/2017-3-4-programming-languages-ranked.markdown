---
title:  "Programming Languages, ranked"
date: 2017-03-04 21:19:15 +7
comments: true
categories:
 - c#
 - java
 - javascript
 - visual basic
 - python
---

Wow, hasn't it been a month since I last write. No wonder why it felt so long. Anyway, this post has been an idea on my mind for a while, and it's definitely going to be controversial. This list is in no way comprehensive, as I cannot claim to know ALL the languages out there. However, I'm going to express a strong opinion about what I do know, so take it with a grain of salt. I also realize that this list does lack a few notable languages like Ruby or Golang, but I can't possibly have comments on things that I don't know about - but I might want to learn it when I'm no longer busy keeping up with Javascript updates. Now let's get on with the worst language, or just scroll to the bottom to find the best.

### Brainfuck
Yes, this is [an actual programming language](https://en.wikipedia.org/wiki/Brainfuck). Go ahead, read the article, it's probably a language purposefully made to be bad. A honorable mention to [LOLCODE](http://lolcode.org/) but it's for the hilarity, and still looks to make sense in a way. Ok, now with this entry out of the way, let's move on to some more serious languages.

### Assembly
No, I probably shouldn't count this as a programming at all, but it kind of is, and a lot of people use it. I would say, a thorough understanding of it would be nice for decompiling other applications or coding for applications that require high performance, though you would be better of looking into OpenCV and GPU floating-point calculations for many such tasks.

### C/C++
These used to be the go-to languages for cross-platform applications, as well as providing a nice mix of performance and benefits of higher-level languages. The problem? Pointers are just too easily prone to human error. No matter how good a programmer one is, he is bound to mix up his code eventually, and pointers cause mind-bogglingly difficult bugs to debug. Even if the code works and the corner cases aren't properly mapped out, the code will be prone to security issues. In this new century, I trust that computers have generally outgrown performance requirements, rendering these languages a lot less useful, except for perhaps coding exercises.

### Visual Basic 6/VBA
While Visual Basic 6 has become irrelevant *really* quickly, VBA is still included in the newest versions of Office. And it's bad. I would love if Microsoft would some day improve the de-facto automation support in the Office suite, making it less prone to error, or at least making it something easier and more worthwhile to learn. Or just add built-in C# support for Office (though we seem to be getting there, in a way). Probably first add better syntax suggestion support for it, because Office just has way too many functions to remember. The documentation is being croudsourced to Github recently though, so it's nice to see Microsoft not entirely neglecting it.

### PHP
This has long been considered by many as a cancer to programming languages. It had too much widespread use in maybe a few years ago, and a lot of people aren't just willing to let go of it. To newcomers, though, it's easy to realize that PHP is bad by design, has terrible sense of function-naming, bad performance-wise, and not-so-great libraries support. The community is still of decent size, though, and a lot of modern tech firms still adopt it. Me, personally, I would want PHP to die as quietly as VB6 has.

### Java
Now we're getting to the high level languages. Java, in fact, has a lot of ongoing support for it. However, it is way outclassed in many ways by other languages in the few recent years. It is also poor by design, with a lack of useful syntax and bad overall performance. It is also not as actively improved by its own creators - Oracle, and also lacking in modern libraries support.

### Python
I would consider Python a *great* language. Not specifically by design, though. Python now currently has both 2.7 and 3. versions, but it's bound to confuse newcomers because 2.7 is the more widely embraced version, and v3 just has bad backwards compatibility - it's bound to break a lot of ongoing love for v2.7. The documentation is also poor, and the language is not necessarily performance-oriented. Support going for it is tremendous, though. Python has an absolute ton of great, quality libraries for various specific tasks. The libraries and frameworks more than make up for all of its shortcomings, examples including NumPy and Beautiful Soup. It also has built-in support for JSON and easy URL-scraping, making it efficient for doing web crawlers and a lot of simple-to-complex math.

### Javascript
I still remember a time when Javascript wasn't so fortunate. But then jQuery came out, then NodeJs came out, and all of a sudden Javascript is becoming the greatest thing ever. The thing is, it's not even that great by design, though with ES6 is getting somewhere - or performance-wise, even with Google-backed Chrome engine. Consider Javascript's naming sense and the fact that there is now Coffescript and Typescript to try and make up for Javascript's poor language design, though I personally believe that those languages are not worth it in the way Sass/Less did for CSS (Typescript is rather promising, though). It's amazing, though, how creative everyone is getting with libraries for it. One can do absolutely anything with Javascript nowadays - from making complete cross-platform applications, spanning from Web to Mobile to Desktop, and even write Embedded with it. It also has spectacular libraries for specific tasks - I'm convinced that D3 is the greatest charting library among any languages. In fact, having too many libraries competing is gradually becoming a problem for the Javascript world: knowledge learned in Javascript can quickly become irrelevant in about 3 to 5 years. jQuery itself is being forgotten in favor of more lightweight libraries, Google-backed AngularJs being ursurped by ReactJs, Browserify being abandoned for Webpack. Not to mention, because there is no clear direction or authority for open source software development, there can be so many breaking changes with new versions of new libraries. While it is for the better, I truly hope that Javascript would some day settle down and the libraries would filter themselves out to leave only a few left standing that can be considered standards and safe to learn.

### C &#35
Ah, I probably should have mentioned VB.Net - C#'s unloved cousin. They are largely similar, however the C# community is just larger and better by a huge margin. In any case, C# is being improved at a good pace, has great backwards compatibility - so you don't need to re-learn everything you know once a new version comes out. It is also becoming cross-platform with Xamarin and .NET Core. It has a strong corporate backing by Microsoft, great language design - actually - the best language design of all, good performance thanks to being a compiled language and not having to rely on the JIT. The sad thing, though, this causes it by nature to not really geared towards the open source community, which means libraries support are only subpar at best. There are a few independently developed libraries for .Net which have become essentials, or perhaps bought by Microsoft. However, many good libraries for .Net just seems to lack enthusiasm compared to Javascript, and many essential libraries do not seem as completed or in good quality as Python libraries do. Built-in language support is great, though it will never cover all bases the way the open source community can. It was difficult to try and rank between C# and Javascript, because - considering the practical side, Javascript is overwhelmingly dominant. However, C# remains a safe bet to new comers and worthwhile to learn. Considering its design, I trust that C# will remain stable, steadily improving and safe for years to come.

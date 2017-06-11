---
title:  "jQuery? Please kill it!"
date: 2017-05-03 16:44:12 +7
comments: true
categories:
- jquery
- javascript
---

jQuery was once hailed as the biggest thing out there for Javascript. But as with everything else, there is a time to move on. I personally believe that jQuery's time has long passed, at least, for production scenarios. While jQuery may provide a quick way for writing scripts (it *is* pretty great for PhantomJS), nowadays there is nothing that jQuery can do that cannot be replaced by some more opinionated library. Cross-browser compatibility? one should just flat-out refuse to serve anything from IE8 and under. It will make happy developers, a more beautiful codebase, and a lot less maintenance cost.

In fact, [this site](http://youmightnotneedjquery.com/) includes a comprehensive list of built-in replacements for jQquery.

For practical scenarios, you would want to use a fully-fledged framework for web components instead of using jQuery to create dynamic pages. At the time of writing, RiotJS is ~10 KB and React-lite is ~20 KB, both are quick to learn (should take about a day) and helps create more readable code. Modern frameworks also take advantage of performance optimizations to avoid DOM reflows - possibly jQuery's biggest pitfall.

For AJAX requests, using jQuery is plainly overkill. In fact, the above link is outdated - the [Fetch API](https://developer.mozilla.org/en/docs/Web/API/Fetch_API) is a more future-proof, natively supported, gives more control on responses (with methods like `blob()`, `text()` and `json()`) and overall prefered method for AJAX requests.

While it may seem easy to get caught up in the Javascript (or ECMA script - *technicalities*) arms race, any self-respecting front-end developer should know the bare minimums about the NodeJS ecosystem nowadays. In 2017, the only reason to use jQuery would be for ease of use, but that should not be a reason for one to bring jQuery into production. Reliance on jQuery will make developers blind to the advances in other - better, more testable and maintainable technologies. Nothing is guaranteed future-proof in tech, but using outdated technology from the get-go is a certain recipe for disaster
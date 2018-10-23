---
title:  "Good abstraction vs Bad abstraction"
date: 2018-08-22 16:56:00 +7
comments: true
categories:
- abstraction
- python
- javascript
- c#
- dotnet
---

In programming I often find myself getting into abstracting things. Most of the needs often start from repetitive function calls. It tremendously help with refactoring because you don't need to modify bits of codes scatered everywhere. And hey, it's a computer - it's supposed to save you from doing repetitive stuffs in the first place!

However, sometimes, this repetition can be better than the alternative: bad abstraction. I would name a few examples of bad abstraction as follows.

1. Being gratuitous

It can help you scale and reuse code, but if it's saving from 2-3 lines of code to 1, maybe the added learning curve isn't worth it.

I did see this a lot in large codebases. It usually comes from using a common piece of code between 2-3 functions. But in a large codebase, it will be difficult for anyone to find an exact piece of code for a specific functionality anyway. Making the code longer can actually help readability.

2. Hard to learn

This I would define as - abstractions that doesn't bring much functionality but requires you to have more understanding as you dwelve into it - actually reading the source code and stuffs.

Javascript and Python probably has the largest amount of bad abstraction around. From open source libraries of course - they often lack good direction is one thing, a lot of them tend to be over-engineered.

For a javascript example: The `import` statement is a bad abstraction. If it's merely syntactic sugar for `require` - but the statement itself is not as descriptive and looks alien to javascript syntax - without.

3. Too opinionated

Abstractions _can_ be opinionated - or sometimes - it _should_ be. It creates standards that people follow. However there should always be an escape hatch for use cases that we can't foresee at design time. This is easier to do in more lenient languages like Javascript or Python, and can be very hard to do in stricter languages like .Net.
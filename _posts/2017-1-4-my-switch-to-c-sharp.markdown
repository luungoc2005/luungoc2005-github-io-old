---
title:  "A bit of history: My switch to C#"
date: 2017-01-04 11:00:33 +7
categories:
- misc
---
I first began my programming journey with Visual Basic 6. And I remained their for 2 whole years. At the time, I had contact with Javascript and my childish eyes were scared by all the braces and semicolons. Visual Basic felt way more intuitive.

After a while, I began to realize that a whole ton of online examples is written in either C++ or C#. It was *scary*. As a child I was afraid of change. I considered myself good at programming, and changing means I would lose all of that. My superiority complex prevented me to change.

The switch from VB6 to .Net was monumental. No longer did I need to go out a mile for Unicode support or clunky exception handling. Yet I resisted for a while: how it required the 35MB .Net framework download while VB runtime was built-in, how it was *slower*. I would make excuses to defend VB6, but the conveniences of .Net quickly pulled me in.

At this point I was mature enough to realize that the community also matters. A lot. A large proportion of VB online codebase is ...*not* optimally written, to say the least. Many solutions for more complex issues is written in C#, and I had to spend a lot of time and experimented with many C# to VB converters. It was a giant waste of time: they are essentially the same languages. I had a point when I needed to write C++ code for a DLL to accompany my windows hook code. I griefed the experience the entire time, even though it was the simplest of code. However, in the back of my mind, Javascript and C are problems I would have to confront eventually.

Then it came the day when I experimented with image processing. This was an instance where I was forced to go with C# because of the `unsafe` block. It is baffling how VB does not have such a simple and much-needed feature, even if it goes against the nature of the language - to be structured and simple. I quickly get used to C# within days, and never looked back. It was no longer scary. The braces were more handy than `End If`, `End Select` blocks (I still do miss the `With <object>` blocks though), and I learned to appreciate being able to simple line break without having to add underscores `_`. I learned to embrace type conversions - heck, I now feel insecure if I don't do an explicit type conversion.

Picking up on the momentum, I am now no longer afraid of new languages (okay, so maybe I *am* slightly afraid of Python, what with the nasty indentation problems and weakly typed variables - I still intuitively cringe at the thought of not performing an explicit type conversion from integer to float when I see it). I learned Javascript fairly handily afterwards. Experiences with every new language were exciting - to learn of the new possibilities that I never were capable. Then again, it is assuring to know that C# is widely regarded as one of the most prominent languages out there. If I do have to introduce someone to programming, I would definitely recommend C# to begin with. It is potentially dangerous to develop a fear of lower-cased naming, curly braces and semicolons and all, and even more worrisome to learn from the poor online codebase. Once the leap is made, it should be entirely smooth sailing.

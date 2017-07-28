---
title:  "Experience with Typescript"
date: 2017-07-14 16:21:20 +7
comments: true
categories:
- jquery
- javascript
- typescript
- react
---

For all the Flow vs Typescript arguments, one would have to conclude that Typescript does have more widespread [support on popular libraries](https://github.com/DefinitelyTyped/DefinitelyTyped). Using Typescript is argued to make one *feels* productive rather than being actually productive - but in-code documentation is great. However, it is not without its shortcoming - which I will attempt to list in this article through my brief experience with it.

The Pros:

### The Cons:

From my own experience, given Typescript being seemingly shallow on the surface - it actually does incur a significant learning curve. Most of it comes from the aforementioned DefinitelyTyped repository. For every single JS library that I have learned, I now have to learn the Typescript interface naming for it - even if the primitives `number`, `boolean`, `string` etc. are handled gracefully.

Consider the following:

For `React` - The namings should be obvious: There are `React.Component<Props, State>`; `React.PureComponent` which expands on it.

And then there is `React.SFC` - Stateless Functional Component - which I only found out from diving into the Typescript definition file - without any documentations anywhere whatsoever. And Typescript is _supposed_ to be document itself - this is Documentation in the form of source code - but without much explanation and not directly attached to the object being documented itself.

Then there are the plethora of namings for common libraries such as ImmutableJS or Reselect. Fixing typescript warnings for code that you know will work is a pain - even if it might lead to discovery of errors along the way.

Essentially, you will have to dive into the Typescript definition files _a lot_. And that's not how it's supposed to do. Especially when the definitions are usually nested deep inside the trash dump that is `node_modules`. JSDocs once handled this way more gracefully by putting the documentation right on top of the object documented. While separate type definitions are great for providing definitions to existing libraries, it shouldn't be made standard. Libraries such as `React` which includes Typescript definitions by default - should provide it with the code itself and not in separate files - which severely hinders readability.

### The Pros

While it might hinder a single developer, in teams - it can greatly help standardizing the code - if the team can conform to it. I have seen teams using Typescript and could not avoid assigning `any` to everything. In this case Typescript does little to help - it might even cause the developers who actually care about code cleanliness to feel that the code is ugly.

Another case where Typescript greatly helps: JSON responses. Documentation for JSON is awesome, especially if the back-end development server or data is unstable. Back-end developers might not follow functional principles of arguments in - results out and would often times give variable results. Having documentation on hand without having to rely on noting down the results leads to a very productive developer experience.

### Conclusion

Let's just say I'm on the fence about Typescript actually being favored over ES6/7. For now, myself would gladly adopt Typescript for new personal projects, but ES6/7 would be my choice for team projects - for it being familiar to a lot more people. ES6-7 helped aleviate the pain points of Javascript, and doesn't leave much room for Typescript to improve on - while Typescript just added abstraction without much benefit.
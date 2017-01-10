---
title:  "Happy New Year!"
date: 2017-01-03 17:18:54 +7
comments: true
categories:
- misc
---

It is finally the year 2017.

I have never been the kind of person to do new year resolutions. Even though it is a good thing to do, in the sense that you get to review personal objectives and achievements. As frequent as I update my blog posts, however, I tend to get distracted by a lot of things.

If you do follow my Github repo, you might find that I should be working on the following:
+ The HTML5 audio tag tutorial on this blog
+ The color picker using Bootstrap

There is also a markdown editor, with basically just the boilerplate code at the moment. It is essentially a to-do list item which I might never finish.

So why are those pending for so long? basically I am, at this moment, no longer interested in web front-end programming. While I may regain interest in the future, I am now all crazy for some statistics and machine-learning with Accord.NET or AForge.NET. While .NET is not exactly a great platform for this kind of stuff, it is a language I am familiar with. After all, I was able to build a simple - but fully functional and user friendly analytical piece of software in half a day, a feat I could not have done in any other languages.

I might write a later blog post on my own findings and experiences within the last 2 weeks (it was _thrilling_, to say the least). But for now, it is also a good time to remind myself that I still do have somewhat an obligation to maintain this blog. I am just going to leave the two above projects as pending, which I might get back to after I finish everything I want to do.

For now, I will get back to my little experiments at hand and maybe document a little in the upcoming weeks.

**Update**: Since it would be irresponsible to leave nothing behind, I am adding a [new repository](https://github.com/luungoc2005/DotNetUtilities), where I will (hopefully) put in some useful piece of reusable .Net code.

First one is [DataHelper](https://github.com/luungoc2005/DotNetUtilities/blob/master/DataHelper.cs): Since .Net has a plethora of Neural network libraries, of which I found Numl, Accord.Net and AForge.Net. At first Numl seemed aluring because it was compatible with .NET Core (the latter two required .Net Framework 3.5), but I realized it was utterly incomplete, despite my personal efforts to add features to it. Nevertheless, I did like the use of reflection for easy syntax, so I made my own library to quickly generate arrays of data to use with the other libraries. Usage as follows:

Add property attributes the class that you want to evaluate:
{% highlight csharp linenos %}
    public class TimeSeriesData
    {
        [Feature]
        public int[] DataPoints { get; set; }

        [Feature]
        public double StdDev { get; set; }

        [Label]
        public int NextDataPoint { get; set; }
    }
{% endhighlight %}

Use with Accord.Net - pieces of code taken from [Accord.Net docs](http://accord-framework.net/docs/html/T_Accord_Neuro_Learning_ResilientBackpropagationLearning.htm)

{% highlight csharp linenos %}
    var inputList = new List<TimeSeriesData>();
    // populate list values here

    TimeSeriesData[] inputs, outputs, testingInputs, testingOutputs;
    DataHelper.SliceData(inputList.ToArray(), 0.8, out trainingList, out testingList);

    inputs = DataHelper.GetInputArray(trainingList);
    outputs = DataHelper.GetOutputArray(trainingList);

    testingInputs = DataHelper.GetInputArray(testingList);
    testingOutputs = DataHelper.GetOutputArray(testingList);

    // Initialize the network
    ActivationNetwork network = new
    ActivationNetwork(SigmoidFunction(2),
DataHelper.GetFeaturesCount(typeof(TimeSeriesData)), // number of features as input neurons
15, // hardcoded hidden layer neurons
DataHelper.GetLabelsCount(typeof(TimeSeriesData))); // number of labels as output neurons

    // Initialize training
    ResilientBackpropagationLearning teacher = new ResilientBackpropagationLearning(network);

    // Begin training the network
    while ( !needToStop )
    {
        double error = teacher.RunEpoch(inputs, outputs );
    }
{% endhighlight %}

While this class can obviously be improved for performance, it is sufficient for my own use, and I spent a little north of an hour to write this blog and code commentary for it, so might as well share it, eh :]

---
title:  "Machine Learning with the Vietnam Stock Market"
2017-03-11 0:45:26
date: 2017-03-11 0:45:36
comments: true
categories:
 - python
 - machine
 - learning
 - stocks
 - statistics
---

Having my background in finance, naturally the idea of being able to analyse the stock market is extremely appealing to me. Vietnam Stock Market has its own peculiarities, most importantly: the T+3 rule. Basically, the rule states that one can only buy a number of stocks and sell 3 days after - and get the cash back 3 more days after that. As far as I can observe, it seems this does make the market susceptible to lags. The market is also rumored to be opaque and highly susceptible to insider trading. Therefore, I would very much like to see for myself how much the [EMH](http://www.investopedia.com/terms/e/efficientmarkethypothesis.asp) applies.

In this post I am not going to post so much of the how - but more like documenting the results I obtained. Feel free to dive into my Github for it (I will provide links in the post), but I wouldn't recommend it, because this is for my personal use, it has a lof of rough edges. I might write up a later, detailed guide if I feel like it or if there is demand.

Disclaimer:
- I wouldn't trade with these results myself - if I did I would not public this.
- I also did not attempt to assess the performance of a trading strategy with these results - though I might, with more data in the future

### The process

Of course, the T+3 caused foreseeable challenges, some of which I learned the hard way. I first experimented with only predicting the price of the day after. The classification result was decent. However, this approach made the assumption that the previous close price would equal the next day's open price, which is evidently off by a huge margin. The repository is [here](https://github.com/luungoc2005/DataGathererGUI), built with C# and uses Accord.Net for neural network. It was more of a task so I can learn the basics of Machine learning, so the results are horrible.

I noticed also that data for the Vietnam stock market is also hard to get - specifically I could find no data source that had detailed, high-resolution data. So I made the choice to only collect data daily - which is extremely bad. The data also had a lot of seemingly placeholder and unusable variables in it, but thankfully easy to format and import.

For the second attempt, I setup an entire Django+React web app so I can later upload to AWS and see if I can trade with the strategy. This will also allow for automated data gathering - by virtue of the app running on a cloud service. The repository is [here](https://github.com/luungoc2005/stocksman-react). Be warned the app is not optimized - the main bottleneck lies in database querying. However a 1-2 seconds lag for every predict query doesn't seem entirely intolerable enough for me to try and address the issue.

Python had a ton more libraries geared towards science and math, including more robust machine learning libraries. There is Theano, TensorFlow, scikit-learn and more. In the end I chose Scikit-learn for ease of use, because the task doesn't seem to require as much performance. It has a nice wrapper for all Regressors and Classifier classes, so I can worry less about which algorithm to choose and more about the model.

### Choosing the model

The model inputs: For this experiment, I chose the following inputs for my model:
- The Open price, Average price and Close price as well as daily variance (close price - open price)
- Difference between the current Close price and the previous
- The stock's performance indicators: Dividends, EPS (earning per share), Beta
- The day of week (categorical variable)
- Whether if there is a price shock (drop of > 10% from the previous day)
- The 5-day moving average

I should probably also experiment with these later:
- Total trading volume (the high variance and large numbers causes difficulty in scaling), so I'm making do without it. Likely an important measure though.
- Number of search results for the stock's name
- Category of the industry of the stock, and the average price indices of the category.
- Standard deviation (volatility) of the stock.

The output would be the percentage change after T+3 and whether the change is positive (for classification).

For lack of understanding how individual algorithms work, I just picked a bunch of algorithms from Scikit-learn and fit the data to each, then measure the score on a test set of 20% data. The results obtained are as below:

### Results

For classification (classifying whether a stock will have an increased price after T+3):
`Accuracy = 0.61279896574`
This is indeed bad, but it is actually better than a coin flip that the EMH says it should be. As long as the expected earnings are not lower than the expected loss, this might be a somewhat - promising result.

For regression, the score is downright almost unusable:
`Accuracy = 0.0211559133662`

Combining the two results, I can obtain predictions like the following:
![Some predictions]({{ site.url }}/assets/images/predictions-11mar17.png)

### Going ahead
There are a few things I might be able to try:
- Predicting whether a stock will have a price stock on the following day based on today's information.
- Using an additional machine learning layer to try and balance the results from the Classification and Regression results into an expected future price. The current method that I currently employ is shaky though fairly conservative (which is good): `future price = probability * regression result`
- Building a simulator to test performance of trading strategies.

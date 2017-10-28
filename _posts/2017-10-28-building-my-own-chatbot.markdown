---
title:  "Building my own chatbot"
date: 2017-10-28 14:59:15 +7
comments: true
categories:
- python
- nltk
- stanford
- corenlp
---

By recently working on BotBot.AI, I have had my fair share of chance and interest on working on my own chatbot. Turns out, there are 2 kinds of chatbot out there: one that is dumb and another that is dumber. The kind using Recurrent Neural Networks to generate nonsense based on a huge dataset of responses are _dumb_. Think - all they do is generating a random sequence of words that has resemblence of meaning related to the input - but having no understanding of it. They basically bypasses the understanding and processing steps required in conversations. So our next best bets is implementing chatbots that categorizes (or, to be exact, _classifies_) inputs into pre-programmed 'Intents'. The more bootstrapping and data that the bot receives, the seemingly smarter it will get - accounting for more diverse cases.

### Intent Classification

Most functional, assistant-type bots would fall into the latter kind. And the way they classify intents would not be dependent on the structure or grammar of the sentence, but usually comes down to the frequency of words: Basically counting whether certain words appear in a bunch of sentences, then do a regression (Neural Networks/or even Scholastic Gradient Descent - note: _any_ classification algorithm would do - with good performance most of the time for such an easy task). An optimization step would be to put the data through a [Tf-Idf](http://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfTransformer.html#sklearn.feature_extraction.text.TfidfTransformer) transformer, which purpose is - quoted below:

>The goal of using tf-idf instead of the raw frequencies of occurrence of a token in a given document is to scale down the impact of tokens that occur very frequently in a given corpus and that are hence empirically less informative than features that occur in a small fraction of the training corpus.

Basically:
{% highlight python linenos %}
from sklearn.pipeline import Pipeline
from sklearn.linear_model import SGDClassifier
from sklearn.feature_extraction.text import TfidfVectorizer

model = Pipeline([
    ('vectorizer', TfidfVectorizer(
      preprocessor=None,
      lowercase=False)),
    ('classifier', SGDClassifier(loss='log', max_iter=1000)),
])

model.fit(X, y)
{% endhighlight %}

(specifying `log` as the loss function for SGDClassifier so we have actionable _confidence_ values for whether an input falls into an intent)

**Context matching**
This would require the model to go from _stateless_ to _stateful_ - basically, instead of treating each user input as a separate conversation, it would require logging each conversation. So that it can theoretically remembers what the user said 5 sentences earlier. Currently this is a challenge for most models: Most still uses a _linear_ model for context storing, with optional decaying. Which just means, certain contexts would persist for a number of 'turns' before becoming irrelevant. Other than that, the easiest implementation would be:

{% highlight python linenos %}
CONFIDENCE_THRESHOLD = 0.25

if context is not None:
    intents = [
        intent in intents 
        where intent.confidence > CONFIDENCE_THRESHOLD
    ]
    intents = sorted(intents, lambda intent: intent.confidence, 
        reverse=True)  # sort the intents by confidence level

    for intent in intents:
        if context in intent.contexts:
            return intent
    
    return intents[0]
{% endhighlight %}

So that's the easy part

### The hard part

The harder part, then, would be to best normalize the input data so that the limited bootstrap input can account for more use cases. This is one part that truly requires Natural Language Processing.

**Removing stopwords**
Certain words will have a high chance of being irrelevant to whether a sentence belongs to an intent. e.g: `and`, `or`, `is`. Think of it this way: `Buy me a pizza and some drinks` (Intent: BuyFood) vs `I like pizzas` (Intent: ShowingInterest): the word `and` shouldn't be used to indicate that the intent belongs to the former intent of buying food. But the word `and` will have a positive weight anyway because it exists in the former sentence but not the latter.

This will obviously fail in the case where such stopwords is required. An evident example being: In the standard [NLTK stopwords list](https://gist.github.com/sebleier/554280) exists `not`, `t` and such, which would indicate a contradicting intent.

{% highlight python linenos %}
from nltk.corpus import stopwords

print(set(stopwords.words('english')))
{% endhighlight %}

**Lemmatizing**
POS-tagging and lemmatizing words. In laymen's terms: e.g: Trying to understand whether `content` is a noun (meaning: the things that are held or included in something) or adjective (meaning: in a state of peaceful happiness) with respect to the current sentence, then transform it accordingly, to the _stem_ of the word.

This is so that `has`, `had` and `have` would have the same value in the data.

This is not infallable: it will fail where the intent actually requires differentiating between such words. For example, 2 different intents that requires differentiating between plurals: `TurnOff` and `TurnAllOff` - `Turn this light off for me` vs `Turn all the lights off`.

{% highlight python linenos %}
from nltk import wordpunct_tokenize
from nltk import WordNetLemmatizer
from nltk import sent_tokenize
from nltk import pos_tag

TAGS = {
    'N': wn.NOUN,
    'V': wn.VERB,
    'R': wn.ADV,
    'J': wn.ADJ
}

lemmatizer = WordNetLemmatizer()
for sent in sent_tokenize(document):
    for token, tag in pos_tag(wordpunct_tokenize(sent)):
      TAGS.get(tag[0], wn.NOUN)

      yield lemmatizer.lemmatize(token, tag)
{% endhighlight %}

**Entity marking**
Another technique is entity marking - which I will go into details later, but also required. Basically, Entity recognition helps to recognize e.g whether a word is a person's name, which means `Barrack` wouldn't contribute any weight to output an intent.

This will obviously also fail when `Barrack` actually should contribute to a `PresidentInfo` intent.

A lot of bots would abstract away this details for the content writers (the person who do intents/bootstrap user inputs) in favor of easier-to-use experience.

Note - Each of these transformations wouldn't be needed with enough data. However it is usually unsuitable and infeasible for a content writer to think of all scenarios e.g `When was IT released` vs `when IT come out` (broken English, yes). Thus the bot should be continually updated with user inputs.

**Spelling correction**
Specially for chatbots, correct spelling is often required (it can heavily mess up POS tagging - which will in turn mess up entity marking/lemmatizing), but user input can be often messy. `pycharm` is a good library for correcting spelling mistakes, however as always - one needs to take care for mistaking names as actual words. So this process is in fact often skipped on many chatbots.

This is where speech comes in - computer-recognized text from human speech has 100% correct spelling, but the accuracy of this recognition process depends on the speech synthesis algorithm, which - the state of the art still have a lot of hurdles to overcome (noises, contexts etc.)

### Entity recognition:

Entity recognition refers to the act of labeling words in a sentence that are in fact names or attributes that the intent needs. For example, recognizing in `I need to send an email to John whose address is asdf@123.com` - the intent needs to recognize `John` as a name and `asdf@123.com` as an email address.

This is actually _hard_. Fortunately we don't have to do it by hand. We can use pre-built models in Stanford CoreNLP (which uses Conditional Random Fields under the hood) or NLTK Named Entity Recognizer (or _NER_ which uses a Maximum Entropy model). In fact, the models/algorithms used doesn't matter as much as the entity-labeled data used to train such models, which nobody ever releases since it is such tediously hand-crafted valueable data. A very good explanation is presented [here](http://mattshomepage.com/articles/2016/May/23/nltk_nec/).

For normal use cases, we would just need a normal pattern matching entity recognizer (e.g recognizing email addresses and URLs), products from a hand crafted list of products etc., or POS-pattern matching. We can _theoretically_ create entities the way NLTK does, however it is usually infeasible for a consumer of the chatbot service to build the required dataset sufficient for the chatbot to learn from.

A note on NERs: Commonly, CoreNLP and NLTK NER models are trained from correctly cased datasets, which will mostly fail for chat inputs which are often all lowercased. 2 solutions exists which are expected to be equally good, which are 1. Using a caseless model (also exists in CoreNLP) and 2. Using a True case annotator (CoreNLP) to convert the sentence into correct casing.

On another unrelated note, [recurrent](https://github.com/kvh/recurrent) is a very good python library for parsing natural language dates.

### Conclusion

In this post I outlined some state of the art in making chatbots. It's mostly a level playing field for everyone, with no killer products, but promises much better UX than navigating menus, text fields and buttons. The features I outlined are more than what most services implement on the surface, but then _chatbot as a service_ products needs to balance between ease of use and robustness of features.

Which makes it seems like making _Google Assistant_, _Cortana_ and _Siri_ much easier than designing a chatbot service. Who knew!
---
title:  "Tips on using Sklearn"
date: 2017-03-11 0:45:36 +7
comments: true
categories:
 - python
 - sklearn
 - scikit-learn
---
On my recent endeavors, I did gain some experience with Scikit-learn. Seeing as several of these tips won't be so obvious with reading only the documents, I will write down some so that it may hopefully save people some time, or at least point them in the right direction

### 1. Serialization

While the [official documentations](http://scikit-learn.org/stable/modules/model_persistence.html) does point to the use of Python's own [pickle module](https://docs.python.org/3/library/pickle.html) for saving and loading models, there are certain drawbacks to it:

- The models are serialized and loaded as-is, therefore sensitive to security issues and version changes of both Python and Sklearn. The security concern is rather a warning - these models aren't meant to be published or loaded from another source. If anything, one should just provide the training dataset and the model parameters instead.

- The saved files can be rather large and taking a long time to load for models that requires saving the dataset (e.g K Nearest Neighbors). In my case, my n=9000 dataset made for ~500-700 MB models, which seemed rather bad for scalability considering the raw data in the SQLite DB took like 20 MB.

### Using Joblib

An instant solution for the first problem would be to use [joblib](https://pypi.python.org/pypi/joblib) instead of Pickle. Joblib is more efficient in saving NumPy arrays - otherwise it can be considered to be the same as pickle (meaning it doesn't solve the security or compatibility issues). It also supports built-in compression, so in my case the models' file size was reduced to about 170 MB instead of 700 MB. Still not great, but obviously an all-around better solution.

Basically, just install Joblib by `pip install joblib`, then replace the pickle calls

{% highlight python linenos %}
import pickle

# Saving
pickle.dump(clf, open(cl_file, 'wb'))

# Loading
clf = pickle.load(open(cl_file, 'rb'))
{% endhighlight %}

with

{% highlight python linenos %}
import joblib

# Saving
joblib.dump(clf, cl_file, 3)

# Loading
clf = joblib.load(cl_file)
{% endhighlight %}

Note that we are no longer using Python's open(), instead supplying the file path directly to the functions. Also, the compression level is set to 3, as [joblib documentation recommends](https://pythonhosted.org/joblib/generated/joblib.dump.html). Usually, setting a higher compression level does not bring much gain and storage is cheap so performance is always welcome.


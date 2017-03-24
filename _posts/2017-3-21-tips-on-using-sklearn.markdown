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

### Using sklearn2pmml

[Sklearn2PMML](https://github.com/jpmml/sklearn2pmml) is a tool for saving Sklearn models to [PMML](https://en.wikipedia.org/wiki/Predictive_Model_Markup_Language), which is potentially a good way to avoid the security concerns and compatibility issues. It does require more work, but it seems worth it in the long run.

### 2. Using probability calibration

When using classifiers, even if the classifier does support `predict_proba()`, it is usually a good practice to use [CalibratedClassifierCV](http://scikit-learn.org/stable/modules/generated/sklearn.calibration.CalibratedClassifierCV.html) for a better confidence estimate. If the classifier does not support `predict_proba()`, `CalibratedClassifierCV` can still give decent probabilities. These probabilities can be tested using a loss function e.g [Briefer Score](http://scikit-learn.org/stable/modules/generated/sklearn.metrics.brier_score_loss.html#sklearn.metrics.brier_score_loss). However it seems the estimates aren't entirely dependable either.

The following code is applicable for the classification case where there are 2 labels: 0 and 1 (binary)

{% highlight python linenos %}
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import brier_score_loss
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(inputs_scaled, outputs_cls, test_size=0.2)

# Define your classifier named 'clf', for example using linear_model.LogisticRegression()
...
clf.fit(X_train, y_train)
pcl = CalibratedClassifierCV(base_estimator=clf, method=pcl, cv=3)
pcl_object.fit(X_train, y_train)
pcl_predicted = pcl_object.predict_proba(X_test)[:, 1]

pcl_loss = brier_score_loss(y_test, pcl_predicted, pos_label=1)
print(pcl_loss)

...
pcl_object.predict_proba(sample)
{% endhighlight %}

### 3. Testing all the algorithms

Sklearn is actually very well designed, with an interface wrapper for just about everything, so it is actually easy to build an array of models and test out different parameters, like so:

{% highlight python linenos %}
CLASSIFIERS = [
    neural_network.MLPClassifier(hidden_layer_sizes=(100,), activation='sigmoid', solver='sgd'),
    neural_network.MLPClassifier(hidden_layer_sizes=(120, 80,), activation='relu', solver='adam'),
    neighbors.KNeighborsClassifier(n_neighbors=5)
]

clf_array = []
accuracy_array = []

X_train, X_test, y_train, y_test = get_input_data()

for clf in CLASSIFIERS:
    clf.fit(X_train, y_train)
    accuracy = clf.score(X_test, y_test)

    print('Model Accuracy: ' + str(accuracy))
    clf_array.append(clf)
    accuracy_array.append(accuracy)

# Getting the best model
index_clf, value_clf = max(enumerate(accuracy_array), key=itemgetter(1))
print('Best classification model: ' + str(index_clf) + ' - Accuracy: ' + str(value_clf))
{% endhighlight %}

Of course, this is just for testing purposes, such a brute-force approach should never be used in production. However, it is good for beginners who can test out model efficiency without having to understand the underlying math. I would personally recommend digging into certain models to understand how they work, e.g K-Neighbors and Neural Network are two easy starters.

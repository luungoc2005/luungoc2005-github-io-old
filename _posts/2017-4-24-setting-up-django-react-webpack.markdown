---
title:  "Setting up Django, ReactJS and Webpack 2"
date: 2017-04-24 20:35:00 +7
comments: true
categories:
 - python
 - django
 - reactjs
 - webpack2
---

So basically, the goal of this will be to walk through my recent experience with setting up everything for a website: From starting a project with Django, adding a frontend with ReactJS and Webpack 2, to deploying with Docker. The repository of this 'boilerplate' of sorts is [here](https://github.com/luungoc2005/react-django-boilerplate). Feel free to add comments to show your interest, because without seeing some interest, I have little to no motivation to update the project at all until I need it.

### Prerequisites

This guide is written for Ubuntu 14.04 LTS but can be applied similarly for Windows or Mac OS

So if there is any issues during installation, it will, 90% of the time, be because of a missing package (feel free to comment), or maybe `sudo apt-get update` will be able to solve (some) of the problems.

You will need

1. Either Virtualenv or Anaconda.

Virtualenv can be installed by
`sudo easy_install pip && pip install virtualenv`

you may also need
`sudo apt-get install python-dev build-essential`

Anaconda can be installed by downloading it [here](https://www.continuum.io/downloads). It comes with Python and a host of other packages.

Personally, I prefer Anaconda because it is more fully featured - Virtualenv is merely a part of it. However Virtualenv is a perfectly fine, minimalist substitute.

2. Create a new virtual environment for the app

From here on out, I am going to assume that the applicaiton will be named `testapp` for the sake of simplicity. Creating the virtual environment will depend on the choice you made in the 1st step. For Anaconda, you can jump straight into it by `conda env create --name testapp`

For virtualenv, you will need a directory for it. For example, `virtualenv testapp` will create a folder named `testapp` inside the current working folder.

To activate the virtual environment for installing packages, type
Anaconda: `source activate testapp`
virtualenv: `source testapp/bin/activate`

### Setting up a Django project

After setting up Python and switching to the virtual environment created, you need to start a new Django project. The [official tutorial](https://www.djangoproject.com/start/) for Django is one of the most comprehensive tutorials for anything I have ever used. To sum up, in most cases, you would need to first install django (duh) with pip - installed in the above step:
`pip install Django`

Then, *cd* into the directory you would want to store your project (normally, I would store it in a parent directory of the **virtualenv** directory). Then run the following command
`django-admin startproject mysite`

Where **"mysite"** is the name of the website you would want to create. For further explanations including how to setup a database and templates etc. with Django, again - please refer to the [tutorials](https://docs.djangoproject.com/en/1.11/intro/tutorial01/). It also serves well for troubleshooting any problems you may have.

Note: Since, after all, we aim to make a single-page web application using ReactJs, we likely won't touch the template system much. Instead, communications will be done using AJAX requests.

You may want to consider using development versions of Django with better support for AJAX, or use [Django REST Framework](http://www.django-rest-framework.org/). But that is out of scope for this post. There is one code snippet I find useful as quick shortcut for small apps, though (FYI, Django 1.7 has a proper JsonResponse class as a subclass of HttpResponse):

{% highlight python linenos %}
from django.http import HttpResponse
from json import dumps

def JsonResponse(data):
    return HttpResponse(dumps(data), content_type='application/json')
{% endhighlight %}

### Configuring templates
*to be continued*

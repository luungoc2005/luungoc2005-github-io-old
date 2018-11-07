---
title:  "Cloud GPU services review"
date: 2018-10-23 14:59:00 +7
comments: true
categories:
- machine learning
- gpu
- cloud
- python
- javascript
---

In the past few months I have been trying to find a good cloud GPU provider. My use case is for Kaggle/NLP training, which could differ from others' use cases. Because of this, I put a heavy emphasis on price. Anything that surpases my monthly budget is a immediate no-go.

Given this restriction, I can immediately exclude monthly charged services. I often only use up to 2 continuous weeks/month, and the discount by scale never offsets the added cost. This means that services like [Hetzner](https://www.hetzner.com/?country=us) and [LeaderGPU](https://www.leadergpu.com/) are excluded from this review.

# Free options

These services have special mention thanks to being completely free, even though they have servere restrictions: Google Colab and Kaggle

1. Google Colab

This actually offers amazing value, save for being very unstable at times. It can take a few tries to get a GPU instance without errors, and to keep it running well requires constant activity. The worst part of all is that it limits to 24h of runtime. One can follow [this](https://medium.com/deep-learning-turkey/google-colab-free-gpu-tutorial-e113627b9f5d) guide to essentially have a lot of freedom - you can basically use Google Drive storage for the Colab GPU instance. Again - this often requires a few tries, and it doesn't persist - Every time you get an error, you may have to restart everything. For small, trivial tasks, this is a great offer, but to train a model which may take up to a few days, this is simply unusable.

GPU type: 1x Nvidia K80 (12 GB)

2. Kaggle

I actually considered this a more stable - albeit even more restricted - Google Colab. Both owned by Goggle, Kaggle also offers a free K80 GPU. However Kaggle suffers from only 6 hours of continuous runtime allowance. It is however, in my experience, a lot more stable than Google Colab, has an actively developed container image which contains a ton of packages (but sometimes not updated, which could be crucial especially for Pytorch as bugfixes still come out with every new version). It also benefits from being able to access a ton of read-only datasets either uploaded by yourself (20 GB of storage) or by everyone else.

GPU type: 1x Nvidia K80 (12 GB)

Now with that out of the way - let's move on to the main part

# Paid options

1. Floydhub

Floydhub is probably the most popular and biggest name out there - for good reason: they come with built-in versioning. They provide means for perfect replication of training runs - which can be very important for prototyping. They also provide access to a ton of common ML datasets already uploaded onto their server - but they do limit upload size. However their pricing also leaves a lot to be desired. They are basically AWS price plus overhead, so the price is basically highest there is.

GPU type: 1x Nvidia K80 (12 GB) - Standard

2. Crestle

Crestle is basically paid Google Colab without the runtime/storage limitation. It's not exactly cheap at $0.59/hr, and free 1GB storage is very limited, you'll definitely have to pay for more storage. 

GPU type: 1x Nvidia K80 (12 GB) - Standard

3. Snark.AI

This used to be a very affordable service with decent compromises - but it's dead now :(

4. Paperspace

This is my go-to service nowadays. They provide a wide range of GPU options which is comparable to but cheaper than both Google Compute Engine and AWS. They also provide upgradable storage options (but the storage upgrade is non-reversible). Basically nothing extraordinary - I wouldn't sing praises of them - but affordable and that everything is available. You may have to nudge their customer support for making the GPU option available - sometimes the in-dashboard requests are forgotten.

(to be continued)
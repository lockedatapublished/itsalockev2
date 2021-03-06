---
title: Image Recognition and Object Detection
authors: ellen
date: "2018-02-28T13:22:40+00:00"
categories:
  - R
  - Image recognition
  - Object detection
tags:
  - Locke-Data
---

In this latest blog, I'm responding to a cry for help. Someone got in touch with us recently asking for some advice on image detection algorithms, so let's see what we can do!

They already know what algorithms they want to use, so let's start with those. Hang on no, for the uninitiated, let's start with **what even is an image detection algorithm?**

"An image detection algorithm takes an image, or piece of an image as an input, and outputs what it thinks the image contains. So the output is a class label - "dog", "cat", "house" etc."

### *"But how does it know?" I hear you cry.*

You have to train it! Let's take dogs as an example. If you want to find doggos in photos (and who doesn't) you would need to train an image recognition algorithm with 1000s of images of dogs, and thousands of images not of dogs.

Sadly, the person we're here to help is looking for faces in images of a crowd, not cute pups, so we'll have to be serious again now. Back to those algorithms they've already chosen...

Aggregate channel features
--------------------------

Aggregate channel features (ACF) is a variation of channel features, which extracts features directly as pixel values in extended channels without computing rectangular sums at various locations and scales.

Common channels include the colour channels, such as grey-scale and RBG, but many other channels can be encoded, depending on the difficulty of your problem (e.g. gradient magnitude and gradient histograms).

ACF has advantages, such as a richer representation, accelerated detection speed and more accurate localisation of objects in the images when used in conjunction with a boosting method.

Viola Jones
-----------

Would you believe that this algorithm was invented by two blokes, Paul Viola and Michael Jones? I wonder how they decided who's name went first? Anyway, theirs was the first algorithm of its kind way back in 2001, when I was a mere sprog, and it quickly became the go to algorithm for face detection.

### Question 1: If some faces in the crowd are blurry, do I include them in the dataset?

We think yes. The Viola Jonez algorithm should be able to deal with the minimum resolution of 21\*21. But, you might also want to look into some blur detection algorithms and decide on a threshold that you feel is right for your data.

### Question 2 : Should I label all the heads? 
We think no. The two algorithms should both result in heads in bounding boxes and are all of the same class.

### Question 3 : How do I divide the dataset into training and testing?
80% training, 20% testing. It's arbitrary, but this is a popular value.

Resources
---------

I got most of my basic facts and background from this article. [Image Recognition and Object Detection : Part 1](https://www.learnopencv.com/image-recognition-and-object-detection-part1/)

An interesting Wired article on facial recognition [AI can recognise your face, even if you're pixelated](https://www.wired.com/2016/09/machine-learning-can-identify-pixelated-faces-researchers-show/)

An actual factual piece on detecting a doggo doing zoomies in photos (Identifying blurry objects!) [Blur detection with OpenCV](https://www.pyimagesearch.com/2015/09/07/blur-detection-with-opencv/)

[Viola-Jones wiki - for speedy learning](https://en.wikipedia.org/wiki/Viola–Jones_object_detection_framework)

Happy sorting!

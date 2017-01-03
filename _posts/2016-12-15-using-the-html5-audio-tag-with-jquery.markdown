---
title:  "Using the HTML5 audio tag with jQuery and Javascript"
date: 2016-12-15 16:16:38 +7
categories:
 - tutorials
 - jquery
 - html5
---
### Description
To create a HTML5 web player using jQuery and audio tag. In fact, using jQuery is completely optional. It just ensures compatibility for different browsers and simplifies the javascript syntax. This article assumes basic knowledge of HTML and jQuery/javascript.

### Background
Due to my lack of project updates (because I am working on one, but it won't be finished for a while), I will try updating my blog by writing some tutorials every now and then. This is a problem that came up while I was making the [Spotify Explorer app]({{ site.url }}/projects/SpotifyExplorer), which you can check out with the link.

### Walkthrough
**Step 1:** Preparing the HTML file

You would start out with a HTML page, below is the one I usually use. You can either use jQuery on Google CDN or download it and refer locally.

{% highlight html linenos %}
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Your very own web MP3 player!</title>
</head>
<body>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
</body>
</html>
{% endhighlight %}

You then add the HTML5-only `<audio>` tag inside your HTML's `<body>`

{% highlight html linenos %}
<audio id="player">Your browser does not support HTML5 audio</audio>
{% endhighlight %}

Note that the content inside the `<audio></audio>` tag would be the content displayed when the user's browser does not support the audio tag. As for which browser supports HTML5, you can find by [this handy link](http://caniuse.com/#feat=audio)

Here the id is set as `"player"`. We would later use this in the jQuery code to reference the tag by the css selector `#player`.

Finally, a `<script></script>` tag should be added *after* the jQuery reference for your javascript code. This will be covered in the next section.

**Step 2:** The javascript for playing audio

As we previously named the id of the `<audio></audio>` tag `"player"`, referencing it should be easy - by using the `#player` selector. Another alternative is by setting the class of the tag and use the class selector instead - this is recommended in case you have multiple audio tags on the page, but either case should work just fine. Because jQuery does not have a wrapper for the `play()` method of the audio tag, we have to trigger the DOM method by using

{% highlight javascript linenos %}
player.trigger("play");
player.trigger("pause");
player.trigger("stop");
//not to be confused with jQuery animation function "stop()"
{% endhighlight %}

We can also switch tracks programmatically by setting the `src` attribute of the audio tag:

{% highlight javascript linenos %}
player.attr("src", uri);
//where `uri` would be the link to the audio file
- e.g "http://techslides.com/demos/samples/sample.mp3"
{% endhighlight %}

We can now implement a simple playlist for our mp3 player by having the following code inside out HTML `<body>`:

{% highlight html linenos %}
<ui id="player-list">
    <li class="player-uri" data-src="http://techslides.com/demos/samples/sample.mp3">Sample audio 1</li>
    <li class="player-uri" data-src="">Sample audio 2</li>
</ui>
{% endhighlight %}

This will be sufficient to test our audio player. We can add the code to programmatically expand this play list later. For now, put this javascript code into the `<script></script>` tag to see if the audio tag is working as intended:

{% highlight javascript linenos %}
function onListItemClick(element) {
    $("#player").attr("src", $(element).data("src"));
    $("#player").trigger("load");
    $("#player").trigger("play");
}

$document.ready(function ()
{
    $(".player-uri").on("click", function ()
    {
        onListItemClick(this);
    });
});
{% endhighlight %}

Here we are getting the list item's attribute `data-src`, but jQuery's `data()` method provides a more abstract and standards-compliant alternative to `attr("data-src")`. The `load()` method call is optional, it only pre-loads the audio fully, but calling `play()` directly is also fine - the audio file will buffer as it plays in this case.



*Coming soon*

---
title:  "The Shazam Adventure"
date: 2017-01-16 14:37:51 +7
comments: true
categories:
 - tutorials
 - dotnet
 - naudio
---
### Introduction
Shazam (or perhaps SoundHound) felt like magic when I first knew about it. I know a lot of people probably also felt that way. So imagine my joy and curiosity when I stumbled upon articles upon articles of how to recreate it. There are many creative uses for audio fingerprinting that is not limited just to identifying music. For the ideas that I have in mind though, I have to first hack together a Shazam replica to make sure what I understand about it is correct.

From quick googling, it seems NAudio is the go-to framework for anything audio in .Net. While I do intend to reinvent the wheel for audio fingerprinting, I still have to read my own audio files for a start - and I don't intend to reinvent that. Armed with a greatly detailed, step-by-step explanation of the [Java implementation](http://royvanrijn.com/blog/2010/06/creating-shazam-in-java/). Instead of repeating that great blog post, I would only mention the differences for .Net in this post. In any case, I dove in head-first, not knowing that the resulting endeavor would haunt me for the next two whole days...

I can quickly reveal the conclusion though: ultimately, I went for the bare-minimumly sufficient approach, making everything slow to a crawl, for the purpose of making this work. It worked. Of course I could *now* try harder to follow the strict-NAudio way to make things faster, but unfortunately my attention span and patience with NAudio is limited. The journey that made me fall so low would probably prove more of a good read.

### NAudio quirks #1: Reading a MP3 file
As expected for everything .Net, NAudio utterly lacks documentation. However I quickly found that NAudio has 2 classes for quickly reading a MP3 file format:
- The `AudioFileReader` class - which returns a wave stream of abitrary format (depending on the file of course).
- The `Mp3FileReader` class - which always returns a stream of Pcm 16-bit wave stream.

Naturally I went for the `AudioFileReader` class first, only to stumble upon various other quirks of NAudio's `WaveBuffer` and file encoding (Ieee instead of Pcm). [WaveBuffer](https://github.com/naudio/NAudio/blob/master/NAudio/Wave/WaveOutputs/WaveBuffer.cs) was particularly interesting enough. It is somewhat of a hack to enable quickly read a byte array as a float array (by using the [FieldOffset](https://msdn.microsoft.com/en-us/library/system.runtime.interopservices.fieldoffsetattribute(v=vs.110).aspx) attribute to make arrays of various types point to the same address). Since I first thought NAudio was quite widely used, surely it must be good and completed? As I merily used the `FloatBufferCount` property, I realized it would always evaluate to 0. A quick check through the source code revealed that `numberOfBytes` is never set to the byte array length. Oops.

{% highlight csharp linenos %}
        public void BindTo(byte[] bufferToBoundTo)
        {
            /* WaveBuffer assumes the caller knows what they are doing. We will let this pass
             * if ( (bufferToBoundTo.Length % 4) != 0 )
            {
                throw new ArgumentException("The byte buffer to bound must be 4 bytes aligned");
            }*/
            byteBuffer = bufferToBoundTo;
            numberOfBytes = 0;
        }
{% endhighlight %}
- *yes, it would seem I do*

Nevertheless, this class serves its purpose as long as I get the length calculations right. In a moment of frustration I even swapped it out for `Buffer.BlockCopy()`, but then again tested and found this class working perfectly. Which is nice, because it's almost as fast as using pointers.

NAudio also offers `ToSampleProvider()` and `ToMono()` extension methods (and various conversion classes, for that matter). However those also quickly fail my purpose. Please, just do one thing with your methods, and do not change my WaveFormat for whatever reasons.

In the end, after wasting a ton of time with AudioFileReader class shenanigans, I went with Mp3FileReader class, which served a Pcm 16-bit (e.g short) stream. Combining it into a mono stream was a matter of averaging each pair of samples, basically:

{% highlight csharp linenos %}
    var buffer = new byte[65536];
    var destBuffer = new byte[32768]; // half of source buffer
    var wrapper = new WaveBuffer(buffer);
    var destWrapper = new WaveBuffer(destBuffer);
    var count = 0;
    using (var reader = new Mp3FileReader(fileName))
    {
        System.Diagnostics.Debug.WriteLine($"Analyzing {fileName} - {reader.WaveFormat.ToString()}");

        while ((length = reader.Read(buffer, 0, buffer.Length)) > 0)
        {
            for (int i = 0; i < length / 2; i += 2)
            {
                double outSample = wrapper.ShortBuffer[i] * 0.5 + wrapper.ShortBuffer[i + 1] * 0.5;
                outSample = Math.Max(outSample, float.MinValue);
                outSample = Math.Min(outSample, float.MaxValue);
                destWrapper.FloatBuffer[count] = outSample;
                count++;
            }
            memStream.Write(destWrapper.ByteBuffer, 0, length / 2);
        }
        return GetFingerprint(memStream);
    }
{% endhighlight %}

*Coming soon...ish*

---
title:  "My Shazam Adventure"
date: 2017-01-16 14:37:51 +7
comments: true
categories:
 - tutorials
 - dotnet
 - naudio
---
### Introduction

Shazam (or SoundHound) felt like magic when I first knew about it. I know a lot of people probably also felt that way. So imagine my joy and curiosity when I stumbled upon articles upon articles of how to recreate it. There are many creative uses for audio fingerprinting that is not limited just to identifying music. For the ideas that I have in mind though, I have to first hack together a Shazam replica to make sure what I understand about it is correct.

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
*yes, it would seem I do*

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

### NAudio quirks #2: The fast fourier transform

NAudio readily provides the FFT functions `NAudio.Dsp.FastFourierTransform.FFT(bool forward, int m, NAudio.Dsp.Complex[] data)`, although one would have to browze through the source code to understand what parameter m means : `int m = (int)Math.Log(windowLength, 2.0);`. Then I can quickly generate a spectrum image from that data.
Turns out, again, things aren't so straightforward, NAudio's FFT uses a custom complex type with floats, which has X & Y properties for the real and imaginary parts, without any properties or constructor (gee, would it hurt you to...?). I started making a custom `CalculateMagnitude` function for it (which was basically Math.Sqrt(X x X + Y x Y)).

However my spectrum image was still blank. Turns out, NAudio also [scales the FFT result by 1/n](https://www.codeproject.com/Articles/1095473/Comparison-of-FFT-implementations-for-NET). Not wanting to waste more time on these shenanigans, I decided to just quickly threw in the trustworthy Accord.Net FFT - which also uses the native System.Numerics Complex type and has no scaling. My DrawSpectrum function finally could return a colorful image - same one as in the Java article.

Another note: although there was no mention in Roy van Rijn's Java article - a window function should be applied to the signal before transforming (it is not required, but the signal may be screwed up sometimes without). I personally used Accord's Hamming function, although NAudio also provides several in the `NAudio.Dsp.FastFourierTransform` namespace.

{% highlight csharp linenos %}
private void DrawSpectrum(Complex[][] spectrumData, string fileName)
{
    if (spectrumData == null || !spectrumData.Any()) return;
    var lengthY = 2;
    var lengthX = 2;
    var newBitmap = new Bitmap(
        lengthX * spectrumData[0].Length / 2,
        lengthY * spectrumData.Length,
        System.Drawing.Imaging.PixelFormat.Format24bppRgb);
    using (var g = Graphics.FromImage(newBitmap))
    {
        g.CompositingQuality = System.Drawing.Drawing2D.CompositingQuality.HighQuality;
        g.CompositingMode = System.Drawing.Drawing2D.CompositingMode.SourceCopy;
        g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;

        //g.Clear(Color.Green);
        for (int y = 0; y < SpectrumData.Length; y++)
        {
            if (SpectrumData[y] != null && SpectrumData[y].Any())
            {
                for (int x = 0; x < SpectrumData[y].Length / 2; x++)
                {
                    var abs = SpectrumData[y][x].Magnitude;
                    var mag = Math.Log(SpectrumData[y][x].Magnitude + 1);
                    g.FillRectangle(new SolidBrush(
                            Color.FromArgb(0, Math.Min((int)mag * 10, 255), Math.Min((int)mag * 20, 255))),
                        x * lengthX, y * lengthY, 1, lengthY);
                }
            }
        }
    }
    newBitmap.Save(fileName, System.Drawing.Imaging.ImageFormat.Png);
    newBitmap.Dispose();
}
{% endhighlight %}

### Fingerprinting from the FFT result

The original article does this by taking the maximum frequencies from the ranges 0 - 40, 40 - 80, 80 - 120 and 120 - 180 Hz. For my own implementation, I added the range 300 Hz. However, this unfortunately does not work for many songs, which I suspect is due to their having different frequency ranges. Basically I just took these ranges as-is, but apparently better ranges would be 0 - 10, 10 - 20, 20 - 40, 40 - 80, 80 - 160 and 160 - 511. I will need to experiment with these ranges also.

An alternative would be to take a # number of peaks from the frequency ranges. For the purpose of making the code work, I am willing to blindly follow the ranges method, I definitely should experiment more on this.

### Lookup and identification results

A basic fingerprint lookup would return multiple results. Personally, I found that most of the time, no scoring is needed as the song with the most matches is often the correct result. However, in case of ties, I did implement basic timestamp-based scoring.

For storage, because my own purpose is not to implement a fully-fledged identification system, but just as a proof-of-concept that audio fingerprinting can work, for other purposes. Hence I simply saved the data in Json using everyone's beloved Newtonsoft Json.NET. Each song, fingerprinted, would result in a ~80Kb Json, and my whole music library of almost 2000 songs was stored in a ~150MB lookup database.

After running the application through my own songs library, I can see this working for over 95% of the songs (played on laptop speakers and recorded through the laptop mic). For the remaining 5%, a lot of experimenting was done with the fuzz factor (in the Java article) and ranges to no avail. As mentioned - I can experiment with a different method of getting the important frequencies for fingerprinting, or forego the tried method of using the FFT altogether - perhaps by using [this algorithm](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.607.97&rep=rep1&type=pdf) instead.

Results from my own implementation below, after listening to the sample for 5 seconds:

```
0: Match Adventure Of A Lifetime.mp3 19 times - Score: 905
1: Match Hotel Room Service.mp3 6 times - Score: 1464
2: Match Gone.mp3 4 times - Score: 3204
3: Match Thả Vào Mưa.mp3 4 times - Score: 2
4: Match 679.mp3 3 times - Score: 547
5: Match Live Like You Were Dying.mp3 3 times - Score: 2578
6: Match Drops Of Jupiter (Tell Me).mp3 3 times - Score: 1233
7: Match God Gave Me You.mp3 3 times - Score: 286
8: Match Intuition.mp3 3 times - Score: 1250
9: Match Love Game.mp3 2 times - Score: 617

Best match: Adventure Of A Lifetime.mp3
```

### Looking forward

I just now added the following items to my to-do list for the holidays to come:

* Testing a different fingerprinting method (perhaps non FFT-based) for better accuracy
* Re-implement this also in Javascript. Reason: I want to make an Electron app because nothing beats D3.js when it comes to visualization (WPF libraries wouldn't come close). However audio format and processing libraries for Javascript are few and far between (probably due to performance reasons). This will be a giant pain to deal with.
* (Probably) clean up the experimental code a bit and release it if there is any demand.

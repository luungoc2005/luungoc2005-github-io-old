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

### NAudio quirks #2: The fast fourier transform
NAudio readily provides the FFT functions `NAudio.Dsp.FastFourierTransform.FFT(bool forward, int m, NAudio.Dsp.Complex[] data)`, although one would have to browze through the source code to understand what parameter m means : `int m = (int)Math.Log(windowLength, 2.0);`. Then I can quickly generate a spectrum image from that data.
Turns out, again, things aren't so straightforward, NAudio's FFT uses a custom complex type with floats, which has X & Y properties for the real and imaginary parts, without any properties or constructor (gee, would it hurt you to...?). I started making a custom `CalculateMagnitude` function for it (which was basically Math.Sqrt(X*X + Y*Y)). However my spectrum image was still blank. Turns out, NAudio also [scales the FFT result by 1/n](https://www.codeproject.com/Articles/1095473/Comparison-of-FFT-implementations-for-NET). Not wanting to waste more time on these shenanigans, I decided to just quickly threw in the trustworthy Accord.Net FFT - which also uses the native System.Numerics Complex type and has no scaling. My DrawSpectrum function finally could return a colorful image - same one as in the Java article.

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


*Coming soon...ish*

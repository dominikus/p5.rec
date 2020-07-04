# p5.rec 🍿

Library for **easy recording of [p5.js](https://p5js.org) sketches** and **in-browser conversion to MP4**.

P5.rec hooks into the p5.js draw loop to produce buttery-smooth results 🧈🎉 to upload to Youtube, Instagram, Twitter, etc.

# How it works

If you've ever recorded your p5.js sketches with a screen recording tool like quickTime, you might have run into the problem of jerky recordings. If your sketch is too complex, rendering performance drops and frames are missing, since your screen recording tool doesn't know about what it's recording.

p5.rec solves this problem similar to [CCapture](https://github.com/spite/ccapture.js/). It hooks into the p5.js draw() loop. Once the drawing of a single frame is complete, that frame is stored and the next one is rendered. Usually this looks a bit broken in the browser, but the resulting video is guaranteed to contain every single frame in perfect quality.

# Getting started

Import p5.rec from npm to your ```index.html``` *after* importing p5.js:
```html
  <head>
  ...
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.0.0/p5.js"></script>
  <script type="module" src="https://unpkg.com/p5.rec"></script>
  ...
```

Launch with ```startRecording(options)``` (global mode):
```javascript
  startRecording();
```

and stop your recording with
```javascript
  stopRecording();
```

# API

**startRecording( options ):**
Starts the recording. Don't worry if the p5.js frame starts to look choppy, that's just so that p5.rec can do it's magic 🧙🏼‍♀️. *Options* is optional (just like each of its attributes) and gives you more control over the result:
```javascript
  startRecording({
    preset: "slow",
      // H264 preset. One of [ "ultrafast",
      //                       "superfast",
      //                       "veryfast",
      //                       "faster",
      //                       "fast",
      //                       "medium",
      //                       "slow",
      //                       "slower",
      //                       "veryslow"]
      // See https://trac.ffmpeg.org/wiki/Encode/H.264
    crf: 18,
      // crf (Constant Rate Factor) defines video quality and
      // goes from 0 (maximum quality/size) to 51 (worst quality possible)
      // See https://trac.ffmpeg.org/wiki/Encode/H.264#crf
    onProgress: (progress) => console.log(progress),
      // callback for the encoding progress. *progress* is a float from 0 to 1.
    onFinish: (videoBuffer) => {},
      // callback for the resulting Uint8array. By default, p5.rec shows an overlay for checking and downloading the result.
  });
```

**stopRecording():**
Stops the recording and starts the transcoding. When starting transcoding, p5.rec has to download **@ffmpeg/core** (around 25MB) which takes a while. Once you see 'starting transcoding' on the console the actual transcoding (and callbacks to `onProgress`) starts.

When no specific callback is provided for ```onFinish``` p5.rec opens an overlay with the result. In Chrome, you can use the 'Download' feature (bottom right) to download the result:

![How to download from the overlay](overlay.jpg)

# Limitations

p5.rec at the moment only supports [p5's global mode](https://github.com/processing/p5.js/wiki/Global-and-instance-mode). I'm working on getting it running in instance mode as well ([See this issue](https://github.com/dominikus/p5.rec/issues/1)).

Also in general, p5.rec unfortunately takes a while to do its job. So just be patient :)
![https://giphy.com/gifs/collin-3o7TKU1Lzv3AURPVN6](dog-computer.gif)


# Examples

Check out the examples from ```/examples``` for ways to use p5.rec locally.

# Alternatives
You might also want to use:
* [CCapture](https://github.com/spite/ccapture.js/) hooks into `requestAnimationFrame` to arrive at a similarly smooth result and let's you export webm and gif among others.
* [p5js-gif-recoder](https://github.com/datramt/p5js-gif-recorder) uses CCapture to export gifs directly from p5. 
* [p5.createLoop](https://github.com/mrchantey/p5.createLoop) creates loops and exports them as gifs from p5.

# Relies on
p5.rec is using [@ffmpeg/ffmpeg](https://www.npmjs.com/package/@ffmpeg/ffmpeg) for doing the transcoding.
import { createFFmpeg } from '@ffmpeg/ffmpeg';

function initP5Recorder() {
  let _isRecording = false;
  let _config = {};

  let _status = "";

  p5.prototype.startRecording = function () {
    _isRecording = true;

    _config = {
      width: this.width,
      height: this.height,
      pixelDensity: this._pixelDensity,
      frameRate: this._targetFrameRate,
    };

    console.log(_config);

    const ffmpeg = createFFmpeg({
      log: true,
      progress: p => console.log(p)
    });
    
    /*var worker = new Worker("ffmpeg-worker-mp4.js");

    worker.onmessage = function (e) {
      var msg = e.data;
      switch (msg.type) {
        case "ready":
          worker.postMessage({ type: "run", arguments: ["-version"] });
          break;
        case "stdout":
          _status += msg.data + "\n";
          console.log(_status);
          break;
        case "stderr":
          _status += msg.data + "\n";
          break;
        case "exit":
          console.log("Process exited with code " + msg.data);
          worker.terminate();
          break;
        case "done":
          console.log(msg);

          const result = msg.data[0];

          var blob = new Blob([result.data], {
            type: 'video/mp4'
          });

          break;
      }
    };*/

    
    //const stream = this._renderer.drawingContext.captureStream(0);
    const stream = document.querySelector('canvas').captureStream(0);

    // hack from: https://stackoverflow.com/questions/44392027/webrtc-convert-webm-to-mp4-with-ffmpeg-js
    //var options = {mimeType: 'video/webm;codecs=h264'};
    /*var options = {mimeType: 'video/webm;codecs=vp9',
  videoBitsPerSecond: 50000000};*/

    var mediaRecorder = new MediaRecorder(stream);
    let recordedBlobs = [];
    mediaRecorder.onstop = async () => {
      const resu = new Uint8Array(await (new Blob(recordedBlobs)).arrayBuffer());
      console.log(resu);
      // transcode(resu);
    };
    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        console.log(event);
        console.log(event.data);
        recordedBlobs.push(event.data);
      }
    }
    mediaRecorder.start(); // collect 100ms of data
    // mediaRecorder.stop();

    const transcode = async (webcamData) => {
      const name = 'record.webm';
      console.log('Loading ffmpeg-core.js');
      await ffmpeg.load();
      console.log('Start transcoding');
      await ffmpeg.write(name, webcamData);
      await ffmpeg.transcode(name,  'output.mp4');
      console.log('Complete transcoding');
      const data = ffmpeg.read('output.mp4');

      const can2 = document.createElement('video');
      can2.width = _config.width;
      can2.height = _config.height;
      can2.loop = true;
      var videoURL = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4'}));
      document.querySelector('body').appendChild(can2);
      can2.src = videoURL;
      can2.play();

    }


    
    function handleStop(a){
      console.log(a);
      console.log('done');
      var blob = new Blob(recordedBlobs, {type: 'video/webm'});
      
      // download
      /*const ab = document.createElement('a');
      document.body.appendChild(ab);
      const url = window.URL.createObjectURL(blob);
      ab.href = url;
      ab.download = 'lol.webm';
      ab.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(ab);
      }, 0)*/

      const can2 = document.createElement('video');
      can2.width = _config.width;
      can2.height = _config.height;
      can2.loop = true;
      var videoURL = URL.createObjectURL(blob);
      document.querySelector('body').appendChild(can2);
    can2.src = videoURL;
    can2.play();
    }

    console.log(this._renderer);

    // let pixels = new Uint8Array(_config.width * _config.height * Math.pow(_config.pixelDensity, 2));

    // disable p5.js draw loop:
    const _internalDraw = this._draw;

    let counter = 0;

    this._draw = () => {
      _internalDraw();

      // store frame
      /*const ctx = this._renderer.drawingContext;
      pixels = ctx.getImageData(0, 0, _config.width * _config.pixelDensity, _config.height * _config.pixelDensity);
      pixels = pixels.data;*/

      // TODO: implement better frame-by-frame recording: https://stackoverflow.com/questions/58907270/record-at-constant-fps-with-canvascapturemediastream-even-on-slow-computers/58969196#58969196
      stream.getVideoTracks()[0].requestFrame();

      // this.redraw();
      counter++;
      if(counter < 10){
        this._requestAnimId = window.requestAnimationFrame(this._draw);
      } else {
       mediaRecorder.stop();
      }
    }

    this.noLoop();

  };

  // p5.prototype.registerMethod("post", storeFrame);
}

initP5Recorder();
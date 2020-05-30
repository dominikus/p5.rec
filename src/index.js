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
      framerate: this._targetFrameRate,
    };

    console.log(_config);

    const ffmpeg = createFFmpeg({
      corePath: "../node_modules/@ffmpeg/core/ffmpeg-core.js",
      log: true,
      progress: p => console.log(p)
    });
       

    const recordedBlobs = [];

    const transcode = async (webcamData) => {
      const name = 'record.webm';
      console.log('Loading ffmpeg-core.js');
      await ffmpeg.load();
      console.log('Start transcoding');
      await ffmpeg.write(name, webcamData);
      await ffmpeg.transcode(name,  'output.mp4', `-framerate ${_config.framerate} -vf scale=${_config.width}:${_config.height}`);
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

    let pixels = new Uint8Array(_config.width * _config.height * Math.pow(_config.pixelDensity, 2));

    // disable p5.js draw loop:
    const _internalDraw = this._draw;

    let counter = 0;

    this._draw = () => {
      _internalDraw();

      // store frame
      const ctx = this._renderer.drawingContext;
      /*pixels = ctx.getImageData(0, 0, _config.width * _config.pixelDensity, _config.height * _config.pixelDensity);
      pixels = pixels.data;*/

      document.querySelector('canvas').toBlob(async (blob) => {
        // TODO: store directly in virtual filesystem instead of creating array?
        recordedBlobs.push(blob);

        counter++;
        if(counter < 50){
          this._requestAnimId = window.requestAnimationFrame(this._draw);
        } else {
          const resu = new Uint8Array(await (new Blob(recordedBlobs)).arrayBuffer());
          transcode(resu);
        }

      });
    }

    this.noLoop();

  };

  // p5.prototype.registerMethod("post", storeFrame);
}

initP5Recorder();
import { createFFmpeg } from '@ffmpeg/ffmpeg';

function initP5Recorder() {
  let _isRecording = false;
  let _config = {};
  let _p5RecorderInitialized = false;

  let _status = "";

  let recordedBlobs = [];

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

  // set up ffmpeg:
  const ffmpeg = createFFmpeg({
    corePath: "/node_modules/@ffmpeg/core/ffmpeg-core.js",
    log: true,
    logger: p => {console.log('logger:'); console.log(p)},
    progress: p => console.log(p)
  });

  p5.prototype.startRecording = function() {

    if(!_p5RecorderInitialized){
      // extend p5.js draw loop:
      const _internalDraw = this._draw;

      // stop regular drawing loop
      this.noLoop();

      this._draw = async () => {
        _internalDraw();

        if(_isRecording){
          // store frame
          document.querySelector('canvas').toBlob(async (blob) => {
            // TODO: store directly in virtual filesystem instead of creating array?
            recordedBlobs.push(blob);

            this._requestAnimId = window.requestAnimationFrame(this._draw);
          });
        } else {
          // check if we had a recording going before:
          if(recordedBlobs.length > 0){
            const resu = new Uint8Array(await (new Blob(recordedBlobs)).arrayBuffer());
            await transcode(resu);

            recordedBlobs = [];

            // regular redraw:
            this._requestAnimId = window.requestAnimationFrame(this._draw);

          } else {
            // regular redraw:
            this._requestAnimId = window.requestAnimationFrame(this._draw);
          }
        }
      }

      this._draw();

      _p5RecorderInitialized = true;
    }

    _isRecording = true;

    _config = {
      width: this.width,
      height: this.height,
      pixelDensity: this._pixelDensity,
      framerate: this._targetFrameRate,
    };

    console.log(_config);
  };

  p5.prototype.stopRecording = function() {
    _isRecording = false;
  }

}

initP5Recorder();
import {init, transcode} from './encoder-ffmpeg.js';

const H264_PRESETS = [
  'ultrafast',
  'superfast',
  'veryfast',
  'faster',
  'fast',
  'medium',
  'slow',
  'slower',
  'veryslow'
];

function initP5Recorder() {
  let _isRecording = false;
  let _config = {};
  let _p5RecorderInitialized = false;

  let _duration = 0;

  let recordedBlobs = [];

  // set up encoder:
  init();

  p5.prototype.startRecording = function(options = {}) {

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
            _config.totalFrames = recordedBlobs.length;

            console.log(`got ${_config.totalFrames} frames`);
            const resu = new Uint8Array(await (new Blob(recordedBlobs)).arrayBuffer());
            await transcode(resu, _config);

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

    // parse options:
    let { preset, onProgress, onEnd } = options;
    if(!preset || !H264_PRESETS.includes(preset)){
      preset = 'slow';
    }
    if(!onProgress){
      onProgress = p => console.log(p);
    }

    _config = {
      width: this.width,
      height: this.height,
      pixelDensity: this._pixelDensity,
      framerate: this._targetFrameRate,
      preset,
      onProgress,
      onEnd
    };

    console.log(_config);
  };

  p5.prototype.stopRecording = function() {
    _isRecording = false;
  }

}

initP5Recorder();
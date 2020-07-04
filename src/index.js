import { init, transcode } from "./encoder-ffmpeg.js";
import videoOverlay from "./video-overlay.js";

const H264_PRESETS = [
  "ultrafast",
  "superfast",
  "veryfast",
  "faster",
  "fast",
  "medium",
  "slow",
  "slower",
  "veryslow",
];

function initP5Rec() {
  let _isRecording = false;
  let _isTransferring = false;
  let _config = {};
  let _p5RecInitialized = false;

  let recordedBlobs = [];

  p5.prototype.startRecording = function (options = {}) {
    // stop regular drawing loop
    this.noLoop();

    if (!_p5RecInitialized) {
      // set up encoder:
      init(options.standalone);

      // extend p5.js draw loop:
      const _internalDraw = this._draw;

      this._draw = async () => {
        _internalDraw();

        if (_isRecording) {
          // store frame
          if (this.canvas) {
            this.canvas.toBlob(async (blob) => {
              // TODO: store directly in virtual filesystem instead of creating array?
              recordedBlobs.push(blob);

              this._requestAnimId = window.requestAnimationFrame(this._draw);
            });
          } else {
            // couldn't find p5 canvas
            this._requestAnimId = window.requestAnimationFrame(this._draw);
          }
        } else {
          // check if we had a recording going before:
          if (!_isTransferring && recordedBlobs.length > 0) {
            _isTransferring = true;
            _config.totalFrames = recordedBlobs.length;

            console.log(`got ${_config.totalFrames} frames`);
            const resu = new Uint8Array(
              await new Blob(recordedBlobs).arrayBuffer()
            );
            recordedBlobs = [];
            _isTransferring = false;

            await transcode(resu, _config);

            // regular redraw:
            this._requestAnimId = window.requestAnimationFrame(this._draw);
          } else {
            // regular redraw:
            this._requestAnimId = window.requestAnimationFrame(this._draw);
          }
        }
      };

      this._draw();

      _p5RecInitialized = true;
    }

    _isRecording = true;

    // parse options:
    // H264 specific options:
    let { preset, crf, onProgress, onFinish } = options;
    if (!preset || !H264_PRESETS.includes(preset)) {
      preset = "slow";
    }
    // crf (Constant Rate Factor) defines video quality and
    // goes from 0 (maximum quality/size) to 51 (worst quality possible)
    // rf. https://trac.ffmpeg.org/wiki/Encode/H.264#crf
    if (typeof crf === "undefined" || isNaN(crf) || crf < 0 || crf > 51) {
      crf = 18;
    }
    // general options:
    if (!onProgress) {
      onProgress = (p) => console.log(p);
    }
    if (!onFinish) {
      onFinish = (videoBuffer) => {
        videoOverlay(videoBuffer, _config);
      };
    }

    _config = {
      width: this.width,
      height: this.height,
      pixelDensity: this._pixelDensity,
      framerate: this._targetFrameRate,
      crf,
      preset,
      onProgress,
      onFinish,
    };

    console.log(_config);
  };

  p5.prototype.stopRecording = function () {
    _isRecording = false;
  };
}

initP5Rec();

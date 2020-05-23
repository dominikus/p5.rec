import ffmpeg from "ffmpeg.js";

export default function () {
  let _isRecording = false;
  let _config = {};

  let _status = "";

  p5.prototype.startRecording = function (config) {
    _isRecording = true;

    _config = Object.assign({
      frameRate: this.getFrameRate(),
    });

    console.log(this);

    console.log(_config);

    var worker = new Worker("ffmpeg-worker-mp4.js");

    worker.onmessage = function (e) {
      var msg = e.data;
      switch (msg.type) {
        case "ready":
          worker.postMessage({ type: "run", arguments: ["-version"] });
          break;
        case "stdout":
          _status += msg.data + "\n";
          break;
        case "stderr":
          _status += msg.data + "\n";
          break;
        case "exit":
          console.log("Process exited with code " + msg.data);
          worker.terminate();
          break;
      }
    };

    noLoop();
  };

  function storeFrame() {
    if (_isRecording) {
      console.log(_status);
      // redraw();
    }
  }

  p5.prototype.registerMethod("post", storeFrame);
}

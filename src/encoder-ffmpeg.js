import { createFFmpeg } from "@ffmpeg/ffmpeg";

let _ffmpeg;
let _config;

export const init = (standalone = false) => {
  // set up ffmpeg:
  let ffmpegOptions = {
    log: false,
    logger: parseProgress,
  };

  if (standalone) {
    ffmpegOptions.corePath = "/node_modules/@ffmpeg/core/ffmpeg-core.js";
  } else {
    ffmpegOptions.corePath =
      "https://unpkg.com/@ffmpeg/core@v0.7.1/ffmpeg-core.js";
  }

  _ffmpeg = createFFmpeg(ffmpegOptions);
};

const parseFpsMessageRE = /frame=\s+(\d+)\s+fps/g;
const parseProgress = (p) => {
  // @ffmpeg can't detect the input duration, so we can't use the 'process' callback :(
  if (p && p.message) {
    let currentFrame;
    while ((currentFrame = parseFpsMessageRE.exec(p.message)) !== null) {
      const progress = +currentFrame[1] / _config.totalFrames;
      if (!isNaN(progress) && _config.onProgress) {
        _config.onProgress(progress);
      }
    }
  }
};

export const transcode = async (imageData, config) => {
  console.log("starting");
  _config = config;

  const inputName = "input.webm";
  const outputName = "output.mp4";

  await _ffmpeg.load();
  await _ffmpeg.write(inputName, imageData);

  const ffmpegParams = `-r ${_config.framerate} -i ${inputName} -s ${_config.width}x${_config.height} -crf ${_config.crf} -preset ${_config.preset} -tune animation -pix_fmt yuv420p ${outputName}`;

  await _ffmpeg.run(ffmpegParams);
  const data = _ffmpeg.read(outputName);

  // clean up:
  await _ffmpeg.remove(inputName);
  await _ffmpeg.remove(outputName);

  const can2 = document.createElement("video");
  can2.width = _config.width;
  can2.height = _config.height;
  can2.loop = true;
  can2.controls = true;
  var videoURL = URL.createObjectURL(
    new Blob([data.buffer], { type: "video/mp4" })
  );
  document.querySelector("body").appendChild(can2);
  can2.src = videoURL;
  can2.play();
};

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
  _config = config;

  const inputName = "input.webm";
  const outputName = "output.mp4";

  console.log("loading ffmpeg");
  await _ffmpeg.load();
  console.log("start transcoding");
  await _ffmpeg.write(inputName, imageData);

  const ffmpegParams = `-r ${_config.framerate} -i ${inputName} -s ${_config.width}x${_config.height} -crf ${_config.crf} -preset ${_config.preset} -tune animation -pix_fmt yuv420p ${outputName}`;

  await _ffmpeg.run(ffmpegParams);
  const data = _ffmpeg.read(outputName);

  // clean up:
  await _ffmpeg.remove(inputName);
  await _ffmpeg.remove(outputName);

  _config.onFinish(data);
};


import { createFFmpeg } from '@ffmpeg/ffmpeg';

let _ffmpeg;
let _config;

export const init = () => {
  // set up ffmpeg:
  _ffmpeg = createFFmpeg({
    corePath: "/node_modules/@ffmpeg/core/ffmpeg-core.js",
    log: false,
    logger: parseProgress,
  });
}

const parseFpsMessageRE = /frame=\s+(\d+)\s+fps/g;
const parseProgress = (p) => {
  // @ffmpeg can't detect the input duration, so we can't use the 'process' callback :(
  if(p && p.message){
    let currentFrame;
    while((currentFrame = parseFpsMessageRE.exec(p.message)) !== null){
      const progress = +currentFrame[1] / _config.totalFrames;
      if(!isNaN(progress) && _config.onProgress){
        _config.onProgress(progress);
      }
    }
  }
}

export const transcode = async (imageData, config) => {
  _config = config;

  const name = 'record.webm';
  await _ffmpeg.load();
  await _ffmpeg.write(name, imageData);
  //const ffmpegParams = `-i ${name} -r ${_config.framerate} -s ${_config.width}x${_config.height} -preset ${_config.preset} -tune animation -pix_fmt yuv420p output.mp4`;
  
  const ffmpegParams = `-r ${_config.framerate} -i ${name} -s ${_config.width}x${_config.height} -preset ${_config.preset} -tune animation -pix_fmt yuv420p output.mp4`;
  
  await _ffmpeg.run(ffmpegParams);
  const data = _ffmpeg.read('output.mp4');

  const can2 = document.createElement('video');
  can2.width = _config.width;
  can2.height = _config.height;
  can2.loop = true;
  can2.controls = true;
  var videoURL = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4'}));
  document.querySelector('body').appendChild(can2);
  can2.src = videoURL;
  can2.play();
}

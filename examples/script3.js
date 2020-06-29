let bgCol = "#333";
let posCol = "#333";
let negCol = "#fff";

const MIN_SIZE = 5;
const MAX_SIZE = 45;
const ROOT_COUNT = 2;

const SCALE = 10;
const MAX_WIDTH = 5;
const MAX_HEIGHT = 11;

const PADDING = 32;

const SHAPE_STEPS = 38;

const RADIUS = 0;

let shapes = [];

function setup() {
  createCanvas(720, 300);

  background(bgCol);
  frameRate(45);

  textAlign(CENTER, CENTER);

  startRecording({ standalone: true });
}

function draw() {
  const myFrameCount = frameCount % 150;

  const bg = color(bgCol);
  bg.setAlpha(255);
  background(bg);

  fill(255);
  textSize(width / 2);
  text(Math.floor(myFrameCount / 10), width / 2, height / 2);
  textSize(20);
  text(myFrameCount, 10, height - 20);

  if (frameCount === 150) {
    stopRecording();
  }
}

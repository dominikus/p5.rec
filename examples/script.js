let bgCol = "#000";
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
  createCanvas(600, 600);

  background(bgCol);
  frameRate(60);

  angleMode(DEGREES);
  strokeCap(ROUND);
}

function draw() {
  const bg = color(bgCol);
  bg.setAlpha(0);
  background(bg);

  translate(width / 2, height / 2);
  rotate(frameCount / 2);
  translate(-width / 2, -height / 2);

  // strokeWeight(0.5);

  noStroke();

  stroke("#fff");
  fill("#000");

  const xStep = (cos(frameCount / 5) + 3) * 5;
  const yStep = (sin(frameCount / 5) + 3) * 5;

  for (let x = -width / 2 + xStep / 2; x < width * 1.2; x += xStep * 3) {
    for (let y = -height / 2 + yStep / 2; y < height * 1.2; y += yStep * 3) {
      push();
      translate(x, y);
      rotate(xStep * 2);
      rect(
        sin(frameCount % 2),
        cos(frameCount % 2),
        5 * (cos(frameCount + x) + 2),
        5 * (cos(frameCount + y) + 2)
      );
      pop();
    }
  }
}


let boxes = [];

function setup() {
  createCanvas(800, 800, WEBGL);
  angleMode(RADIANS);
  
  //comet(0,0,-500);
  
  perspective(PI/3.0, 800/800, 10.0, 100000.0);
  
  generateBoxes();

}

let camera = {
  x: 0,
  y: 0,
  z: 0
};

const BOX_DIM = 1000;

function generateBoxes(){
  for(let size = BOX_DIM; size > 0; size--){
    let box = {
      size,
      rotX: random(PI/2),
      rotY: random(PI/2),
      rotZ: random(PI/2),
      offsetY: -size * random(1,3)
    };
    boxes.push(box);
  }
}

function draw() {
  background("#F5F4F1");
  noStroke();
  //stroke("#ccc");
  //noFill();

  pointLight(255, 255, 255, 500,500, 10000);
  ambientLight(25,25,25);
  specularMaterial(2000);
  //fill('#fff');
  strokeWeight(0);

  orbitControl();

  //stroke('rgb(212, 206, 49)');
  //fill('rgba(200,180,200,0.1)');
  // fill('#E5E4E1');

  translate(camera.x, camera.y, camera.z);
  
  drawComet(-5000,-5000,-20000);
}

function drawComet(x, y, z){
  translate(x,y,z);
  for(let b of boxes){
    rotateX(b.rotX);
    rotateY(b.rotY);
    rotateZ(b.rotZ);
    translate(0, b.offsetY, 0);
    box(b.size);
  }
  resetMatrix();
}

function comet(x, y, z){
  translate(x, y, z);
  for(let size = BOX_DIM; size > 0; size--){
    rotateX(random(PI/2));
    rotateY(random(PI/2));
    rotateZ(random(PI/2));
    translate(0, -size * random(1, 3), 0);
    box(size);
  }
  
  resetMatrix();
}

function drawShape(n, d, rr, z = 1) {
  beginShape();
  for (let i = 0; i < 361; i++) {
    let k = i * d;
    let r = rr * sin(n * k);
    let x = r * cos(k);
    let y = r * sin(k);
    vertex(x, y, 0);
  }
  endShape(CLOSE);
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    camera.y = camera.y + 10;
  } else if (keyCode === DOWN_ARROW) {
    camera.y = camera.y - 10;
  }
  if (keyCode === LEFT_ARROW) {
    camera.x = camera.x + 10;
  } else if (keyCode === RIGHT_ARROW) {
    camera.x = camera.x - 10;
  }

  if (keyCode === 87) {
    // 'w'
    camera.z += 10;
  } else if (keyCode === 83) {
    // 's'
    camera.z -= 10;
  }
}

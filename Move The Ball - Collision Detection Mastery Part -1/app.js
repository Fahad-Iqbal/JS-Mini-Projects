const canvasEl = document.querySelector("canvas");

const canvasContext = canvasEl.getContext("2d");

canvasEl.height = 600;
canvasEl.width = 800;

let xP = 400;
let yP = 300;
let radius = 50;
let speed = 10;

// Arrow Directions Event listeners

let upDir = false;
let downDir = false;
let leftDir = false;
let rightDir = false;

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
// game loop

function runGame() {
  canvasContext.clearRect(0, 0, canvasEl.width, canvasEl.height);
  requestAnimationFrame(runGame);
  arrowInputs();
  drawBall();
}

function arrowInputs() {
  if (upDir && yP - radius > 0) {
    yP = yP - speed;
    canvasContext.strokeStyle = "green";
  } else if (downDir && yP + radius < canvasEl.height) {
    yP = yP + speed;
    canvasContext.strokeStyle = "green";
  }
  if (rightDir && xP + radius < canvasEl.width) {
    xP = xP + speed;
    canvasContext.strokeStyle = "green";
  } else if (leftDir && xP - radius > 0) {
    xP = xP - speed;
    canvasContext.strokeStyle = "green";
  }
  if (
    xP === radius ||
    xP === canvasEl.width - radius ||
    yP === radius ||
    yP === canvasEl.height - radius
  ) {
    canvasContext.strokeStyle = "red";
  }
}

// drawing the ball
function drawBall() {
  canvasContext.fillStyle = "white";
  canvasContext.beginPath();
  canvasContext.arc(xP, yP, 50, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.stroke();
}

// Arrow key functions
function keyDown(e) {
  // ArrowUp 38
  // ArrowDown 40
  // ArrowLeft 37
  // ArrowRight 39
  if (e.keyCode === 38) {
    upDir = true;
  }
  if (e.keyCode === 40) {
    downDir = true;
  }
  if (e.keyCode === 37) {
    leftDir = true;
  }
  if (e.keyCode === 39) {
    rightDir = true;
  }
  console.log(e);
}

function keyUp(e) {
  upDir = false;
  downDir = false;
  leftDir = false;
  rightDir = false;
}

runGame();

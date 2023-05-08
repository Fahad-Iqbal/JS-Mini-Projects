const canvasEl = document.querySelector("canvas");
const canvasContext = canvasEl.getContext("2d");

const FPS = 60;
let radius = 50;
let xP, yP;
let xV, yV;

xP = canvasEl.width / 2;
yP = canvasEl.height / 2;

xV = Math.floor(Math.random() * 401 + 99) / FPS;
yV = Math.floor(Math.random() * 401 + 99) / FPS;

// coin toss situation
if (Math.floor(Math.random() * 2) === 0) {
  xV = -xV;
}

if (Math.floor(Math.random() * 2) === 0) {
  yV = -yV;
}

canvasContext.fillStyle = "orange";
function runGame() {
  canvasContext.clearRect(0, 0, canvasEl.width, canvasEl.height);
  // moving the ball from its current position
  xP += xV;
  yP += yV;

  if (xP >= canvasEl.width - radius || xP <= radius) {
    xV = -xV;
  }
  if (yP >= canvasEl.height - radius || yP <= radius) {
    yV = -yV;
  }

  canvasContext.beginPath();
  canvasContext.arc(xP, yP, radius, 0, Math.PI * 2);
  canvasContext.fill();
}

setInterval(runGame, 1000 / FPS);

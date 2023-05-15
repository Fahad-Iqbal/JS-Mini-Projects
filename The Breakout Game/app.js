// Game Parameters

const PADDLE_WIDTH = 0.1; // as a fraction of the screen width
const PADDLE_SPEED = 0.5; // fraction of screen width per second -> it will cross 50% of the screen in 1s
const BALL_SPEED = 0.45; // fraction of screen height per second
const BALL_SPIN = 0.2; // ball deflection of the paddle 0 == no spin, 1 == high spin
const WALL = 0.02; // wall -ball -paddle as a fraction of the shortest screen dimension

// colors
const COLOR_BG = "black";
const COLOR_WALL = "grey";
const COLOR_PADDLE = "white";
const COLOR_BALL = "white";

// Directions
const DIRECTION = {
  LEFT: 0,
  RIGHT: 1,
  STOP: 2,
};

// Setting up the canvas and context
let canvasEl = document.createElement("canvas");
document.body.appendChild(canvasEl);
const ConX = canvasEl.getContext("2d");

// Dimensions
let width, height, wall;

// initializing the paddle, ball classes
let paddle, ball, touchX; // touch location

// Resize window event
window.addEventListener("resize", setDimensions);

// The Game Loop

function playGame() {
  requestAnimationFrame(playGame);
  drawBackground();
  drawWalls();
  drawPaddle();
}

// drawBackground
function drawBackground() {
  ConX.fillStyle = COLOR_BG;
  ConX.fillRect(0, 0, canvasEl.width, canvasEl.height);
}

function drawPaddle() {
  ConX.fillStyle = COLOR_PADDLE;
  ConX.fillRect(
    paddle.x - paddle.w / 2,
    paddle.y - paddle.h / 2,
    paddle.w,
    paddle.h
  );
}

// drawWalls function
function drawWalls() {
  let halfWall = wall * 0.5;
  ConX.lineWidth = wall;
  ConX.strokeStyle = COLOR_WALL;
  ConX.beginPath();
  ConX.moveTo(halfWall, height);
  ConX.lineTo(halfWall, halfWall);
  ConX.lineTo(width - halfWall, halfWall);
  ConX.lineTo(width - halfWall, height);
  ConX.stroke();
}

// newGame function
function newGame() {
  paddle = new Paddle(PADDLE_WIDTH, wall, PADDLE_SPEED);
}

// setDimensions function
function setDimensions() {
  height = window.innerHeight;
  width = window.innerWidth;
  wall = WALL * (height < width ? height : width);
  canvasEl.width = width;
  canvasEl.height = height;
}

// The Paddle class
class Paddle {
  constructor(paddleWidth, paddleHeight, paddleSpeed) {
    this.w = paddleWidth * width;
    this.h = paddleHeight / 2;
    this.x = canvasEl.width / 2;
    this.y = canvasEl.height - this.h * 3;
    this.speed = paddleSpeed * width;
    this.xV = 0;
  }
}

setDimensions();
newGame();
playGame();

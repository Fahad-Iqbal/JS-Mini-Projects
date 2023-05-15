// Game Parameters

const PADDLE_WIDTH = 0.1; // as a fraction of the screen width
const PADDLE_SPEED = 0.5; // fraction of screen width per second -> it will cross 50% of the screen in 1s
const BALL_SPEED = 0.45; // fraction of screen height per second
const BALL_SPIN = 0.2; // ball deflection of the paddle 0 == no spin, 1 == high spin
const WALL = 0.02; // wall -ball -paddle as a fraction of the shortest screen dimension
const MIN_BOUNCE_ANGLE = 30; // min bounce angle from the horizontal in degrees

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

// Touch Events
canvasEl.addEventListener("touchcancel", touchCancel);
canvasEl.addEventListener("touchend", touchEnd);
canvasEl.addEventListener("touchmove", touchMove, { passive: true });
canvasEl.addEventListener("touchstart", touchStart, { passive: true });

// Arrow key Events
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// Resize window event
window.addEventListener("resize", setDimensions);

// The Game Loop

function playGame() {
  requestAnimationFrame(playGame);
  // update functions
  updatePaddle();
  updateBall();

  // draw functions
  drawBackground();
  drawWalls();
  drawPaddle();
  drawBall();
}

// applyBallSpeed function
function applyBallSpeed(angle) {
  //  keeping the angle between two limits = (30 to 150) degrees
  if (angle < Math.PI / 6) {
    angle = Math.PI / 6;
  } else if (angle > (Math.PI * 5) / 6) {
    angle = (Math.PI * 5) / 6;
  }

  ball.xV = Math.cos(angle) * ball.speed;
  ball.yV = -Math.sin(angle) * ball.speed;
}
// drawBackground
function drawBackground() {
  ConX.fillStyle = COLOR_BG;
  ConX.fillRect(0, 0, canvasEl.width, canvasEl.height);
}

// drawBall function
function drawBall() {
  ConX.fillStyle = COLOR_BALL;
  ConX.fillRect(ball.x - ball.w / 2, ball.y - ball.h / 2, ball.w, ball.h);
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

// Arrow Keys Functions
function keyDown(e) {
  switch (e.keyCode) {
    case 32: // serve the ball
      serveBall();
      break;
    case 37:
      movePaddle(DIRECTION.LEFT);
      break;
    case 39:
      movePaddle(DIRECTION.RIGHT);
      break;
  }
}

function keyUp(e) {
  switch (e.keyCode) {
    case 37:
    case 39:
      movePaddle(DIRECTION.STOP);
      break;
  }
}

// movePaddle function
function movePaddle(direction) {
  switch (direction) {
    case DIRECTION.LEFT:
      paddle.xV = -paddle.speed;
      break;
    case DIRECTION.RIGHT:
      paddle.xV = paddle.speed;
      break;
    case DIRECTION.STOP:
      paddle.xV = 0;
      break;
  }
}

// newGame function
function newGame() {
  paddle = new Paddle(PADDLE_WIDTH, wall, PADDLE_SPEED);
  ball = new Ball(wall, BALL_SPEED);
}

// setDimensions function
function setDimensions() {
  height = window.innerHeight;
  width = window.innerWidth;
  wall = WALL * (height < width ? height : width);
  canvasEl.width = width;
  canvasEl.height = height;
}

// Touch events functions

// function touch(x) {
//   if (!x) {
//     movePaddle(DIRECTION.STOP);
//   } else if (x > paddle.x) {
//     movePaddle(DIRECTION.RIGHT);
//   } else if (x < paddle.x) {
//     movePaddle(DIRECTION.LEFT);
//   }
// }
function touchCancel() {
  touchX = null;
  movePaddle(DIRECTION.STOP);
}
function touchEnd() {
  touchX = null;
  movePaddle(DIRECTION.STOP);
}
function touchMove(e) {
  touchX = e.touches[0].clientX;
}
function touchStart(e) {
  if (serveBall()) {
    return;
  }
  touchX = e.touches[0].clientX;
}

// updateBall function
function updateBall() {
  // move the paddle
  ball.x += (ball.xV / 1000) * 15;
  ball.y += (ball.yV / 1000) * 15;

  //  bouncing the ball off the wall
  if (ball.x < wall + ball.w / 2) {
    ball.x = wall + ball.w / 2;
    ball.xV = -ball.xV;
    // spinBall();
  } else if (ball.x > width - wall - ball.w / 2) {
    ball.x = width - wall - ball.w / 2;
    ball.xV = -ball.xV;
    // spinBall();
  } else if (ball.y < wall + ball.h / 2) {
    ball.y = wall + ball.h / 2;
    ball.yV = -ball.yV;
    // spinBall();
  }

  // bouncing the ball of the paddle
  if (
    ball.y > paddle.y - paddle.h / 2 - ball.h / 2 &&
    ball.y < paddle.y + paddle.h / 2 + ball.h / 2 &&
    ball.x > paddle.x - paddle.w / 2 - ball.w / 2 &&
    ball.x < paddle.x + paddle.w / 2 + ball.w / 2
  ) {
    ball.y = paddle.y - paddle.h / 2 - ball.h / 2;
    ball.yV = -ball.yV;
    // modify the angle based off the ball spin
    // find the current angle

    let angle = Math.atan2(-ball.yV, ball.xV);
    angle += ((Math.random() * Math.PI) / 2 - Math.PI / 4) * BALL_SPIN;
    applyBallSpeed(angle);
  }

  //  ball moves out of the canvas
  if (ball.y > canvasEl.height) {
    outOfBounds();
  }
}

//  updatePaddle function
function updatePaddle() {
  // move the paddle with touch
  if (touchX != null) {
    if (touchX > paddle.x + wall) {
      movePaddle(DIRECTION.RIGHT);
    } else if (touchX < paddle.x - wall) {
      movePaddle(DIRECTION.LEFT);
    } else {
      movePaddle(DIRECTION.STOP);
    }
  }
  //  move the paddle
  let lastPaddleX = paddle.x;
  paddle.x += (paddle.xV / 1000) * 20;

  //  wall collision detection for paddle
  if (paddle.x < wall + paddle.w / 2) {
    paddle.x = wall + paddle.w / 2;
  } else if (paddle.x > width - wall - paddle.w / 2) {
    paddle.x = width - wall - paddle.w / 2;
  }
}

// The Ball class
class Ball {
  constructor(ballSize, ballSpeed) {
    this.w = ballSize;
    this.h = ballSize;
    this.x = paddle.x;
    this.y = paddle.y - paddle.h / 2 - this.h / 2;
    this.speed = ballSpeed * height;
    this.xV = 0;
    this.yV = 0;
  }
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

// serveBall function
function serveBall() {
  // if the ball is already move don't allow serve
  if (ball.yV != 0) {
    return false;
  }

  // random angle, not less than the min bounce angle
  let minBounceAngle = (MIN_BOUNCE_ANGLE / 180) * Math.PI;
  let range = Math.PI - minBounceAngle * 2;
  let angle = Math.random() * range + minBounceAngle;
  applyBallSpeed(angle);
  return true;
}

// outOfBounds function
function outOfBounds() {
  newGame();
}

setDimensions();
newGame();
playGame();

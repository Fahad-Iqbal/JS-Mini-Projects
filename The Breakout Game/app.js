// Game Parameters

const PADDLE_WIDTH = 0.1; // as a fraction of the screen width
const PADDLE_SPEED = 0.5; // fraction of screen width per second -> it will cross 50% of the screen in 1s
const BALL_SPEED = 0.45; // fraction of screen height per second
const BALL_SPIN = 0.2; // ball deflection of the paddle 0 == no spin, 1 == high spin
const WALL = 0.02; // wall -ball -paddle as a fraction of the shortest screen dimension
const MIN_BOUNCE_ANGLE = 30; // min bounce angle from the horizontal in degrees
const BRICK_ROWS = 8; // starting number or brick rows
const BRICK_COLS = 14; // original number of brick cols
const BRICK_GAP = 0.3; // brick gap as a fraction of the wall width
const MARGIN = 4; /* number of empty rows above the bricks = empty space between the top of the bricks and the score board*/
const MAX_LEVEL = 10; // max game level (+2 rows of bricks per level)
const GAME_LIVES = 3;
const KEY_SCORE = "HighScore";
const BALL_SPEED_MAX = 2; // multiple of starting speed
const PUP_CHANCE = 0.1; // probability of a powerup per brick hit (between -> 0 - 1)
const PUP_SPEED = 0.15;
const PUP_BONUS = 50;

// colors
const COLOR_BG = "black";
const COLOR_WALL = "grey";
const COLOR_PADDLE = "white";
const COLOR_BALL = "white";
const COLOR_TEXT = "white";

// Text properties
const TEXT_FONT = "sans-serif";
const TEXT_LEVEL = "Level";
const TEXT_LIVES = "Ball";
const TEXT_SCORE = "Score";
const TEXT_HIGH_SCORE = "BEST";
const TEXT_GAME_OVER = "GAME OVER";
const TEXT_WIN = "YOU WON";

// Directions
const DIRECTION = {
  LEFT: 0,
  RIGHT: 1,
  STOP: 2,
};

const PupType = {
  EXTENSION: { color: "white", symbol: "=" },
  LIFE: { color: "coral", symbol: "+" },
  STICKY: { color: "lightseagreen", symbol: "~" },
  SUPER: { color: "hotpink", symbol: "s" },
};

// Setting up the canvas and context
let canvasEl = document.createElement("canvas");
document.body.appendChild(canvasEl);
const ConX = canvasEl.getContext("2d");

let audBrick = new Audio("sounds/brick.m4a");
let audPaddle = new Audio("sounds/paddle.m4a");
let audPowerup = new Audio("sounds/powerup.m4a");
let audWall = new Audio("sounds/wall.m4a");

// Dimensions
let width, height, wall;

// initializing the paddle, ball classes
let paddle,
  ball,
  bricks = [],
  pups = [];

let gameOver, pupExtension, pupSticky, pupSuper, win;
let level, lives, score, scoreHigh;
let numBricks, textSize, touchX;

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

  setSpeed = (spdMult) => {
    this.speed = Math.max(this.speed, BALL_SPEED * height * spdMult);
  };
}

//  The Brick class
class Brick {
  constructor(left, top, w, h, color, score, spdMult) {
    this.w = w;
    this.h = h;
    this.left = left;
    this.top = top;
    this.bottom = top + h;
    this.right = left + w;
    this.color = color;
    this.score = score;
    this.spdMult = spdMult;

    this.intersect = (ball) => {
      let ballBottom = ball.y + ball.h * 0.5;
      let ballLeft = ball.x - ball.w * 0.5;
      let ballRight = ball.x + ball.w * 0.5;
      let ballTop = ball.y - ball.h * 0.5;

      return (
        this.left < ballRight &&
        ballLeft < this.right &&
        this.bottom > ballTop &&
        this.top < ballBottom
      );
    };
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

// The PowerUp class
class PowerUp {
  constructor(x, y, size, type) {
    this.w = size;
    this.h = size;
    this.x = x;
    this.y = y;
    this.type = type;
    this.yV = PUP_SPEED * height;
  }
}

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

  if (!gameOver) {
    // update functions
    updatePaddle();
    updateBall();
    updateBricks();
    updatePups();
  }

  // draw functions
  drawBackground();
  drawWalls();
  drawPups();
  drawPaddle();
  drawBall();
  drawBricks();
  drawText();
}

// applyBallSpeed function
function applyBallSpeed(angle) {
  ball.xV = Math.cos(angle) * ball.speed;
  ball.yV = -Math.sin(angle) * ball.speed;
}

// createBricks function
function createBricks() {
  // row dimensions
  let minY = wall;
  let maxY = ball.y - ball.h * 3.5;
  let totalSpaceY = maxY - minY;
  let totalRows = MARGIN + BRICK_ROWS + MAX_LEVEL * 2;
  let rowH = (totalSpaceY / totalRows) * 0.9;
  let gap = wall * BRICK_GAP * 0.9;
  let h = rowH - gap;

  // Text Size
  textSize = rowH * MARGIN * 0.45;

  // col dimensions
  let totalSpaceX = width - wall * 2;
  let colW = (totalSpaceX - gap) / BRICK_COLS;
  let w = colW - gap;

  // resetting the bricks array
  bricks = [];
  let cols = BRICK_COLS;
  let rows = BRICK_ROWS + level * 2;
  let color, left, rank, rankHigh, score, spdMult, top;

  numBricks = cols * rows;

  rankHigh = rows / 2 - 1;
  for (let i = 0; i < rows; i++) {
    bricks[i] = [];
    rank = Math.floor(i / 2);
    score = (rankHigh - rank) * 2 + 1;
    color = getBrickColor(rank, rankHigh);

    /*
    red rank = 0
    orange rank = 1
    yellow rank = 2
    green rank = 3
     
    rankHigh = 3
    */
    spdMult = 1 + ((rankHigh - rank) / rankHigh) * (BALL_SPEED_MAX - 1);
    top = wall + (MARGIN + i) * rowH;
    for (let j = 0; j < cols; j++) {
      left = wall + gap + j * colW;
      bricks[i][j] = new Brick(left, top, w, h, color, score, spdMult);
    }
  }
}

// drawBackground
function drawBackground() {
  ConX.fillStyle = COLOR_BG;
  ConX.fillRect(0, 0, canvasEl.width, canvasEl.height);
}

// drawBall function
function drawBall() {
  ConX.fillStyle = pupSuper ? PupType.SUPER.color : COLOR_BALL;
  ConX.fillRect(ball.x - ball.w / 2, ball.y - ball.h / 2, ball.w, ball.h);
}

// drawBricks function
function drawBricks() {
  for (let row of bricks) {
    for (let brick of row) {
      if (brick == null) {
        continue;
      }
      ConX.fillStyle = brick.color;
      ConX.fillRect(brick.left, brick.top, brick.w, brick.h);
    }
  }
}

function drawPaddle() {
  ConX.fillStyle = pupSticky ? PupType.STICKY.color : COLOR_PADDLE;
  ConX.fillRect(
    paddle.x - paddle.w / 2,
    paddle.y - paddle.h / 2,
    paddle.w,
    paddle.h
  );
}

// drawPups function
function drawPups() {
  ConX.lineWidth = wall * 0.4;
  for (let pup of pups) {
    ConX.fillStyle = pup.type.color;
    ConX.strokeStyle = pup.type.color;
    ConX.strokeRect(pup.x - pup.w / 2, pup.y - pup.h / 2, pup.w, pup.h);
    ConX.font = `bold ${pup.h}px ${TEXT_FONT}`;
    ConX.textAlign = "center";
    ConX.fillText(pup.type.symbol, pup.x, pup.y);
  }
}

// drawText function
function drawText() {
  ConX.fillStyle = COLOR_TEXT;

  // Dimensions
  let labelSize = textSize * 0.5;
  let margin = wall * 2;
  let maxWidth = width - margin * 2;
  let maxWidth1 = maxWidth * 0.27; // width of col of text 1;
  let maxWidth2 = maxWidth * 0.2; // width of col of text 2;
  let maxWidth3 = maxWidth * 0.2; // width of col of text 3;
  let maxWidth4 = maxWidth * 0.27; // width of col of text 4;
  let x1 = margin; // position of the col 1
  let x2 = width * 0.4; // position of the col 2
  let x3 = width * 0.6; // position of the col 3
  let x4 = width - margin; // position of the col 4
  let yLabel = wall + labelSize;
  let yValue = yLabel + textSize * 0.9;

  // Drawing Labels
  ConX.font = `${labelSize}px ${TEXT_FONT}`;
  ConX.textAlign = "left";
  ConX.fillText(TEXT_SCORE, x1, yLabel, maxWidth1);
  ConX.textAlign = "center";
  ConX.fillText(TEXT_LIVES, x2, yLabel, maxWidth2);
  ConX.fillText(TEXT_LEVEL, x3, yLabel, maxWidth3);
  ConX.textAlign = "right";
  ConX.fillText(TEXT_HIGH_SCORE, x4, yLabel, maxWidth4);

  // Drawing the values
  ConX.font = `${textSize}px ${TEXT_FONT}`;
  ConX.textAlign = "left";
  ConX.fillText(score, x1, yValue, maxWidth1);
  ConX.textAlign = "center";
  ConX.fillText(`${lives}/${GAME_LIVES}`, x2, yValue, maxWidth2);
  ConX.fillText(level, x3, yValue, maxWidth3);
  ConX.textAlign = "right";
  ConX.fillText(scoreHigh, x4, yValue, maxWidth4);

  if (gameOver) {
    let text = win ? TEXT_WIN : TEXT_GAME_OVER;
    ConX.font = `${textSize * 2}px ${TEXT_FONT}`;
    ConX.textAlign = "center";
    ConX.fillText(text, width / 2, paddle.y - textSize * 2, maxWidth);
  }
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

// getBrickColor function
function getBrickColor(rank, highestRank) {
  //  red = 0, orange = 0.33; yellow = 0.67, green = 1
  let fraction = rank / highestRank;
  let r,
    g,
    b = 0;

  //  red to orange to yellow (increase the green)
  if (fraction <= 0.67) {
    r = 266;
    g = (255 * fraction) / 0.67;
  }

  // yellow to green (reduce the red)
  else {
    r = (255 * (1 - fraction)) / 0.66;
    g = 255;
  }

  return `rgb(${r}, ${g}, ${b})`;
}

// Arrow Keys Functions
function keyDown(e) {
  switch (e.keyCode) {
    case 32: // serve the ball
      serveBall();
      if (gameOver) {
        newGame();
      }
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

// newBall function()
function newBall() {
  // resetting the powerups
  pupExtension = false;
  pupSticky = false;
  pupSuper = false;
  paddle = new Paddle(PADDLE_WIDTH, wall, PADDLE_SPEED);
  ball = new Ball(wall, BALL_SPEED);
}

// newGame function
function newGame() {
  level = 0;
  gameOver = false;
  score = 0;
  win = false;
  lives = GAME_LIVES;

  // getting the highscore from the localStorage
  let scoreStr = localStorage.getItem(KEY_SCORE);
  if (scoreStr == null) {
    scoreHigh = 0;
  } else {
    scoreHigh = parseInt(scoreStr);
  }
  newLevel();
}

// newLevel function
function newLevel() {
  // reset the pups to an empty array
  pups = [];

  touchX = null;
  newBall();
  createBricks();
}

// outOfBounds function
function outOfBounds() {
  lives--;
  if (lives == 0) {
    gameOver = true;
  }
  newBall();
}

// serveBall function
function serveBall() {
  // if the ball is already move don't allow serve
  if (ball.yV != 0) {
    return false;
  }

  // random angle, not less than the min bounce angle
  audPaddle.play();
  let minBounceAngle = (MIN_BOUNCE_ANGLE / 180) * Math.PI;
  let range = Math.PI - minBounceAngle * 2;
  let angle = Math.random() * range + minBounceAngle;
  applyBallSpeed(pupSticky ? Math.PI / 2 : angle);
  return true;
}

// setDimensions function
function setDimensions() {
  height = window.innerHeight;
  width = window.innerWidth;
  wall = WALL * (height < width ? height : width);
  canvasEl.width = width;
  canvasEl.height = height;

  ConX.textBaseline = "middle";
  newGame();
}

// spinBall function
function spinBall() {
  let upwards = ball.yV < 0;
  // modify the angle based off the ball spin
  // find the current angle
  let angle = Math.atan2(-ball.yV, ball.xV);
  angle += ((Math.random() * Math.PI) / 2 - Math.PI / 4) * BALL_SPIN;

  let minBounceAngle = (MIN_BOUNCE_ANGLE / 180) * Math.PI;
  if (upwards) {
    if (angle < minBounceAngle) {
      angle = minBounceAngle;
    } else if (angle > Math.PI - minBounceAngle) {
      angle = Math.PI - minBounceAngle;
    }
  } else {
    if (angle > -minBounceAngle) {
      angle = -minBounceAngle;
    } else if (angle < -Math.PI + minBounceAngle) {
      angle = -Math.PI + minBounceAngle;
    }
  }

  applyBallSpeed(angle);
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
    if (gameOver) {
      newGame();
    }
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
    audWall.play();
    spinBall();
  } else if (ball.x > width - wall - ball.w / 2) {
    audWall.play();
    ball.x = width - wall - ball.w / 2;
    ball.xV = -ball.xV;
    spinBall();
  } else if (ball.y < wall + ball.h / 2) {
    audWall.play();
    ball.y = wall + ball.h / 2;
    ball.yV = -ball.yV;
    spinBall();
  }

  // bouncing the ball of the paddle
  if (
    ball.y > paddle.y - paddle.h / 2 - ball.h / 2 &&
    ball.y < paddle.y + paddle.h / 2 + ball.h / 2 &&
    ball.x > paddle.x - paddle.w / 2 - ball.w / 2 &&
    ball.x < paddle.x + paddle.w / 2 + ball.w / 2
  ) {
    audPaddle.play();
    ball.y = paddle.y - paddle.h / 2 - ball.h / 2;

    spinBall();

    // make the ball stick to paddle
    if (pupSticky) {
      ball.xV = 0;
      ball.yV = 0;
    } else {
      ball.yV = -ball.yV;

      spinBall();
    }
  }

  //  ball moves out of the canvas
  if (ball.y > canvasEl.height) {
    outOfBounds();
  }
}

// updateBricks function
function updateBricks() {
  // check for ball collision
  OUTER: for (let i = 0; i < bricks.length; i++) {
    for (let j = 0; j < BRICK_COLS; j++) {
      if (bricks[i][j]?.intersect(ball)) {
        audBrick.play();
        updateScore(bricks[i][j].score);
        ball.setSpeed(bricks[i][j].spdMult);
        if (ball.yV < 0) {
          // upwards
          ball.y = bricks[i][j].bottom + ball.h / 2;
        }
        // downwards
        else {
          ball.y = bricks[i][j].top - ball.h / 2;
        }

        // creating a pup
        if (Math.random() <= PUP_CHANCE) {
          let px = bricks[i][j].left + bricks[i][j].w / 2;
          let py = bricks[i][j].top + bricks[i][j].h / 2;
          let pSize = bricks[i][j].w * 0.4;
          let pKeys = Object.keys(PupType);
          let pKey = pKeys[Math.floor(Math.random() * pKeys.length)];
          pups.push(new PowerUp(px, py, pSize, PupType[pKey]));
        }

        bricks[i][j] = null;
        ball.yV = pupSuper ? ball.yV : -ball.yV;
        numBricks--;
        spinBall();
        break OUTER;
      }
    }
  }

  // test for the next level
  if (numBricks == 0) {
    if (level < MAX_LEVEL) {
      level++;
      newLevel();
    } else {
      gameOver = true;
      win = true;
      newBall();
    }
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

  // move the ball with the paddle
  if (ball.yV == 0) {
    ball.x += paddle.x - lastPaddleX;
  }

  // collecting the PUPS
  for (let i = pups.length - 1; i >= 0; i--) {
    if (
      pups[i].x + pups[i].w / 2 > paddle.x - paddle.w * 0.5 &&
      pups[i].x - pups[i].w / 2 < paddle.x + paddle.w / 2 &&
      pups[i].y + pups[i].h / 2 > paddle.y - paddle.h * 0.5 &&
      pups[i].y - pups[i].h / 2 < paddle.y + paddle.h / 2
    ) {
      switch (pups[i].type) {
        case PupType.EXTENSION:
          // double the width of the paddle
          if (pupExtension) {
            score += PUP_BONUS;
          } else {
            pupExtension = true;
            paddle.w *= 2;
          }
          break;

        case PupType.LIFE:
          // add a life
          lives++;
          break;

        case PupType.STICKY:
          // make paddle sticky
          if (pupSticky) {
            score += PUP_BONUS;
          } else {
            pupSticky = true;
          }
          break;

        case PupType.SUPER:
          // super shots
          if (pupSuper) {
            score += PUP_BONUS;
          } else {
            pupSuper = true;
          }
          break;
      }
      pups.splice(i, 1);
      audPowerup.play();
    }
  }
}

// updatePups function
function updatePups() {
  for (let i = pups.length - 1; i >= 0; i--) {
    pups[i].y += (pups[i].yV / 1000) * 20;

    // delete pups when they go off screen
    if (pups[i].y - pups[i].h * 0.5 > height) {
      pups.splice(i, 1);
    }
  }
}

// updateScore function
function updateScore(brickScore) {
  score += brickScore;

  // check for a high score
  if (score > scoreHigh) {
    scoreHigh = score;
    localStorage.setItem(KEY_SCORE, scoreHigh);
  }
}

setDimensions();
playGame();

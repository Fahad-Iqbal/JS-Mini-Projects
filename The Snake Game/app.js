const canvasEl = document.querySelector("canvas");
const conX = canvasEl.getContext("2d");

canvasEl.height = 400;
canvasEl.width = 400;

// game parameters
let speed = 7;
let tileCount = 20;
let snakeHeadX = 10;
let snakeHeadY = 10;
let xV = 0;
let yV = 0;
let snackX = 5;
let snackY = 5;
let snakeTailLength = 2;
let score = 0;

// Derived Dimension
let tileSize = canvasEl.width / tileCount;

//  snakeBody Array
const snakeBody = [];

// Arrow keys event listener
document.addEventListener("keydown", keyDown);

// The Game Loop
function playGame() {
  clearScreen();
  snackColiDete();
  drawSnack();
  drawSnake();
  changeSnakePosition();
  setTimeout(playGame, 1000 / speed);
}

// changeSnakePosition function
function changeSnakePosition() {
  snakeHeadX += xV;
  snakeHeadY += yV;
}

// clearScreen function
function clearScreen() {
  conX.fillStyle = "black";
  conX.fillRect(0, 0, canvasEl.width, canvasEl.height);
}

// drawSnake function
function drawSnake() {
  // snake body
  conX.fillStyle = "orange";
  for (let i = 0; i < snakeBody.length; i++) {
    let part = snakeBody[i];
    conX.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }

  snakeBody.push(new SnakeBody(snakeHeadX, snakeHeadY));
  if (snakeBody.length > snakeTailLength) {
    snakeBody.shift();
  }
  // snake head
  conX.fillStyle = "green";
  conX.fillRect(
    snakeHeadX * tileCount,
    snakeHeadY * tileCount,
    tileSize,
    tileSize
  );
}

// drawSnack function
function drawSnack() {
  conX.fillStyle = "red";
  conX.fillRect(snackX * tileCount, snackY * tileCount, tileSize, tileSize);
}

// keyDown function
function keyDown(e) {
  // moving up
  if (e.keyCode === 38) {
    if (yV === 1) return;
    yV = -1;
    xV = 0;
    return;
  }

  // moving down
  if (e.keyCode === 40) {
    if (yV === -1) return;
    yV = 1;
    xV = 0;
    return;
  }

  // moving left
  if (e.keyCode === 37) {
    if (xV === 1) return;
    yV = 0;
    xV = -1;
    return;
  }

  // moving right
  if (e.keyCode === 39) {
    if (xV === -1) return;
    yV = 0;
    xV = 1;
    return;
  }
}

// snackColiDete function
function snackColiDete() {
  if (snackX === snakeHeadX && snackY === snakeHeadY) {
    snackX = Math.floor(Math.random() * tileCount);
    snackY = Math.floor(Math.random() * tileCount);
    snakeTailLength++;
  }
}

// The SnakeBody class
class SnakeBody {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

playGame();

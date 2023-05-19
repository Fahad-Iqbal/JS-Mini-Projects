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

// Arrow keys event listener
document.addEventListener("keydown", keyDown);

// The Game Loop
function playGame() {
  clearScreen();
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
  conX.fillStyle = "green";
  conX.fillRect(
    snakeHeadX * tileCount,
    snakeHeadY * tileCount,
    tileSize,
    tileSize
  );
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

playGame();

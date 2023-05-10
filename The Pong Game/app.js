const canvasEl = document.querySelector("canvas");
const canvasContext = canvasEl.getContext("2d");

canvasEl.width = 1500;
canvasEl.height = 720;
// --------------------------------------------------------------------

let RIScore = new Audio();
let AIScore = new Audio();
let hit = new Audio();
let wall = new Audio();

hit.src = "sounds/hit.mp3";
wall.src = "sounds/wall.mp3";
AIScore.src = "sounds/AIScore.mp3";
RIScore.src = "sounds/RIScore.mp3";

// The RI Player Paddle
const playerPaddleRI = {
  xP: 0,
  yP: canvasEl.height / 2 - 100 / 2,
  height: 100,
  width: 10,
  color: "#d2e603",
  score: 0,
};

const playerPaddleAI = {
  xP: canvasEl.width - 10,
  yP: canvasEl.height / 2 - 100 / 2,
  height: 100,
  width: 10,
  color: "orange",
  score: 0,
};

// Creating the ball

const ball = {
  xP: canvasEl.width / 2,
  yP: canvasEl.height / 2,
  radius: 10,
  speed: 7,
  xV: 5,
  yV: 5,
  color: "white",
};

// Creating the net
const net = {
  xP: canvasEl.width / 2 - 1,
  yP: 0,
  width: 2,
  height: 10,
  color: "white",
};

// Drawing the canvas
function drawRect(xP, yP, width, height, color) {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(xP, yP, width, height);
}

// Drawing a circle
function drawCircle(xP, yP, radius, color) {
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  canvasContext.arc(xP, yP, radius, 0, Math.PI * 2);
  canvasContext.fill();
}

// Drawing the text
function drawText(content, xP, yP, color) {
  canvasContext.fillStyle = color;
  canvasContext.font = "35px sans-serif";
  canvasContext.fillText(content, xP, yP);
}

// Drawing the net
function drawNet() {
  for (let i = 0; i < canvasEl.height; i += 15) {
    drawRect(net.xP, net.yP + i, net.width, net.height, net.color);
  }
}

//  game Loop

function runGame() {
  drawRect(0, 0, canvasEl.width, canvasEl.height, "#4683a0");
  drawNet();

  // draw score
  drawText(
    playerPaddleRI.score,
    canvasEl.width * 0.25,
    canvasEl.height * 0.1,
    "white"
  );
  drawText(
    playerPaddleAI.score,
    canvasEl.width * 0.75,
    canvasEl.height * 0.1,
    "white"
  );
  // Drawing the paddles for RI and AI
  drawRect(
    playerPaddleRI.xP,
    playerPaddleRI.yP,
    playerPaddleRI.width,
    playerPaddleRI.height,
    playerPaddleRI.color
  );
  drawRect(
    playerPaddleAI.xP,
    playerPaddleAI.yP,
    playerPaddleAI.width,
    playerPaddleAI.height,
    playerPaddleAI.color
  );

  // draw ball
  drawCircle(ball.xP, ball.yP, ball.radius, ball.color);
}

canvasEl.addEventListener("mousemove", movePaddle);

function movePaddle(e) {
  let canvasRect = canvasEl.getBoundingClientRect();
  playerPaddleRI.yP = e.clientY - canvasRect.top - playerPaddleRI.height / 2;
}

// The collision detection of paddles Function
function paddleColliDete(BALL, PADDLE) {
  BALL.top = BALL.yP - BALL.radius;
  BALL.bottom = BALL.yP + BALL.radius;
  BALL.left = BALL.xP - BALL.radius;
  BALL.right = BALL.xP + BALL.radius;

  PADDLE.top = PADDLE.yP;
  PADDLE.bottom = PADDLE.yP + PADDLE.height;
  PADDLE.left = PADDLE.xP;
  PADDLE.right = PADDLE.xP + PADDLE.width;

  return (
    BALL.right > PADDLE.left &&
    BALL.bottom > PADDLE.top &&
    BALL.left < PADDLE.right &&
    BALL.top < PADDLE.bottom
  );
}

// The everything manager function
function everythingManager() {
  ball.xP += ball.xV;
  ball.yP += ball.yV;

  // creating the AI
  let intelligenceLevel = 0.1;
  playerPaddleAI.yP +=
    (ball.yP - (playerPaddleAI.yP + playerPaddleAI.height / 2)) *
    intelligenceLevel;

  // bouncing of the top and bottom walls
  if (ball.yP + ball.radius > canvasEl.height || ball.yP - ball.radius < 0) {
    ball.yV = -ball.yV;
    wall.play();
    // wall.pause();
  }

  let player = ball.xP < canvasEl.width / 2 ? playerPaddleRI : playerPaddleAI;

  if (paddleColliDete(ball, player)) {
    hit.play();
    let collisionPoint = ball.yP - (player.yP + player.height / 2);
    // normalization -> converting -50, & 50 -> -1 & 1
    collisionPoint = collisionPoint / (player.height / 2);

    let bounceAngle = (collisionPoint * Math.PI) / 4;

    // calculating the direction of the ball when it bounces back
    let direction = ball.xP < canvasEl.width / 2 ? 1 : -1;

    // updating the velocity when the ball hits any paddle
    ball.xV = direction * ball.speed * Math.cos(bounceAngle);
    ball.yV = direction * ball.speed * Math.sin(bounceAngle);

    // after each bounce back increase speed
  }
}

function gameInit() {
  runGame();
  everythingManager();
}

// Looping the game to keep it running
const FPS = 60;
setInterval(gameInit, 1000 / FPS);

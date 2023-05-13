const canvasEl = document.querySelector("canvas");
const canvasContext = canvasEl.getContext("2d");

// game parameters
const GRID_CIRCLE = 0.7; // circle size as a fraction of the cell size
const GRID_COLS = 7; // number of game columns
const GRID_ROWS = 6; // number of game rows
const MARGIN = 0.02; // margin as a fraction of the shortest screen dimension

// colors
const COLOR_BG = "#f9f9f9";
const COLOR_FRAME = "#382039";
const COLOR_FRAME_BOTTOM = "#200f21";
const COLOR_AI = "lawngreen";
const COLOR_AI_DARK = "darkgreen";
const COLOR_RI = "orange";
const COLOR_RI_DARK = " darkgoldenrod";

let gameOver,
  gameTied,
  grid = [],
  playersTurn,
  timeAI;

let width, height, margin;

canvasEl.addEventListener("click", click);
canvasEl.addEventListener("mousemove", highlightGrid);
// window resize event listener
window.addEventListener("resize", setDimensions);

class Cell {
  constructor(left, top, w, h, row, col) {
    this.left = left;
    this.right = left + w;
    this.top = top;
    this.bottom = top + h;
    this.row = row;
    this.col = col;
    this.centerX = left + w / 2;
    this.centerY = top + h / 2;
    this.r = (w * GRID_CIRCLE) / 2;
    this.highlight = null;
    this.owner = null;
  }

  // contains function
  contains(x, y) {
    return x > this.left && x < this.right && y > this.top && y < this.bottom;
  }

  //  the draw circle function
  draw(canvasContext) {
    let color =
      this.owner == null ? COLOR_BG : this.owner ? COLOR_RI : COLOR_AI;

    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(this.centerX, this.centerY, this.r, 0, Math.PI * 2);
    canvasContext.fill();

    // draw highlighting
    if (this.highlight != null) {
      // color
      color = this.highlight ? COLOR_RI : COLOR_AI;
      // draw a circle around the perimeter
      canvasContext.lineWidth = this.r / 4;
      canvasContext.strokeStyle = color;
      canvasContext.beginPath();
      canvasContext.arc(this.centerX, this.centerY, this.r, 0, Math.PI * 2);
      canvasContext.stroke();
    }
  }
}

setDimensions();

// The Game loop
let timeDiff, timeLast;
requestAnimationFrame(playGame);

function playGame(timeNow) {
  if (!timeLast) {
    timeLast = timeNow;
  }

  timeDiff = (timeNow - timeLast) / 1000;
  timeLast = timeNow;
  //  draw functions
  drawBackground();
  drawGrid();
  // calling the next frame
  requestAnimationFrame(playGame);
}

function click(e) {
  if (gameOver) {
    newGame();
    return;
  }
  if (!playersTurn) {
    // return
  }

  selectCell();
}

function createGrid() {
  grid = [];
  //  set up cell size and margins
  let cell, marginX, marginY;

  // device portrait orientation
  if (((width - margin * 2) * GRID_ROWS) / GRID_COLS < height - margin * 2) {
    cell = (width - margin * 2) / GRID_COLS;
    marginX = margin;
    marginY = (height - cell * GRID_ROWS) / 2;
  }
  // device landscape orientation
  else {
    cell = (height - margin * 2) / GRID_ROWS;
    marginY = margin;
    marginX = (width - cell * GRID_COLS) / 2;
  }
  // populating the grid
  for (let i = 0; i < GRID_ROWS; i++) {
    grid[i] = [];
    for (let j = 0; j < GRID_COLS; j++) {
      let left = marginX + j * cell;
      let top = marginY + i * cell;
      grid[i][j] = new Cell(left, top, cell, cell, i, j);
    }
  }
}

function checkWin(row, col) {
  return false;
}

function highlightCell(x, y) {
  let col = null; // identify the chosen col
  for (let row of grid) {
    for (let cell of row) {
      cell.highlight = null;

      // get col
      if (cell.contains(x, y)) {
        col = cell.col;
      }
    }
  }

  // if no col is still chosen
  if (col == null) {
    return;
  }

  // highlight the first unoccupied cell
  for (let i = GRID_ROWS - 1; i >= 0; i--) {
    if (grid[i][col].owner == null) {
      grid[i][col].highlight = playersTurn;
      return grid[i][col];
    }
  }

  return null;
}

function highlightGrid(e) {
  if (!playersTurn || gameOver) {
    // return;
  }
  highlightCell(e.clientX, e.clientY);
}

function newGame() {
  playersTurn = Math.random() < 0.5;
  gameOver = false;
  gameTied = false;
  createGrid();
}

//  drawBackground function
function drawBackground() {
  canvasContext.fillStyle = COLOR_BG;
  canvasContext.fillRect(0, 0, width, height);
}

function drawGrid() {
  // frame and bottom
  let cell = grid[0][0];
  let frameHeight = (cell.bottom - cell.top) * GRID_ROWS;
  let frameWidth = (cell.right - cell.left) * GRID_COLS;
  canvasContext.fillStyle = COLOR_FRAME;
  canvasContext.fillRect(cell.left, cell.top, frameWidth, frameHeight);
  canvasContext.fillStyle = COLOR_FRAME_BOTTOM;
  canvasContext.fillRect(
    cell.left - margin / 2,
    cell.top + frameHeight - margin / 2,
    frameWidth + margin,
    margin
  );

  canvasContext.fill();

  // cells
  for (let row of grid) {
    for (let cell of row) {
      cell.draw(canvasContext);
    }
  }
}

function selectCell() {
  let highlighting = false;
  OUTERLOOP: for (let row of grid) {
    for (let cell of row) {
      if (cell.highlight != null) {
        highlighting = true;
        cell.highlight = null;
        cell.owner = playersTurn;
        if (checkWin(cell.row, cell.col)) {
          gameOver = true;
        }
        break OUTERLOOP;
      }
    }
  }
  // do not allow selection if there is no highlighting
  if (!highlighting) {
    return;
  }

  if (!gameOver) {
    playersTurn = !playersTurn;
  }
}

function setDimensions() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvasEl.width = width;
  canvasEl.height = height;
  margin = MARGIN * Math.min(height, width);

  newGame();
}

const canvasEl = document.querySelector("canvas");
const canvasContext = canvasEl.getContext("2d");

// game parameters
const DELAY_AI = 0.5; // seconds for the AI to take its turn
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

const COLOR_TIE = "darkgrey";
const COLOR_TIE_DARK = "black";
const COLOR_WIN = "blue";

let gameOver,
  gameTied,
  grid = [],
  playersTurn,
  timeAI;

let width, height, margin;

const TEXT_AI = "Computer";
const TEXT_RI = "Human";
const TEXT_TIE = "Draw";
const TEXT_WIN = "Won";

canvasEl.addEventListener("click", click);
canvasEl.addEventListener("mousemove", highlightGrid);
// window resize event listener
window.addEventListener("resize", setDimensions);

class Cell {
  constructor(left, top, w, h, row, col) {
    this.h = h;
    this.w = w;
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
    this.winner = false;
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
    if (this.winner || this.highlight != null) {
      // color
      color = this.winner ? COLOR_WIN : this.highlight ? COLOR_RI : COLOR_AI;
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

  // AI
  AI(timeDiff);

  //  draw functions
  drawBackground();
  drawGrid();
  drawText();
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
  // geetting all the cells from each direction
  let diagonalLeft = [],
    diagonalRight = [],
    horizontal = [],
    vertical = [];

  for (let i = 0; i < GRID_ROWS; i++) {
    for (let j = 0; j < GRID_COLS; j++) {
      // HORIZONTAL CELLS
      if (i == row) {
        horizontal.push(grid[i][j]);
      }

      if (j == col) {
        vertical.push(grid[i][j]);
      }

      // diagonal left
      if (i - j == row - col) {
        diagonalLeft.push(grid[i][j]);
      }
      // diagonal right
      if (i + j == row + col) {
        diagonalRight.push(grid[i][j]);
      }
    }
  }
  // if any four in a row, return win
  return (
    connect4(diagonalLeft) ||
    connect4(diagonalRight) ||
    connect4(horizontal) ||
    connect4(vertical)
  );
}

function connect4(cells = []) {
  let count = 0;
  let lastOwner = null;

  let winningCells = [];
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].owner == null) {
      count = 0;
      winningCells = [];
    }
    // same owner, add to the count
    else if (cells[i].owner == lastOwner) {
      count++;
      winningCells.push(cells[i]);
    } else {
      count = 1;
      winningCells = [];
      winningCells.push(cells[i]);
    }
    // set the lastOwner
    lastOwner = cells[i].owner;

    if (count == 4) {
      for (let cell of winningCells) {
        cell.winner = true;
      }
      return true;
    }
  }
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
    return;
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

function drawText() {
  if (!gameOver) {
    return;
  }
  // set up text parameters
  let size = grid[0][0].h;
  canvasContext.fillStyle = gameTied
    ? COLOR_TIE
    : playersTurn
    ? COLOR_RI
    : COLOR_AI;
  canvasContext.font = size + "px sans-serif";
  canvasContext.lineJoin = "round";
  canvasContext.lineWidth = size / 10;
  canvasContext.strokeStyle = gameTied
    ? COLOR_TIE_DARK
    : playersTurn
    ? COLOR_RI_DARK
    : COLOR_AI_DARK;
  canvasContext.textAlign = "center";
  canvasContext.textBaseline = "middle";
  let offset = size * 0.55;
  let text = gameTied ? TEXT_TIE : playersTurn ? TEXT_RI : TEXT_AI;

  if (gameTied) {
    canvasContext.strokeText(text, width / 2, height / 2);
    canvasContext.fillText(text, width / 2, height / 2);
  } else {
    canvasContext.strokeText(text, width / 2, height / 2 - offset);
    canvasContext.fillText(text, width / 2, height / 2 - offset);

    canvasContext.strokeText(TEXT_WIN, width / 2, height / 2 + offset);
    canvasContext.fillText(TEXT_WIN, width / 2, height / 2 + offset);
  }
}

function AI(diff) {
  if (playersTurn || gameOver) {
    return;
  }

  // countdown -> delay the AI until it make its selection
  if (timeAI > 0) {
    timeAI -= diff;
    if (timeAI <= 0) {
      selectCell();
    }
    return;
  }

  // Setting Up the AI algorithm
  let options = [];
  options[0] = []; // AI wins
  options[1] = []; // block the RI
  options[2] = []; // not an important move
  options[3] = []; // lets the RI win

  // loop through each col
  let cell;
  for (let i = 0; i < GRID_COLS; i++) {
    cell = highlightCell(grid[0][i].centerX, grid[0][i].centerY);
    if (cell == null) {
      continue;
    }

    // first priority, AI wins
    cell.owner = playersTurn; // AI turn
    if (checkWin(cell.row, cell.col)) {
      options[0].push(i);
    } else {
      cell.owner = !playersTurn; //RI turn
      if (checkWin(cell.row, cell.col)) {
        options[1].push(i);
      } else {
        cell.owner = playersTurn;

        // check cell above
        if (cell.row > 0) {
          grid[cell.row - 1][cell.col].owner = !playersTurn;
          // fourth priority, do not let the player win

          if (checkWin(cell.row - 1, cell.col)) {
            options[3].push(i);
          }
          // third priority, not an important move
          else {
            options[2].push(i);
          }
          // deselect the cell above
          grid[cell.row - 1][cell.col].owner = null;
        }
        // no row above, third priority
        else {
          options[2].push(i);
        }
      }
    }
    //  cancel the highlight and selection
    cell.highlight = null;
    cell.owner = null;
  }

  // clear the winning cells
  for (let row of grid) {
    for (let cell of row) {
      cell.winner = false;
    }
  }
  // randomly select a column in a priority order
  let col;
  if (options[0].length > 0) {
    col = options[0][Math.floor(Math.random() * options[0].length)];
  } else if (options[1].length > 0) {
    col = options[1][Math.floor(Math.random() * options[1].length)];
  } else if (options[2].length > 0) {
    col = options[2][Math.floor(Math.random() * options[2].length)];
  } else if (options[3].length > 0) {
    col = options[3][Math.floor(Math.random() * options[3].length)];
  }

  // highlight the selected cell
  highlightCell(grid[0][col].centerX, grid[0][col].centerY);
  timeAI = DELAY_AI;
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
    gameTied = true;
    for (let row of grid) {
      for (let cell of row) {
        if (cell.owner == null) {
          gameTied = false;
        }
      }
    }
    if (gameTied) {
      gameOver = true;
    }
  }
  if (!gameOver) {
    // switch player if game isn't over
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

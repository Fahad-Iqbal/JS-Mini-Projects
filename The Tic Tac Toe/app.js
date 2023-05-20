const boxes = document.querySelectorAll(".box");
const boxesArray = Array.from(boxes);
const result = document.querySelector("h1");
const resetBtn = document.querySelector("button");

// Game Parameters
const player1 = "O";
const player2 = "X";
let playersTurn = player1;
let choices = [];

drawBoard();

function drawBoard() {
  boxesArray.forEach((box, index) => {
    let border = "";

    if (index < 6) {
      border += "border-bottom: 2px solid white;";
    }

    if (index % 3 === 0 || index % 3 === 1) {
      border += "border-right: 2px solid white;";
    }
    box.style = border;

    box.addEventListener("click", boxClicked);
  });
}

function boxClicked(e) {
  const boxId = e.target.id;
  if (!choices[boxId]) {
    choices[boxId] = playersTurn;
    e.target.innerText = playersTurn;

    if (playerWon(playersTurn)) {
      result.innerText = `${playersTurn} Wins`;
      setTimeout(resetBoard, 1500);
    }
    playersTurn = playersTurn === player1 ? player2 : player1;
  }
}

function playerWon(player) {
  // pivot 1
  if (choices[0] === player) {
    if (choices[1] == player && choices[2] == player) {
      console.log("Pivot1.1 : WON");
      return true;
    }
    if (choices[3] == player && choices[6] == player) {
      console.log("Pivot1.2 : WON");
      return true;
    }
  }
  // pivot 2
  if (choices[8] === player) {
    if (choices[5] == player && choices[2] == player) {
      console.log("Pivot2.1 : WON");
      return true;
    }
    if (choices[7] == player && choices[6] == player) {
      console.log("Pivot2.2 : WON");
      return true;
    }
  }
  // pivot 3
  if (choices[4] === player) {
    if (choices[3] == player && choices[5] == player) {
      console.log("Pivot3.1 : WON");
      return true;
    }
    if (choices[1] == player && choices[7] == player) {
      console.log("Pivot3.2 : WON");
      return true;
    }
    if (choices[0] == player && choices[8] == player) {
      console.log("Pivot3.3 : WON");
      return true;
    }
    if (choices[2] == player && choices[6] == player) {
      console.log("Pivot3.4 : WON");
      return true;
    }
  }
}

resetBtn.addEventListener("click", resetBoard);

function resetBoard() {
  choices = [];
  boxes.forEach((box) => {
    box.innerText = "";
  });
  result.innerText = "Tic Tac Toe";
}

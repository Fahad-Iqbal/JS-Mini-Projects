const cards = document.querySelectorAll(".memory-card");

let cardIsFlipped = false;
let lockBoard = false;
let firstCard, secondCard;

cards.forEach(function (card) {
  card.addEventListener("click", flipcard);
});

function flipcard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.toggle("flip");
  if (!cardIsFlipped) {
    // first click -> first card
    cardIsFlipped = true;
    firstCard = this;
  } else {
    // second click -> second card
    secondCard = this;
    checkForMatch();
  }
}

function checkForMatch() {
  //  checking if the cards match
  let isMatched = firstCard.dataset.name === secondCard.dataset.name;
  isMatched ? disableCards() : unFlipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipcard);
  secondCard.removeEventListener("click", flipcard);
  resetBoard();
}

function unFlipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [cardIsFlipped, lockBoard, firstCard, secondCard] = [
    false,
    false,
    null,
    null,
  ];
}

(function shuffle() {
  cards.forEach(function (card) {
    let randomFlexPosition = Math.trunc(Math.random() * 10000);
    card.style.order = randomFlexPosition;
  });
})();

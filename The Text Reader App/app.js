const textDisplay = document.querySelector("#text");
const speedBtn = document.querySelector("#speed");
const readBtn = document.querySelector(".read");
const pauseBtn = document.querySelector(".pause");
const stopBtn = document.querySelector(".stop");
let currentChar;
window.speechSynthesis.cancel();
// Reading Functionality
readBtn.addEventListener("click", function () {
  readText(textDisplay.value);
});
// Pausing Functionality
pauseBtn.addEventListener("click", pauseText);

stopBtn.addEventListener("click", stopText);

speedBtn.addEventListener("input", function () {
  stopText();
  readText(utterance.text.substring(currentChar));
});

// speech utterance
const utterance = new SpeechSynthesisUtterance();

utterance.addEventListener("end", function () {
  textDisplay.disabled = false;
});

utterance.addEventListener("boundary", function (e) {
  currentChar = e.charIndex;
});

// readText function
function readText(textToBeRead) {
  if (speechSynthesis.paused && speechSynthesis.speaking) {
    return speechSynthesis.resume();
  }
  if (speechSynthesis.speaking) return;

  utterance.text = textToBeRead;
  utterance.rate = speedBtn.value || 1;
  textDisplay.disabled = true;

  speechSynthesis.speak(utterance);
}

// pauseText function
function pauseText() {
  if (speechSynthesis.speaking) speechSynthesis.pause();
}

function stopText() {
  speechSynthesis.cancel();
  textDisplay.disabled = false;
}

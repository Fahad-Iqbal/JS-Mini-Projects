function randomColor() {
  return Math.round(Math.random() * 255);
}

function backColor() {
  return `rgb(${randomColor()}, ${randomColor()}, ${randomColor()})`;
}

const switchBtn = document.querySelector(".switch");
const body = document.querySelector("body");
const para = document.querySelector(".color");

switchBtn.addEventListener("click", function () {
  body.style.backgroundColor = backColor();
  para.innerText = backColor();
});

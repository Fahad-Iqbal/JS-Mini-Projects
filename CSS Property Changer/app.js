let blockEl = document.querySelector("#block");
let verticalPosition = document.querySelector("#position-y");
let horizontalPosition = document.querySelector("#position-x");
let size = document.querySelector("#size");
let shapeSelect = document.querySelector("#shape-select");
let okBtn = document.querySelector("#ok-btn");
let R = document.querySelector("#rgba-r");
let G = document.querySelector("#rgba-g");
let B = document.querySelector("#rgba-b");
let A = document.querySelector("#rgba-a");
let rgbaList = [R, G, B, A];
verticalPosition.addEventListener("change", function () {
  blockEl.style.top = verticalPosition.value + "px";
});

horizontalPosition.addEventListener("change", function () {
  blockEl.style.left = horizontalPosition.value + "px";
});

size.addEventListener("change", function () {
  blockEl.style.width = `${150 * size.value}px`;
  blockEl.style.height = `${150 * size.value}px`;
});

okBtn.addEventListener("click", function () {
  if (shapeSelect.value == 1) {
    blockEl.style.borderRadius = 0;
  } else if (shapeSelect.value == 2) {
    blockEl.style.borderRadius = "50%";
  }
});

rgbaList.forEach(function (el) {
  el.addEventListener("change", function () {
    blockEl.style.backgroundColor = `rgba(${R.value}, ${G.value}, ${B.value}, ${A.value})`;
  });
});

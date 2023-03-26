const toggleBtn = document.querySelector(".toggle-btn");
const mainHeader = document.querySelector(".main-header");
const overlay = document.querySelector(".overlay");
const body = document.querySelector("body");
console.log(overlay.parentElement);

toggleBtn.addEventListener("click", function () {
  toggleBtn.classList.toggle("open");
  mainHeader.classList.toggle("open");
  overlay.classList.toggle("open");

  overlay.addEventListener("click", function () {
    toggleBtn.classList.remove("open");
    mainHeader.classList.remove("open");
    overlay.classList.remove("open");
  });
});

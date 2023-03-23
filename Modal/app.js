const openBtn = document.querySelector(".open");
console.log(openBtn);
const closeBtn = document.querySelector(".modal-btn");
const modalContainer = document.querySelector(".modal-container");

openBtn.addEventListener("click", function () {
  modalContainer.classList.add("show");
});

closeBtn.addEventListener("click", function () {
  modalContainer.classList.remove("show");
});

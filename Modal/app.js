const openBtn = document.querySelector(".open");
const closeBtn = document.querySelector(".modal-btn");
const modalContainer = document.querySelector(".modal-container");

openBtn.addEventListener("click", function () {
  modalContainer.classList.add("show");

  closeBtn.addEventListener("click", function () {
    modalContainer.classList.remove("show");
  });

  modalContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("modal-container")) {
      modalContainer.classList.remove("show");
    }
  });
});

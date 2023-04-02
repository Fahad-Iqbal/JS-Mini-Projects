const slides = document.querySelectorAll(".slide");
const imgs = document.querySelectorAll(".indicator-img");

imgs.forEach(function (img) {
  img.addEventListener("click", function () {
    for (let i = 0; i < imgs.length; i++) {
      imgs[i].classList.remove("active");
      slides[i].classList.remove("active");
    }
    const dataId = img.getAttribute("data-id");
    slides[dataId].classList.add("active");
    img.classList.add("active");
  });
});

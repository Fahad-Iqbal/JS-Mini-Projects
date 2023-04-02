let list = document.querySelector(".list");
let imgs = Array.from(list.children);
const nextBtn = document.querySelector(".btn-right");
const prevBtn = document.querySelector(".btn-left");

// Getting imgs width
const imgWidth = imgs[0].getBoundingClientRect().width;
console.log(imgWidth);

// Arranging imgs next to each other

function setImgPosition(img, index) {
  img.style.left = imgWidth * index + "px";
}

imgs.forEach(setImgPosition);

const moveImg = function (list, currentImg, currentIndex) {
  if (currentIndex > 0 && currentIndex < 10) {
    list.forEach(function (img, index) {
      img.style.left = imgWidth * (index - currentIndex) + "px";
    });
    currentImg.classList.remove("current-img");
    list[currentIndex].classList.add("current-img");
    if (currentIndex == 9) {
      nextBtn.classList.add("hidden");
    }
    if (currentIndex > 0 && currentIndex < 9) {
      prevBtn.classList.remove("hidden");
      nextBtn.classList.remove("hidden");
    }

    if (currentIndex == 0) {
      prevBtn.classList.add("hidden");
    }
  }
};

nextBtn.addEventListener("click", function () {
  const currentImg = document.querySelector(".current-img");
  let currentIndex = imgs.indexOf(currentImg);
  currentIndex += 1;
  moveImg(imgs, currentImg, currentIndex);
});

prevBtn.addEventListener("click", function () {
  const currentImg = document.querySelector(".current-img");
  let currentIndex = imgs.indexOf(currentImg);
  currentIndex -= 1;
  moveImg(imgs, currentImg, currentIndex);
});

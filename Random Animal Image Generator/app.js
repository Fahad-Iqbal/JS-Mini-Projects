/*
Public API Repo
https://github.com/public-apis/public-apis
*/

let cat = document.querySelector(".cat");
let fox = document.querySelector(".fox");
let dog = document.querySelector(".dog");

const catBtn = document.querySelector(".get-cat");
const foxBtn = document.querySelector(".get-fox");
const dogBtn = document.querySelector(".get-dog");

catBtn.addEventListener("click", getRandomCat);
foxBtn.addEventListener("click", getRandomFox);
dogBtn.addEventListener("click", getRandomDog);

function getRandomCat() {
  fetch("https://cataas.com/cat?json=true")
    .then((response) => {
      return response.json();
    })
    .then((responseData) => {
      if (cat.firstChild) cat.removeChild(cat.firstChild);
      let catImage = document.createElement("img");
      catImage.src = `https://cataas.com/${responseData.url}`;
      cat.appendChild(catImage);
    });
}

function getRandomFox() {
  fetch("https://randomfox.ca/floof/")
    .then((response) => {
      return response.json();
    })
    .then((responseData) => {
      if (fox.firstChild) fox.removeChild(fox.firstChild);
      let foxImage = document.createElement("img");
      foxImage.src = `${responseData.image}`;
      fox.appendChild(foxImage);
    });
}

function getRandomDog() {
  fetch("https://random.dog/woof.json")
    .then((response) => {
      return response.json();
    })
    .then((responseData) => {
      if (dog.firstChild) dog.removeChild(dog.firstChild);
      let dogImage = document.createElement("img");
      dogImage.src = `${responseData.url}`;
      dog.appendChild(dogImage);
    });
}

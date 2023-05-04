// https://icanhazdadjoke.com/api
const apiURL = "https://api.chucknorris.io/jokes/random";
const jokeText = document.querySelector(".joke");
const jokeBtn = document.querySelector(".joke-container button");

jokeBtn.addEventListener("click", showJoke);

async function showJoke() {
  const responseData = await fetch(apiURL)
    .then((response) => response.json())
    .then((responseData) => {
      return responseData.value;
    });

  jokeText.textContent = await responseData;
}

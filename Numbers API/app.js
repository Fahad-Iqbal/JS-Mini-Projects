// http://numbersapi.com/
const numInput = document.querySelector(".fact-container input");
const factBtn = document.querySelector(".fact-container button");
const factText = document.querySelector(".fact");

factBtn.addEventListener("click", async function () {
  const number = numInput.value || 1;
  const url = `http://numbersapi.com/${number}`;
  const proxyURL = "https://cors-anywhere.herokuapp.com/";
  const fact = await fetch(`${proxyURL}${url}`).then((response) => {
    return response.text();
  });
  factText.textContent = fact;
});

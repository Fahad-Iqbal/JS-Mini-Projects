const searchInput = document.querySelector(".search");
const suggestionsContainer = document.querySelector(".suggestions");

searchInput.addEventListener("input", displayMatches);

const citiesStates = [];

fetch(
  "https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json"
)
  .then((response) => response.json())
  .then((responseData) => citiesStates.push(...responseData));

function findMatches(wordToMatch, citiesStates) {
  return citiesStates.filter((cityState) => {
    const regX = new RegExp(wordToMatch, "gi");
    return cityState.city.match(regX) || cityState.state.match(regX);
  });
}

function displayMatches() {
  const findArray = findMatches(this.value, citiesStates);

  const matchEl = findArray
    .map((place) => {
      const regX = new RegExp(this.value, "gi");
      const cityName = place.city.replace(
        regX,
        `<span class="highlight">${this.value}</span>`
      );
      const stateName = place.state.replace(
        regX,
        `<span class="highlight">${this.value}</span>`
      );

      return `<li class="name">${cityName}, ${stateName}</li>`;
    })
    .join("");

  suggestionsContainer.innerHTML = matchEl;
}

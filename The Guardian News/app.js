//62dba0b6-d57d-4aca-92ff-f356ee7feb92

//https://content.guardianapis.com/search?api-key=62dba0b6-d57d-4aca-92ff-f356ee7feb92

const newsInput = document.querySelector(".news-input");
const form = document.querySelector("form");
const newsContainer = document.querySelector(".news-container");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let searchQuery = newsInput.value;
  fetchNews(searchQuery);
});

async function fetchNews(searchQuery) {
  const apiKey = "62dba0b6-d57d-4aca-92ff-f356ee7feb92";
  const response = await fetch(
    `https://content.guardianapis.com/search?q=${searchQuery}&api-key=${apiKey}`
  );
  const responseData = await response.json();
  newsResults(responseData.response.results);
}

function newsResults(results) {
  let fetchedNews = "";
  results.forEach((result) => {
    let newsSection = result.sectionName;
    let newsDate = result.webPublicationDate;
    let newsURL = result.webUrl;
    let newsTitle = result.webTitle;

    fetchedNews += `
                  <div class="news">
                    <p>${newsSection}</p>
                    <p>${newsDate}</p>
                    <a href="${newsURL}" target="_blank">${newsTitle}</a>
                  </div>
    `;

    newsContainer.innerHTML = fetchedNews;
  });
}

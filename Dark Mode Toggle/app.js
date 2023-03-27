const darkModeBtn = document.querySelector('input[type="checkbox"]');
const html = document.querySelector("html");

darkModeBtn.addEventListener("click", function () {
  if (darkModeBtn.checked == true) {
    html.setAttribute("data-theme", "dark");
    html.classList.toggle("transition");
  } else {
    html.setAttribute("data-theme", "light");
    html.classList.toggle("transition");
  }
});

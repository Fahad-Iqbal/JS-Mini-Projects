const progressBar = document.querySelector(".progress-done");
const submit = document.querySelector('input[type="submit"]');

submit.addEventListener("click", function (e) {
  const input = document.querySelector('input[type="number"]');
  e.preventDefault();
  if (input.value <= 100 && input.value >= 0 && input.value.length > 0) {
    progress = input.value;
    setTimeout(function () {
      progressBar.style.width = progress + "%";
      progressBar.style.opacity = 1;
      progressBar.innerText = progress + "%";
    }, 500);
  }
  input.value = "";
});

const progressBar = document.querySelector(".progress-done");
const submit = document.querySelector('input[type="submit"]');

submit.addEventListener("click", function (e) {
  progressBar.style.width = 0 + "%";
  progressBar.innerText = "";
  const input = document.querySelector('input[type="number"]');
  e.preventDefault();
  if (input.value <= 100 && input.value >= 0 && input.value.length > 0) {
    progress = input.value;
    setTimeout(function () {
      progressBar.style.opacity = 1;
    }, 10);

    async function sleepingFunc() {
      for (let i = 0; i <= progress; i++) {
        progressBar.style.width = i + "%";
        progressBar.innerText = i + "%";
        await sleep(Math.round(15));
      }
    }

    sleepingFunc();
  }
  input.value = "";
});

function sleep(ms) {
  return new Promise((resolveFunc) => setTimeout(resolveFunc, ms));
}

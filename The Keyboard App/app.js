const keyContainers = document.querySelectorAll(".keys");
let textArea = document.querySelector(".display textarea");
let index = 0;
let text = textArea.value;
keyContainers.forEach(function (key) {
  key.addEventListener("click", function (e) {
    text = textArea.value;
    text += e.target.value != undefined ? e.target.value.toLowerCase() : "";
    e.target.contentEditable = "true";
    console.log(e);
    textArea.value = text;
  });
});

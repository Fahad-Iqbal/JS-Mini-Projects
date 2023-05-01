const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");

const formInputValidator = /^(?=\D{8,})(?=\D*\d{2,})/;
usernameInput.addEventListener("input", validate);
passwordInput.addEventListener("input", validate);

function validate(e) {
  if (e.target.id === "username") {
    if (usernameInput.value.length <= 3) {
      usernameInput.classList.add("invalid");
      usernameInput.classList.remove("valid");
    } else {
      usernameInput.classList.add("valid");
      usernameInput.classList.remove("invalid");
    }
  }
  if (e.target.id === "password") {
    if (formInputValidator.test(passwordInput.value)) {
      passwordInput.classList.add("valid");
      passwordInput.classList.remove("invalid");
    } else {
      passwordInput.classList.add("invalid");
      passwordInput.classList.remove("valid");
    }
  }
}

const passwordDisplay = document.querySelector("#password-display");
const rangeChar = document.querySelector("#range-char");
const numberChar = document.querySelector("#number-char");
const numbers = document.querySelector("#numbers");
const symbols = document.querySelector("#symbols");
const upperCase = document.querySelector("#uppercase");
const genPassBtn = document.querySelector('input[type="submit"]');

let numChars = 1;

rangeChar.addEventListener("input", function () {
  numberChar.value = rangeChar.value;
  numChars = rangeChar.value;
});

numberChar.addEventListener("", function () {
  rangeChar.value = numberChar.value;
  numChars = numberChar.value;
});

let charSampleArray = "abcdefghijklmnopqrstuvwxyz".split("");
let numberArray = "1234567890".split("");
let symbolsArray = "`~!@#$%^&*()\";'?/><,.[]{}".split("");
let upperCaseArray = "ABCDEFGHIJKLMNOPQRSTUVWZYZ".split("");

genPassBtn.addEventListener("click", function (e) {
  e.preventDefault();
  charSampleArray = "abcdefghijklmnopqrstuvwxyz".split("");
  let password = "";
  if (numbers.checked) {
    charSampleArray = charSampleArray.concat(numberArray);
  }
  if (symbols.checked) {
    charSampleArray = charSampleArray.concat(symbolsArray);
  }
  if (upperCase.checked) {
    charSampleArray = charSampleArray.concat(upperCaseArray);
  }
  for (let i = 0; i < numChars; i++) {
    let char =
      charSampleArray[Math.floor(Math.random() * charSampleArray.length)];
    password += char;
  }
  passwordDisplay.innerText = password;
});
let a = [1, 2, 3];
let b;
b = a;
console.log(b);
a = [1, 2, 3, 4];
console.log(b);

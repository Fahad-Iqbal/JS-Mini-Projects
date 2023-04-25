const celciusInput = document.querySelector("#celcius");
const fahrenheitInput = document.querySelector("#fahrenheit");
const kelvinInput = document.querySelector("#kelvin");
const tempInputs = document.querySelectorAll("input");

if (e.target.value == "") {
  celciusInput.value = null;
  fahrenheitInput.value = null;
  kelvinInput.value = null;

  return;
}

tempInputs.forEach(function (input) {
  input.addEventListener("input", function (e) {
    let tempValue = parseFloat(e.target.value);
    let inputName = e.target.name;
    if (inputName === "celcius") {
      fahrenheitInput.value = (tempValue * 1.8 + 32).toFixed(2);
      kelvinInput.value = (tempValue + 273.15).toFixed(2);
    } else if (inputName === "fahrenheit") {
      celciusInput.value = ((tempValue - 32) / 1.8).toFixed(2);
      kelvinInput.value = ((tempValue - 32) / 1.8 + 273.15).toFixed(2);
    } else if (inputName === "kelvin") {
      celciusInput.value = (tempValue = 273.15).toFixed(2);
      fahrenheitInput.value = ((tempValue - 273.15) * 1.8 + 32).toFixed(2);
    }
  });
});

//QdPkEhVyfJ2Fn//uKigX3k9ofEueNPLDAF

const fromCurrencyInput = document.querySelector(".from-currency");
const toCurrencyInput = document.querySelector(".to-currency");
const exchangeAmountInput = document.querySelector(".amount");
const getRateBtn = document.querySelector(".get-rate");

getRateBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const fromCurrencyValue = fromCurrencyInput.value;
  const toCurrencyValue = toCurrencyInput.value;
  const exchangeAmountValue = exchangeAmountInput.value;

  if (
    fromCurrencyValue === "" ||
    toCurrencyValue === "" ||
    exchangeAmountValue === ""
  ) {
    inputError();
  } else {
    convertCurrency(fromCurrencyValue, toCurrencyValue, exchangeAmountValue)
      .then((exchangeResult) => {
        document.querySelector(".currency-item").innerText = exchangeResult;
        setTimeout(() => {
          location.reload();
        }, 6000);
      })
      .catch(() => invalidCode());
  }
});

async function getExchangeRate(fromCurrency, toCurrency) {
  const response = await fetch(
    "https://api.apilayer.com/fixer/latest?base=USD",
    { method: "GET", headers: { apikey: "YOUR API KEY" } }
  );
  const currencyData = await response.json();
  const currencyRates = currencyData.rates;
  const baseCurrency = 1 / currencyRates[fromCurrency];
  const exchangeRate = baseCurrency * currencyRates[toCurrency];

  if (isNaN(exchangeRate)) {
    throw new Error(invalidCode());
  }
  return exchangeRate;
}

async function convertCurrency(fromCurrency, toCurrency, exchangeAmount) {
  const amountExchangeRate = await getExchangeRate(fromCurrency, toCurrency);
  const convertedAmount = (exchangeAmount * amountExchangeRate).toFixed(2);

  return `${exchangeAmount} ${fromCurrency} =====> ${convertedAmount} ${toCurrency}`;
}

function inputError() {
  document.querySelector(".input-error").classList.add("show");
  setTimeout(() => {
    document.querySelector(".input-error").classList.remove("show");
  }, 2500);
}

function invalidCode() {
  document.querySelector(".invalid-code").classList.add("show");
  setTimeout(() => {
    document.querySelector(".invalid-code").classList.remove("show");
  }, 2500);
}

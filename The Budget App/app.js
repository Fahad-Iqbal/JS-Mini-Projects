const balanceEl = document.querySelector(".balance .value");
const incomeTotalEl = document.querySelector(".income-total");
const outcomeTotalEl = document.querySelector(".outcome-total");
const incomeEl = document.querySelector("#income-tracker");
const expenseEl = document.querySelector("#expense-tracker");
const allEl = document.querySelector("#all");
const incomeList = document.querySelector("#income-tracker .list");
const expenseList = document.querySelector("#expense-tracker .list");
const allList = document.querySelector("#all .list");
const lists = document.querySelectorAll(".list");

// Tabs
const expenseBtn = document.querySelector(".tab1");
const incomeBtn = document.querySelector(".tab2");
const allBtn = document.querySelector(".tab3");

// Input Btns
const addExpense = document.querySelector(".add-expense");
const expenseTitle = document.querySelector("#expense-title-input");
const expenseAmount = document.querySelector("#expense-amount-input");

const addIncome = document.querySelector(".add-income");
const incomeTitle = document.querySelector("#income-title-input");
const incomeAmount = document.querySelector("#income-amount-input");

// Necessary Variables
let ENTRY_LIST = [];
let [balance, income, outcome] = [0, 0, 0];
let [deleteIcon, editIcon] = ["fas fa-trash", "far fa-edit"];

// expenseBtn Event Listener

expenseBtn.addEventListener("click", function () {
  show(expenseEl);
  hide([incomeEl, allList]);
  active(expenseBtn);
  inactive([incomeBtn, allBtn]);
});
incomeBtn.addEventListener("click", function () {
  show(incomeEl);
  hide([expenseEl, allList]);
  active(incomeBtn);
  inactive([expenseBtn, allBtn]);
});
allBtn.addEventListener("click", function () {
  show(allList);
  hide([expenseEl, incomeEl]);
  active(allBtn);
  inactive([expenseBtn, incomeBtn]);
});

addExpense.addEventListener("click", budgetOut);

addIncome.addEventListener("click", budgetIn);

// addExpense/ addIncome Enter key event listener

document.addEventListener("keypress", function (e) {
  if (e.key !== "Enter") return;
  budgetOut(e);
  budgetIn(e);
});

function budgetOut(e) {
  e.preventDefault();
  if (!expenseTitle.value || !expenseAmount.value) return;

  let expense = {
    type: "expense",
    title: expenseTitle.value,
    amount: parseFloat(expenseAmount.value),
  };
  ENTRY_LIST.push(expense);
  updateUI();
  clearInput([expenseTitle, expenseAmount]);
}

function budgetIn(e) {
  e.preventDefault();
  if (!incomeTitle.value || !incomeAmount.value) return;

  let income = {
    type: "income",
    title: incomeTitle.value,
    amount: parseFloat(incomeAmount.value),
  };
  ENTRY_LIST.push(income);
  updateUI();
  clearInput([incomeTitle, incomeAmount]);
}

function updateUI() {
  income = calculateTotal("income", ENTRY_LIST);
  outcome = calculateTotal("expense", ENTRY_LIST);
  balance = Math.abs(calculateBalance(income, outcome));

  let sign = income >= outcome ? "$" : "-$";

  balanceEl.innerHTML = `<p>${sign}</p><p>${balance}</p>`;
  incomeTotalEl.innerHTML = `<p>$</p><p>${income}</p>`;
  outcomeTotalEl.innerHTML = `<p>$</p><p>${outcome}</p>`;

  clearElement([expenseList, incomeList, allList]);

  ENTRY_LIST.forEach(function (entry, index) {
    if (entry.type === "expense") {
      showEntry(expenseList, entry.type, entry.title, entry.amount, index);
    } else if (entry.type === "income") {
      showEntry(incomeList, entry.type, entry.title, entry.amount, index);
    }
    showEntry(allList, entry.type, entry.title, entry.amount, index);
  });
}

// showEntry Function

function showEntry(list, type, title, amount, id) {
  const entry = `<li id="${id}" class="${type}">
                    <div class="entry">${title}: $${amount}</div> 
                    <div class="action">
                      <i class="far fa-edit"></i>
                      <i class="fas fa-trash"></i>
                    </div>                      
                </li>`;

  const position = "afterbegin";

  list.insertAdjacentHTML(position, entry);
}

function clearElement(elements) {
  elements.forEach(function (element) {
    element.innerHTML = "";
  });
}

// calculateBalance Function
function calculateBalance(income, outcome) {
  return income - outcome;
}

function calculateTotal(type, list) {
  let sum = 0;
  list.forEach(function (entry) {
    if (entry.type === type) {
      sum += entry.amount;
    }
  });
  return sum;
}

function clearInput(inputs) {
  inputs.forEach(function (input) {
    input.value = "";
  });
}

// show Function

function show(element) {
  element.classList.remove("hide");
}

function hide(elements) {
  elements.forEach(function (element) {
    element.classList.add("hide");
  });
}

function active(element) {
  element.classList.add("active");
}

function inactive(elements) {
  elements.forEach(function (element) {
    element.classList.remove("active");
  });
}

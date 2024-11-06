const addExpense = document.getElementById("add-expense");
const expenseModal = document.getElementById("expense-modal");
const titleInput = document.getElementById("title-input");
const amountInput = document.getElementById("amount-input");
const dateInput = document.getElementById("date-input");
const expenseList = document.getElementById("expense-list");
const totalTracker = document.getElementById("tracker-wrapper");
const submitButton = document.getElementById("expense-submit");
// exp = expense
const expData = [];
// Using Intl class to help format number amounts
const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

let currentExp = {};

const showModal = () => {
  expenseModal.classList.toggle("hidden");
};

const submitExpense = () => {
  const amountValue = amountInput.value;

  if (!parseFloat(amountValue)) {
    alert("Please input a number value for the amount");
    return;

  } if (Math.floor(amountValue) != amountValue) {
    if (amountString.split(".")[1].length > 2) {
      alert("Please input a number with only two decimal spaces");
      return;
    }
  }

  currentExp = {
    title: titleInput.value,
    amount: parseFloat(amountValue),
    date: dateInput.value,
  };

  expData.push(currentExp);
  currentExp = {};
  console.log(expData);
  updateList();
};

const updateList = () => {
  expenseList.innerHTML = "";

  expData.forEach(({ title, amount, date }) => {
    expenseList.innerHTML += `
      <div class="card-wrapper">
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>Amount:</strong> ${USDollar.format(amount)}</p>
        <p><strong>Date:</strong> ${date}</p>
      </div>
    `;
  });

  expenseModal.classList.toggle("hidden");
  updateTotal();
};

const updateTotal = () => {
  totalTracker.innerHTML = "";
  let total = 0;

  expData.forEach(({ amount }) => {
    total += amount;
  });

  totalTracker.innerHTML = `
    <p><strong>Total Change:</strong> +${USDollar.format(total)}</p>
    <hr>
  `;
};

addExpense.addEventListener("click", showModal);
submitButton.addEventListener("click", submitExpense);

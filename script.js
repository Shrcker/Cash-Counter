const addExpense = document.getElementById("add-expense");
const expenseModal = document.getElementById("expense-modal");
const titleInput = document.getElementById("title-input");
const amountInput = document.getElementById("amount-input");
const dateInput = document.getElementById("date-input");
const expenseList = document.getElementById("expense-list");
const totalTracker = document.getElementById("tracker-wrapper");
const submitButton = document.getElementById("expense-submit");
const errorMsg = document.getElementById("error");
// exp = expense
const expData = [];
let currentExp = {};

const showModal = () => {
  expenseModal.classList.toggle("hidden");
};

const submitExpense = () => {
  errorMsg.innerHTML = "";

  if (!parseInt(amountInput.value)) {
    throwError();
    return;
  }

  currentExp = {
    title: titleInput.value,
    amount: amountInput.value,
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
        <p><strong>Amount:</strong> $${amount}</p>
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
    total += parseInt(amount);
  });

  totalTracker.innerHTML = `
    <p><strong>Total Change:</strong> +$${total}</p>
    <hr>
  `;
};

const throwError = (error) => {
  errorMsg.innerHTML += `<p>Please enter a number for amount</p>`;

  amountInput.value = "";
};

addExpense.addEventListener("click", showModal);
submitButton.addEventListener("click", submitExpense);

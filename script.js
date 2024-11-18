const addExpense = document.getElementById("add-expense");
const expenseModal = document.getElementById("expense-modal");
const titleInput = document.getElementById("title-input");
const amountInput = document.getElementById("amount-input");
const dateInput = document.getElementById("date-input");
const expenseList = document.getElementById("expense-list");
const totalTracker = document.getElementById("tracker-wrapper");
const submitButton = document.getElementById("expense-submit");
const toggleButtons = document.getElementsByClassName("toggle");
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
  // clear inputs whenever the modal is opened
  titleInput.value = "";
  amountInput.value = "";
  dateInput.value = "";
};

const submitExpense = (event) => {
  event.preventDefault();
  const expIndex = expData.findIndex((item) => item.id === currentExp.id);

  const entryObj = {
    title: titleInput.value.trim(),
    amount: amountInput.value,
    type: toggleButtons[0].checked ? "Expense" : "Income",
    date: dateInput.value,
    id: `${titleInput.value.toLowerCase().replace(/\s+/g, "_")}:${dateInput.value}`,
  };

  if (authEntry(entryObj)) {
    if (expIndex === -1) {
      expData.unshift(entryObj);
    } else {
      expData[expIndex] = entryObj;
    }
  }

  currentExp = {};
  updateList();
};

const authEntry = ({ title, amount, date, id }) => {
  let goodEntry = true;

  switch (true) {
    case title == "":
      alert("Please input a title for the record.");
      goodEntry = false;
      break;
    case !parseFloat(amount):
      alert("Please input a number for the amount.");
      goodEntry = false;
      break;
    case Math.floor(amount * 100) / 100 != amount:
      alert("Please input a number with only two decimal spaces.");
      goodEntry = false;
      break;
    case date == "":
      alert("Please input a date for the record.");
      goodEntry = false;
      break;
  }

  return goodEntry;
};

const updateList = () => {
  expenseList.innerHTML = "";

  expData.forEach(({ title, amount, type, date, id }) => {
    expenseList.innerHTML += `
      <div class="entry-wrapper" id="${id}">
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>Amount:</strong><span class=${type === "Expense" ? "exp-rec" : "inc-rec"}> 
          ${USDollar.format(amount)}</span></p>
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Date:</strong> ${date}</p>
        <button type="button" id="edit-btn" onClick="editEntry(this)">Edit</button>
        <button type="button" id="delete-btn" onClick="deleteEntry(this)">Delete</button>
        <br><br>
      </div>
    `;
  });

  // toggle modal "hidden" state only when it's not hidden
  if (!expenseModal.classList.contains("hidden")) {
    expenseModal.classList.toggle("hidden");
  }
  updateTotal();
};

const updateTotal = () => {
  totalTracker.innerHTML = "";
  let total = 0;

  expData.forEach(({ amount, type }) => {
    if (type === "Expense") {
      total -= amount;
    } else {
      total += amount;
    }
  });

  totalTracker.innerHTML = `
    <p><strong>Total Change:</strong> ${USDollar.format(total)}</p>
    <hr>
  `;
};

const deleteEntry = (button) => {
  const dataIndex = expData.findIndex((item) => item.id === button.parentElement.id);
  const doubleCheck = confirm(
    `Are you sure you wish to delete entry "${expData[dataIndex].title}"?`
  );

  if (dataIndex >= 0 && doubleCheck) {
    expData.splice(dataIndex);
  } else if (!doubleCheck) {
    return;
  } else {
    alert("Record does not exist.");
  }
  updateList();
};

const editEntry = (button) => {
  const dataIndex = expData.findIndex((item) => item.id === button.parentElement.id);
  currentExp = expData[dataIndex];
  titleInput.value = currentExp.title;
  amountInput.value = currentExp.amount;
  dateInput.value = currentExp.date;
  expenseModal.classList.toggle("hidden");
};

addExpense.addEventListener("click", showModal);
submitButton.addEventListener("click", submitExpense);

const addBtn = document.getElementById("add-entry");
const cancelBtn = document.getElementById("cancel-button");
const entryForm = document.getElementById("form-wrapper");
const titleInput = document.getElementById("title-input");
const amountInput = document.getElementById("amount-input");
const dateInput = document.getElementById("date-input");
const entryList = document.getElementById("entry-list");
const totalTracker = document.getElementById("tracker-wrapper");
const submitBtn = document.getElementById("entry-submit");
const toggleBtns = document.getElementsByClassName("toggle-input");
const editBtns = document.getElementsByClassName("edit");
const deleteBtns = document.getElementsByClassName("delete");

const cashData = JSON.parse(localStorage.getItem("cashData")) || [];
// Using Intl class to help format number amounts
const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

let currentEntry = {};

const showForm = () => {
  entryForm.classList.remove("hidden");
  // clear inputs whenever the modal is opened
  titleInput.value = "";
  amountInput.value = "";
  dateInput.value = "";
};

const hideForm = () => {
  entryForm.classList.add("hidden");
}

const submitExpense = (event) => {
  event.preventDefault();
  const entryIndex = cashData.findIndex((item) => item.id === currentEntry.id);

  const cashObject = {
    title: titleInput.value.trim(),
    amount: amountInput.value,
    type: toggleBtns[0].checked ? "Expense" : "Income",
    date: dateInput.value,
    id: `${titleInput.value.toLowerCase().replace(/\s+/g, "_")}:${dateInput.value}`,
  };

  if (verifyEntry(cashObject)) {
    if (entryIndex === -1) {
      cashData.unshift(cashObject);
    } else {
      cashData[entryIndex] = cashObject;
    }
    localStorage.setItem("cashData", JSON.stringify(cashData));
  }

  currentEntry = {};
  updateList();
};

const verifyEntry = ({ title, amount, date, id }) => {
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
  entryList.innerHTML = "";

  cashData.forEach(({ title, amount, type, date, id }) => {
    entryList.innerHTML += `
      <div class="entry-wrapper" id="${id}">
        <div class="p-wrapper">
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Amount:</strong><span class=${type === "Expense" ? "exp-rec" : "inc-rec"}> 
            ${USDollar.format(amount)}</span></p>
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>Date:</strong> ${date}</p>
        </div>
        <div class="button-wrapper">
          <button type="button" class="button card-button edit" onClick="editEntry(this, '${id}')">Edit</button>
          <button type="button" class="button card-button delete" onClick="deleteEntry(this, '${id}')">Delete</button>
        </div>
      </div>
    `;
  });

  // toggle modal "hidden" state only when it's not hidden
  if (!entryForm.classList.contains("hidden")) {
    entryForm.classList.toggle("hidden");
  }
  updateTotal();
};

const updateTotal = () => {
  totalTracker.innerHTML = "";
  let total = 0;

  cashData.forEach(({ amount, type }) => {
    if (type === "Expense") {
      total -= Number(amount);
    } else {
      total += Number(amount);
    }
  });

  totalTracker.innerHTML = `
    <p><strong>Total Change:</strong></p>
    <p><span class=${total >= 0 ? "inc-rec" : "exp-rec"}>
      ${USDollar.format(total)}</span></p>
  `;
};

const deleteEntry = (button, id) => {
  const dataIndex = cashData.findIndex((item) => item.id === id);
  const verifyDelete = confirm(
    `Are you sure you wish to delete entry "${cashData[dataIndex].title}"?`
  );

  if (dataIndex >= 0 && verifyDelete) {
    cashData.splice(dataIndex, 1);
    localStorage.setItem("cashData", JSON.stringify(cashData));
  } else if (!verifyDelete) {
    return;
  } else {
    alert("Record does not exist.");
  }
  updateList();
};

const editEntry = (button, id) => {
  const dataIndex = cashData.findIndex((item) => item.id === id);
  currentEntry = cashData[dataIndex];
  titleInput.value = currentEntry.title;
  amountInput.value = currentEntry.amount;
  dateInput.value = currentEntry.date;
  entryForm.classList.toggle("hidden");
};

if (cashData.length) {
  updateList();
}

addBtn.addEventListener("click", showForm);
submitBtn.addEventListener("click", submitExpense);
cancelBtn.addEventListener("click", hideForm);

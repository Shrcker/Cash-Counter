const addEntry = document.getElementById("add-entry");
const entryModal = document.getElementById("entry-modal");
const titleInput = document.getElementById("title-input");
const amountInput = document.getElementById("amount-input");
const dateInput = document.getElementById("date-input");
const entryList = document.getElementById("entry-list");
const totalTracker = document.getElementById("tracker-wrapper");
const submitButton = document.getElementById("entry-submit");
const toggleButtons = document.getElementsByClassName("toggle");

const cashData = JSON.parse(localStorage.getItem("cashData")) || [];
// Using Intl class to help format number amounts
const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

let currentEntry = {};

const showModal = () => {
  entryModal.classList.toggle("hidden");
  // clear inputs whenever the modal is opened
  titleInput.value = "";
  amountInput.value = "";
  dateInput.value = "";
};

const submitExpense = (event) => {
  event.preventDefault();
  const entryIndex = cashData.findIndex((item) => item.id === currentEntry.id);

  const cashObject = {
    title: titleInput.value.trim(),
    amount: amountInput.value,
    type: toggleButtons[0].checked ? "Expense" : "Income",
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
  if (!entryModal.classList.contains("hidden")) {
    entryModal.classList.toggle("hidden");
  }
  updateTotal();
};

const updateTotal = () => {
  totalTracker.innerHTML = "";
  let total = 0;

  cashData.forEach(({ amount, type }) => {
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
  const dataIndex = cashData.findIndex((item) => item.id === button.parentElement.id);
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

const editEntry = (button) => {
  const dataIndex = cashData.findIndex((item) => item.id === button.parentElement.id);
  currentEntry = cashData[dataIndex];
  titleInput.value = currentEntry.title;
  amountInput.value = currentEntry.amount;
  dateInput.value = currentEntry.date;
  entryModal.classList.toggle("hidden");
};

if (cashData.length) {
  updateList();
}

addEntry.addEventListener("click", showModal);
submitButton.addEventListener("click", submitExpense);

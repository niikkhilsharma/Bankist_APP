'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const info = document.querySelector('.info');

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
/////////////////////////////////////////////////
/////////////////////////////////////////////////
const movements__row = document.querySelectorAll('movements__row');

const displayMovements = function (movement, sorted = false) {
  containerMovements.innerHTML = '';
  const movs = sorted ? movement.slice().sort((a, b) => a - b) : movement;
  movs.forEach(function (mov, index) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div> 
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html); //insertAdjacentHTML is used to inert html paramters(position we want to add html text at and then the html we want to add)
  });
};

//Adding all the money in the account
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(
    (accumulator, value, index, array) => accumulator + value,
    0
  );
  labelBalance.textContent = `${acc.balance}€`;
};

//This function show the total of deposits and withdrawl.
const calcDisplaySummary = function (acc) {
  //Calculating all the deposits
  const deposit = acc.movements
    .filter((val) => val > 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumIn.textContent = `${deposit}€`;

  //Calculating all the withdrawls
  const withdrawls = acc.movements
    .filter((val) => val < 0)
    .reduce((accumulator, val) => accumulator + val, 0);
  labelSumOut.textContent = `${Math.abs(withdrawls)}€`;

  //Calculating the interest. interest rate = 1.2% of deposited amount.
  const interest = acc.movements
    .filter((val) => val > 0)
    .map((val) => (val * acc.interestRate) / 100) //Here, bank introduced a new rule that the interest in only paid if the interest is atleast 1
    .filter((interest) => interest >= 1)
    .reduce((acc, val, i, arr) => acc + val, 0);
  labelSumInterest.textContent = `${interest}€`;
};

//Computing user name for the Accounts.
const createUserName = function (accs) {
  accs.forEach(function (value, index, arr) {
    value.userName = value.owner
      .toLowerCase()
      .split(' ')
      .map((value) => value[0]) //map(function(value,index,arr){})
      .join('');
  });
};

//Accounts arr on line = 36
createUserName(accounts);
//Printing all the username from the accounts
accounts.forEach(function (acc) {
  console.log(acc.userName);
});

const updateUI = function (currentAccount) {
  //Display movements
  displayMovements(currentAccount.movements);
  //Displaying Balance
  calcDisplayBalance(currentAccount);
  //Display Summary
  calcDisplaySummary(currentAccount);
};
let currentAccount;
//Adding Event listers
btnLogin.addEventListener('click', function (event) {
  //Note: the default bahaviour of a button in a form elements is to reload the page after clicking it.
  //And here this method would prevent form from submitting after clicking submit button.
  event.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Clear input Fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); //So that we don't see the cursor blinking in input pin field.
    //Display UI and Welcome Message
    labelWelcome.textContent = `Welcome Back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = '100';
    containerApp.style.display = 'grid';
    info.style.display = 'none';

    updateUI(currentAccount);
  } else {
    containerApp.style.opacity = '0';
    containerApp.style.display = 'none';
    info.style.display = 'grid';
    labelWelcome.textContent = 'Log in to get started';
  }
});

//Function for transfering money
btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAccount = accounts.find(
    (accounts, index, arr) => inputTransferTo.value === accounts.userName
  );

  //Clearing the input fields
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  inputTransferTo.blur();

  if (
    currentAccount.balance >= amount &&
    amount > 0 &&
    recieverAccount?.userName !== currentAccount.userName
  ) {
    //Doing the transfer
    currentAccount.movements.push(-amount);
    recieverAccount.movements.push(amount);

    //Updating UI
    updateUI(currentAccount);
  } else alert(`Their is some mistake you are doing while transferring the money. Either, the amount or person you're sending`);
});

//Code for taking lone
//The rule of our bank to give loan is that the account should have atleast one deposit which is equal to the 10% of the requested loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const requestLoanAmount = Number(inputLoanAmount.value);
  if (
    requestLoanAmount > 0 &&
    currentAccount.movements.some((value) => value >= requestLoanAmount * 0.1)
  ) {
    currentAccount.movements.push(requestLoanAmount);
    updateUI(currentAccount);
  } else console.log(`You should have ${requestLoanAmount * 0.1} as deposit for loan`);
  inputLoanAmount.value = '';
});

//Writing the functinality for the close accounts part of the UI
btnClose.addEventListener('click', function (event) {
  event.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (val, index, arr) => val.userName === currentAccount.userName
    );
    //Delete User
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = '0';
  }
  //Clearing the input fields
  inputClosePin.value = inputCloseUsername.value = '';
  inputCloseUsername.blur();
  inputClosePin.blur();
});

//Calculating total amount in the accounts.
const accountMovements = accounts.map((value) => value.movements);
const allMovements = accountMovements.flat();
const overAllBalance = allMovements.reduce(
  (acc, value, i, arr) => (acc = value + acc),
  0
);
console.log(overAllBalance);

//Doing the same thing Via channing
console.log(
  accountMovements.flat().reduce((acc, value, i, arr) => (acc = value + acc), 0)
);
let sorted = false;
//Applying sorting button functinality.
btnSort.addEventListener('click', function () {
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

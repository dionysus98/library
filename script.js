"use strict";
const readBooks = document.querySelector(".status__read--value");
const pendingBooks = document.querySelector(".status__pending--value");
const totalBooks = document.querySelector(".status__total--value");

const removeBook = document.querySelector(".rempve-book");

let readValue = 0;
let pendingValue = 0;
let totalValue = 0;
let inputValues = [];
const persistData = [];

const bookContainer = document.querySelector(".container__display");

const bookFormControl = document.querySelector(".book-control");
const submitButton = document.querySelector(".btn__submit");
const inputs = document.querySelectorAll("form > input");

const generateBooks = (id, title, author, pages, status) => {
  const markUp = `
  <section class="book">
    <div class="book__text--id">
        <h2 class="book__text--header id-book" id="">${id}</h2>
     </div>
    <div class="book__text--title">
        <h2 class="book__text--header title-book" id="">${title}</h2>
     </div>
    <div class="book__text--author">
        <h2 class="book__text--header author-book" id="">${author}</h2>
     </div>
    <div class="book__text--pages">
        <h2 class="book__text--header pages-book" id="">${pages}</h2>
     </div>
    <div class="book__text--status">
        <h2 class="book__text--header status-book" id="">${status}</h2>
     </div>
    <div class="book__text--remove">
        <h2 class="book__text--header remove-book" id="">X</h2>
     </div>
    </section>
    `;
  bookContainer.insertAdjacentHTML("beforeend", markUp);
};

const storeData = (data) => {
  localStorage.setItem("books", JSON.stringify(data));
};

const getLocalData = () => {
  const data = localStorage.getItem("books");
  return JSON.parse(data);
};
class Books {
  constructor(id, title, author, pages, status) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
  }
}

if (getLocalData() !== null) {
  const localBooks = getLocalData();
  console.log(localBooks);
  localBooks.forEach((book) =>
    generateBooks(book.id, book.title, book.author, book.pages, book.status)
  );
}

bookFormControl.addEventListener("submit", function (e) {
  e.preventDefault();

  inputs.forEach((input) => {
    if (input.value === "") return;
    inputValues.push(input.value);
  });

  if (inputValues.length === 5) {
    const newBook = new Books(
      inputValues[0],
      inputValues[1],
      inputValues[2],
      inputValues[3],
      inputValues[4]
    );
    persistData.push(newBook);
    storeData(persistData);
    generateBooks(
      newBook.id,
      newBook.title,
      newBook.author,
      newBook.pages,
      newBook.status
    );
    inputValues = [];
  }
});

if (persistData.length !== 0) {
  storeData(persistData);
}

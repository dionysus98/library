import { books } from "./apiComponent.js";

const readBooks = document.querySelector(".status__read--value");
const pendingBooks = document.querySelector(".status__pending--value");
const totalBooks = document.querySelector(".status__total--value");

let readValue = 0;
let pendingValue = 0;
let totalValue = 0;
let inputValues = [];
const persistData = [];

const bookContainer = document.querySelector(".book-header");

const bookFormControl = document.querySelector(".book-control");
const submitButton = document.querySelector(".btn__submit");

const inputs = document.querySelectorAll("form > input");

let removeBook;

//~ Generate Markup
const generateBooks = (id, title, author, pages, status) => {
  const markUp = `
  <section class="book" id="${id}">
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
  bookContainer.insertAdjacentHTML("afterend", markUp);
};

//~ Local storage functions
const storeData = (data) => {
  localStorage.setItem("books", JSON.stringify(data));
};
const getLocalData = () => {
  const data = localStorage.getItem("books");
  return JSON.parse(data);
};

//~ Books class
class Books {
  constructor(id, title, author, pages, status) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
  }
}

//~ Get Data from Local Storage:
if (getLocalData() !== null) {
  const localBooks = getLocalData();
  totalBooks.textContent = localBooks.length;

  localBooks.forEach((book) =>
    generateBooks(book.id, book.title, book.author, book.pages, book.status)
  );
}

//~ Create Book:
bookFormControl.addEventListener("submit", function (e) {
  e.preventDefault();

  //` Get input Values
  inputs.forEach((input) => {
    if (input.value === "") return;
    inputValues.push(input.value);
  });

  //` create book object from input values
  if (inputValues.length === 5) {
    const newBook = new Books(
      inputValues[0],
      inputValues[1],
      inputValues[2],
      inputValues[3],
      inputValues[4]
    );

    //` persist Data into app if input values are valid
    if (persistData.length === 0 && getLocalData() !== null) {
      persistData.push(...getLocalData());
    }
    persistData.push(newBook);
    totalBooks.textContent = persistData.length;

    //` Store data in local Storage
    storeData(persistData);

    //` Display Books
    generateBooks(
      newBook.id,
      newBook.title,
      newBook.author,
      newBook.pages,
      newBook.status
    );

    //` Empty the values, for new book
    inputValues = [];
  }
});

//~ Remove Book
removeBook = document.querySelectorAll(".book__text--remove");
removeBook.forEach((book) => {
  book.addEventListener("click", (e) => {
    console.log(e.target);
    //` Get Selected book
    const curBookId = e.target.closest(".book").attributes.id.value;
    const selectedBook = document.getElementById(curBookId);

    //` Remove Selected Book
    selectedBook.remove();

    //` Get & manipulate local data
    const localData = getLocalData();
    const newData = localData.filter((data) => data.id !== curBookId);

    //` Store new data in localStorage
    localStorage.setItem("books", JSON.stringify(newData));
  });
});

// books("dom casmurro", "machado de assis");

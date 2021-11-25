import { books } from "./apiComponent.js";

const readBooks = document.querySelector(".status__read--value");
const pendingBooks = document.querySelector(".status__pending--value");
const totalBooks = document.querySelector(".status__total--value");

let inputValues = [];
const persistData = [];

const bookContainer = document.querySelector(".container__display-book");

const bookFormControl = document.querySelector(".book-control");

const inputs = document.querySelectorAll("form > input");

const bookSearchContainer = document.querySelector(".book-search");
const bookSearchInput = document.querySelector(".book-search__input");

let localBooks;
let removeBook;

//~ Generate Markup:
const generateBooks = (id, title, author, pages, status) => {
  const markUp = `
  <section class="book" id="${id}">
  <div class="book__text--id">
  <h2 class="book__text--header id-book">${id}</h2>
  </div>
  <div class="book__text--title">
  <h2 class="book__text--header title-book">${title}</h2>
  </div>
  <div class="book__text--author">
  <h2 class="book__text--header author-book">${author}</h2>
  </div>
  <div class="book__text--pages">
  <h2 class="book__text--header pages-book">${pages}</h2>
  </div>
  <div class="book__text--status">
  <h2 class="book__text--header status-book">${status}</h2>
  </div>
  <div class="book__text--remove">
  <h2 class="book__text--header remove-book">X</h2>
  </div>
  </section>
  `;
  bookContainer.insertAdjacentHTML("afterbegin", markUp);
};

//~ Local storage functions:
const storeData = (data) => {
  localStorage.setItem("books", JSON.stringify(data));
};
const getLocalData = () => {
  const data = localStorage.getItem("books");
  return JSON.parse(data);
};

//~ Books class:
class Books {
  constructor(id, title, author, pages, status) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
  }
  _checkID() {
    return localBooks.every((book) => book.id !== this.id);
  }
}

//~ Get Data from Local Storage:
if (getLocalData() !== null) {
  localBooks = getLocalData();
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
      inputValues[0].trim(),
      inputValues[1].trim(),
      inputValues[2].trim(),
      inputValues[3].trim(),
      inputValues[4].trim()
    );

    //` Guard clause : Check for unique id
    if (!newBook._checkID()) {
      inputValues = [];
      inputs.forEach((input) => {
        input.value = "";
      });
      return;
    }

    //` persist Data into app if input values are valid
    if (persistData.length === 0 && localBooks) {
      persistData.push(...localBooks);
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

    //` Select Books to Remove
    removeBook = document.querySelectorAll(".book__text--remove");
    removeBook.forEach((book) => {
      book.addEventListener("click", (e) => {
        removeBookFunction(e);
      });
    });

    //` Empty the values, for new book
    inputValues = [];
    inputs.forEach((input) => {
      input.value = "";
    });
  }
});

//~ Select Books to Remove:
removeBook = document.querySelectorAll(".book__text--remove");
removeBook.forEach((book) => {
  book.addEventListener("click", (e) => {
    removeBookFunction(e);
  });
});

//~ Remove book function:
function removeBookFunction(e) {
  //` Get Selected book
  const curBookId = e.target.closest(".book").attributes.id.value;
  const selectedBook = document.getElementById(curBookId);

  //` Remove Selected Book
  selectedBook.remove();

  //` Get & manipulate local data
  let newData;
  if (getLocalData() !== null)
    newData = getLocalData().filter((data) => data.id !== curBookId);
  else newData = persistData().filter((data) => data.id !== curBookId);

  //` Store new data in localStorage
  localStorage.setItem("books", JSON.stringify(newData));
}

// books("dom casmurro", "machado de assis");

//~ Book Search:
bookSearchContainer.addEventListener("submit", function (e) {
  e.preventDefault();
  //` Get input value
  const bookInput = bookSearchInput.value;

  //` Filter data
  const resultBook = localBooks.filter(
    (book) =>
      book.id.toLowerCase() === bookInput.toLowerCase() ||
      book.title.toLowerCase() === bookInput.toLowerCase() ||
      book.author.toLowerCase() === bookInput.toLowerCase()
  );

  //` Guard Clause: if filtered value is empty
  if (resultBook.length === 0) return (bookSearchInput.value = "");

  //` Select the filtered element
  const bookElement = document.getElementById(`${resultBook[0].id}`);

  //` Highlight the selceted element
  bookElement.closest(".book").scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
  bookElement.style.backgroundColor = "#379683";
  bookSearchInput.value = "";

  //` Remove highlighting
  setTimeout(() => {
    bookElement.style.backgroundColor = "#8ee4af";
  }, 4000);
});

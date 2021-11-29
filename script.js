import { books } from "./apiComponent.js";
import { dragElement } from "./layoutComponent.js";

const readBooks = document.querySelector(".status__read--value");
const pendingBooks = document.querySelector(".status__pending--value");
const totalBooks = document.querySelector(".status__total--value");
const statusInput = document.querySelector("#status");

const bookContainer = document.querySelector(".container__display-book");
const bookFormControl = document.querySelector(".book-control");

const bookSearchContainer = document.querySelector(".book-search");
const bookSearchInput = document.querySelector(".book-search__input");

const inputs = document.querySelectorAll("form > input");

let inputValues = [];
const persistData = [];

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
  //` update user reading log
  updateBookLog();
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
      inputValues[0].trim().toLowerCase(),
      inputValues[1].trim().toLowerCase(),
      inputValues[2].trim().toLowerCase(),
      inputValues[3].trim().toLowerCase(),
      inputValues[4].trim().toLowerCase()
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
    localBooks.push(newBook);
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

    //` update user reading log
    updateBookLog();

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

    //` refresh
    location.reload();
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
  if (localBooks !== null)
    newData = localBooks.filter((data) => data.id !== curBookId);
  else newData = persistData().filter((data) => data.id !== curBookId);

  //` Store new data in localStorage
  storeData(newData);
  location.reload();
}

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

//~ Set book status
statusInput.addEventListener("click", () => {
  //` Display options:
  document.querySelector(".dropdown").classList.remove("hidden");
  document.querySelectorAll(".dropdown-text").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      //` select option:
      statusInput.value = e.target.textContent;
      document.querySelector(".dropdown").classList.add("hidden");
    });
  });
});

//~ update status function
const statusUpdate = (id, newStatus) => {
  localBooks.forEach((book) => {
    if (book.id === id) {
      book.status = newStatus;
    }
  });
};

//~ Update book status
document.querySelectorAll(".status-book").forEach((book) => {
  book.closest(".book__text--status").addEventListener("click", (e) => {
    //` Get data
    const text = book.textContent;
    const bookId = e.target.closest(".book").attributes.id.value;

    //` change status
    if (text.toUpperCase() === "COMPLETED") {
      book.textContent = "PENDING";
      statusUpdate(bookId, "pending");
      readBooks.textContent = 1 * readBooks.textContent - 1;
      pendingBooks.textContent = 1 * pendingBooks.textContent + 1;
    } else if (text.toUpperCase() === "PENDING") {
      book.textContent = "COMPLETED";
      statusUpdate(bookId, "completed");
      readBooks.textContent = 1 * readBooks.textContent + 1;
      pendingBooks.textContent = 1 * pendingBooks.textContent - 1;
    } else {
      book.textContent = "COMPLETED";
    }

    //` store data to localStorage
    storeData(localBooks);
  });
});

//~ update function - pending and completed book:
function updateBookLog() {
  localBooks.forEach((book) => {
    if (book.status === "completed") {
      readBooks.textContent = 1 * readBooks.textContent + 1;
    }
    if (book.status === "pending") {
      pendingBooks.textContent = 1 * pendingBooks.textContent + 1;
    }
  });
}

//~ Fetch Book from API
document.querySelectorAll(".title-book").forEach((book) =>
  book.closest(".book__text--title").addEventListener("click", function (e) {
    const target = e.target.textContent.trim();
    const bookSelected = localBooks.find((book) => target === book.title);
    (async () => {
      try {
        const bookFetched = await books(
          `${bookSelected.title}`,
          `${bookSelected.author}`
        );
        const book = {
          title: bookFetched.title || "",
          authors: bookFetched.authors || "",
          categories: bookFetched.categories || "",
          imageLinks: bookFetched.imageLinks || "",
          description: bookFetched.description || "",
          pageCount: bookFetched.pageCount || "",
          previewLink: bookFetched.previewLink || "",
          publishedDate: bookFetched.publishedDate || "",
        };
        generateBookPreview(book);
        document
          .querySelector(".container__display-preview")
          .classList.remove("hidden");
      } catch (err) {
        console.log(err.message);
      }
    })();
  })
);

function generateBookPreview(book) {
  const markup = `
  <div class="preview__header">
  <h3 class="preview__title">${book.title}</h3>
  <p class="preview__btn-close">X</p>
  </div>
  <div class="preview__thumbnail">
  <img
  src=${book.imageLinks.thumbnail}
  alt=""
  class="thumbnail__img"
  width="40%"
  />
  </div>
  <div class="preview__details">
  <p class="preview__content">
  Author: <span class="preview__text">${book.authors}</span>
  </p>
  <p class="preview__content">
  Category: <span class="preview__text">${book.categories}</span>
  </p>
  <p class="preview__content">
  Description: <span class="preview__text">${book.description}</span>
  </p>
  <p class="preview__content">
  Pages: <span class="preview__text">${book.pageCount}</span>
    </p>
    <p class="preview__content">
    Published Date: <span class="preview__text">${book.publishedDate}</span>
    </p>
    <p class="preview__content preview__link">
    Preview Link: <span class="preview__text preview__link-text">${book.previewLink}</span>
    </p>
    </div>
    `;
  document
    .querySelector(".container__display-previewheader")
    .insertAdjacentHTML("afterbegin", markup);

  dragElement(document.querySelector(".container__display-preview"));

  document
    .querySelector(".preview__btn-close")
    .addEventListener("click", () => {
      document
        .querySelector(".container__display-preview")
        .classList.add("hidden");
    });
}

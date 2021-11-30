import { dragElement } from "./layoutComponent.js";

//~ Fetch book from API
export const books = async (title, author) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}&key=AIzaSyA1Ci5u6z7Im-pWKx9JIJiKP2_H99Ok7lg`
    );
    const data = await response.json();
    const [items] = data.length >= 1 ? [...data.items] : [data];

    const bookFetched = items.items[0].volumeInfo;
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

    //` Display Fetched books
    generateBookPreview(book);
    document
      .querySelector(".container__display-preview")
      .classList.remove("hidden");
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

//` Display Books function
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
    Preview Link: <a target="_blank" href="${book.previewLink}" class="preview__text preview__link-text">Click</a>
    </p>
    </div>
    `;
  //` Add book to Dom
  document
    .querySelector(".container__display-previewheader")
    .insertAdjacentHTML("afterbegin", markup);

  //` make it an Dragaable Element
  dragElement(document.querySelector(".container__display-preview"));

  //` Add preview Close Feature
  document
    .querySelector(".preview__btn-close")
    .addEventListener("click", () => {
      document
        .querySelector(".container__display-preview")
        .classList.add("hidden");
    });
}

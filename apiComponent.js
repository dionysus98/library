let searchResult;
export const books = async (title, author) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}&key=AIzaSyA1Ci5u6z7Im-pWKx9JIJiKP2_H99Ok7lg`
    );
    const data = await response.json();
    // console.log(data.items);
    const items = [...data.items];
    searchResult = items[1].volumeInfo;
    // items.forEach((item) => {
    //   console.log(item);
    // });
    console.log(searchResult.imageLinks.thumbnail);
    console.log(searchResult);
  } catch (err) {
    console.log(err.message);
  }
};

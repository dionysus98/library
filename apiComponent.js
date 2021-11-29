export const books = async (title, author) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}&key=AIzaSyA1Ci5u6z7Im-pWKx9JIJiKP2_H99Ok7lg`
    );
    const data = await response.json();
    const [items] = data.length >= 1 ? [...data.items] : [data];
    return items.items[0].volumeInfo;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

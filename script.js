document.addEventListener("DOMContentLoaded", function () {
  const inputBookForm = document.getElementById("inputBook");
  const searchBookForm = document.getElementById("searchBook");
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  function createBook(id, title, author, year, isComplete) {
    return {
      id,
      title,
      author,
      year,
      isComplete,
    };
  }

  function renderBookItem(book, shelf) {
    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item");
    bookItem.innerHTML = `
          <h3>${book.title}</h3>
          <p>Penulis: ${book.author}</p>
          <p>Tahun: ${book.year}</p>
          <div class="action">
            <button class="green" onclick="moveBook('${
              book.id
            }', ${!book.isComplete})">${
      book.isComplete ? "Belum selesai di Baca" : "Selesai dibaca"
    }</button>
            <button class="red" onclick="deleteBook('${
              book.id
            }')">Hapus buku</button>
          </div>
        `;
    if (shelf === "incomplete") {
      incompleteBookshelfList.appendChild(bookItem);
    } else {
      completeBookshelfList.appendChild(bookItem);
    }
  }

  function renderBooks() {
    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";

    const allBooks = getStoredBooks();
    allBooks.forEach((book) => {
      renderBookItem(book, book.isComplete ? "complete" : "incomplete");
    });
  }

  window.moveBook = function (bookId, isComplete) {
    const allBooks = getStoredBooks();
    const updatedBooks = allBooks.map((book) => {
      if (book.id == bookId) {
        return { ...book, isComplete };
      }
      return book;
    });
    updateStoredBooks(updatedBooks);
    renderBooks();
    console.log(`Book moved: ${bookId}, isComplete: ${isComplete}`);
  };

  window.deleteBook = function (bookId) {
    const allBooks = getStoredBooks();
    const updatedBooks = allBooks.filter((book) => book.id != bookId);
    updateStoredBooks(updatedBooks);
    renderBooks();
    console.log(`Book deleted: ${bookId}`);
  };

  function addBook(title, author, year, isComplete) {
    const allBooks = getStoredBooks();
    const newBook = createBook(+new Date(), title, author, year, Number(year), isComplete);

    if (!isPositiveInteger(year)) {
      alert("Masukkan tahun yang valid !!");
      return;
    }

    allBooks.push(newBook);
    updateStoredBooks(allBooks);
    renderBooks();
    console.log("Book added:", newBook);
  }

  function isPositiveInteger(value) {
    return /^\d+$/.test(value) && parseInt(value, 10) > 0;
  }

  function getStoredBooks() {
    const storedBooks = localStorage.getItem("books");
    return storedBooks ? JSON.parse(storedBooks) : [];
  }

  function updateStoredBooks(books) {
    localStorage.setItem("books", JSON.stringify(books));
  }

  inputBookForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = Number(document.getElementById("inputBookYear").value); // Perkara anda saya NT !! :)
    const isComplete = document.getElementById("inputBookIsComplete").checked;

    addBook(title, author, year, isComplete);

    document.getElementById("inputBookTitle").value = "";
    document.getElementById("inputBookAuthor").value = "";
    document.getElementById("inputBookYear").value = "";
    document.getElementById("inputBookIsComplete").checked = false;
  });

  function searchBooks(query) {
    const allBooks = getStoredBooks();
    const searchResults = allBooks.filter((book) => {
      const titleMatch = book.title.toLowerCase().includes(query.toLowerCase());
      const authorMatch = book.author
        .toLowerCase()
        .includes(query.toLowerCase());
      return titleMatch || authorMatch;
    });
    return searchResults;
  }

  searchBookForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const searchQuery = document.getElementById("searchBookTitle").value;
    const searchResults = searchBooks(searchQuery);
    renderSearchResults(searchResults);
  });

  function renderSearchResults(results) {
    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";

    results.forEach((book) => {
      renderBookItem(book, book.isComplete ? "complete" : "incomplete");
    });
  }

  searchBookForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const searchQuery = document.getElementById("searchBookTitle").value;
    const searchResults = searchBooks(searchQuery);
    renderSearchResults(searchResults);
    console.log("Search results:", searchResults);
  });

  renderBooks();
});

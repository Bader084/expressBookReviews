const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user_exists = users.some(user => user.username === username);
  if (user_exists) {
    res.status(400).send({ message: 'Username already taken' });
  } else {
    users.push({ username: username, password: password });
    res.status(200).send({ message: 'Account successfully created!' });
  }
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    const result = await JSON.stringify(books);
    res.send(await result);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn =  await req.params.isbn;
    await res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = await req.params.author;
    let booksByAuthor = [];
    const keys = await Object.keys(books);
    for (const key of keys) {
      if (books[key].author === author) {
        await booksByAuthor.push(books[key]);
      }
    }
    if (booksByAuthor.length === 0) {
      await res.status(404).json({ message: 'No books found for this author.' });
      return;
    }
    await res.status(200).json(booksByAuthor);
  });
  

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = await req.params.title;
    let booksByTitle = [];
    const keys = await Object.keys(books);
    for (const key of keys) {
      if (books[key].title === title) {
        await booksByTitle.push(books[key]);
      }
    }
    if (booksByTitle.length === 0) {
      await res.status(404).json({ message: 'No books found for this title.' });
      return;
    }
    await res.status(200).json(booksByTitle);
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn] && books[isbn].review) {
        res.status(200).send(books[isbn].review.review);
    } else {
        res.status(404).send({message: 'this book does not contain any review for the moment.'});
    }
});


module.exports.general = public_users;
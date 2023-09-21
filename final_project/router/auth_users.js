const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Store the result of the find method in a variable
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        const token = jwt.sign({ id: user.id, username: user.username }, "SECRET_KEY", {
        expiresIn: "1h"});
        req.session.authorization = { accessToken: token };
        req.session.save();
        return res.status(200).json({message: 'Logged in successfully', token: token});
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

const validateToken = (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).json({ message: "No token provided." });

    jwt.verify(token, "access", (err, user) => {
        if (err) return res.status(401).json({ message: "Invalid token." });
        req.user = user;
        next();
    });
};

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user.username;

    if (!books[isbn]) {
        return res.status(400).json({ message: "Invalid ISBN." });
    }

    if (!review) {
        return res.status(400).json({ message: "Review content is missing." });
    }

    // Update or create review
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review successfully added/updated." });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;
    if (!books[isbn]) {
        return res.status(400).json({ message: "Invalid ISBN." });
    }
    if (!books[isbn].reviews) {
        return res.status(400).json({ message: "No reviews to delete." });
    }
    if (!books[isbn].reviews[username]) {
        return res.status(400).json({ message: "You haven't reviewed this book." });
    }

    delete books[isbn].reviews[username];
    
    return res.status(200).json({ message: "Review successfully deleted." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
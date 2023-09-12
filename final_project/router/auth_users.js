const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    // Define a regular expression for a valid username format (for example, allowing letters and numbers)
    const usernameRegex = /^[a-zA-Z0-9]+$/;

    // Test the provided username against the regex
    return usernameRegex.test(username);
};


// Define a secret key for JWT
const secretKey = 'extremelySecretKey'; // Replace with your actual secret key

// Define a function to validate user credentials
const authenticateUser = (username, password) => {
    // Find the user with the provided username
    const user = users.find((user) => user.username === username);

    // Check if the user exists and the password matches (you should hash passwords in a production application)
    if (user && user.password === password) {
        return true;
    }
    return false;
};

// Login route
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if both username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Both username and password are required" });
    }

    // Validate user credentials
    if (authenticateUser(username, password)) {
        // Generate a JWT token
        const token = jwt.sign({ username }, secretKey);

        // Set the session user with the username and token
        req.session.user = { username, token };

        return res.status(200).json({ message: "Login successful", token });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    // Retrieve the ISBN from request parameters
    const isbn = req.params.isbn;
    // Retrieve the review and username from the request body
    const { review } = req.body;
    const username = req.session.username;

    // Check if the ISBN exists in the books database
    if (books[isbn]) {
        // Check if the book already has a review by the current user
        if (books[isbn].reviews[username]) {
            // Modify the existing review
            books[isbn].reviews[username] = review;
            return res.status(200).json({ message: "Review updated successfully" });
        } else {
            // Add a new review by the current user
            books[isbn].reviews[username] = review;
            return res.status(201).json({ message: "Review added successfully" });
        }
    } else {
        // Book not found, send a 404 Not Found response
        return res.status(404).json({ message: "Book not found" });
    }
});

//Delete review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Retrieve the ISBN from request parameters
    const isbn = req.params.isbn;
    const username = req.session.username;

    // Check if the ISBN exists in the books database
    if (books[isbn]) {
        // Check if the book has a review by the current user
        if (books[isbn].reviews[username]) {
            // Delete the review by the current user
            delete books[isbn].reviews[username];
            return res.status(200).json({ message: "Review deleted successfully" });
        } else {
            // Review by the current user not found, send a 404 Not Found response
            return res.status(404).json({ message: "Review not found" });
        }
    } else {
        // Book not found, send a 404 Not Found response
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

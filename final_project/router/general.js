const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req, res) => {
    // Retrieve the username and password from the request body
    const { username, password } = req.body;

    // Check if both username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Both username and password are required" });
    }

    // Check if the username already exists
    if (users.find(user => user.username === username)) {
        return res.status(409).json({ message: "Username already exists" });
    }

    // Check if the username is valid (you can use your own validation logic)
    if (!isValid(username)) {
        return res.status(400).json({ message: "Invalid username format" });
    }

    // Add the new user to the users array (you can also hash the password here for security)
    users.push({ username, password });

    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    // Convert the books object into an array of books
    const bookList = Object.values(books);

    // Format the JSON response with two-space indentation for neatness
    const formattedResponse = JSON.stringify({ books: bookList }, null, 2);

    // Set the response content type to JSON
    res.setHeader('Content-Type', 'application/json');

    // Return the formatted JSON response
    res.status(200).send(formattedResponse);
});

// Get the list of books available in the shop using Axios and Promise callbacks
public_users.get('/promise/books', function (req, res) {
    axios.get('https://rehankhalid5-5000.theiadocker-3-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/') // Replace with your actual API endpoint
        .then((response) => {
            // Extract the book list from the API response
            const bookList = response.data.books;

            // Format the JSON response with two-space indentation for neatness
            const formattedResponse = JSON.stringify({ books: bookList }, null, 2);

            // Set the response content type to JSON
            res.setHeader('Content-Type', 'application/json');

            // Return the formatted JSON response
            res.status(200).send(formattedResponse);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    // Retrieve the title from request parameters
    const title = req.params.title;

    // Initialize an array to store books with the matching title
    const matchingBooks = [];

    // Iterate through the keys of the 'books' object
    for (const isbn in books) {
        if (books.hasOwnProperty(isbn)) {
            const book = books[isbn];
            if (book.title.toLowerCase().includes(title.toLowerCase())) {
                // If the title contains the provided keyword (case-insensitive), add the book to the matchingBooks array
                matchingBooks.push(book);
            }
        }
    }
    // Check if any books with the title were found
    if (matchingBooks.length > 0) {
        // Books found, send their details as a JSON response
        res.status(200).json({ books: matchingBooks });
    } else {
        // No books with the title found, send a 404 Not Found response
        res.status(404).json({ message: "No books found with the title" });
    }
});
// Get book details based on title using Axios and Promise callbacks
public_users.get('/promise/title/:title', function (req, res) {
    const title = req.params.title;

    axios.get(`https://rehankhalid5-5000.theiadocker-3-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/title/${title}`) // Replace with your actual API endpoint
        .then((response) => {
            const matchingBooks = response.data.books;

            if (matchingBooks && matchingBooks.length > 0) {
                res.status(200).json({ books: matchingBooks });
            } else {
                res.status(404).json({ message: "No books found with the title" });
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        });
});
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    // Retrieve the ISBN from request parameters
    const isbn = req.params.isbn;

    // Check if the book with the given ISBN exists
    if (books[isbn]) {
        // Book found, send its details as JSON response
        const bookDetails = books[isbn];
        res.status(200).json({ book: bookDetails });
    } else {
        // Book not found, send a 404 Not Found response
        res.status(404).json({ message: "Book not found" });
    }
});

// Get book details based on ISBN using Axios and Promise callbacks
public_users.get('/promise/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    axios.get(`https://rehankhalid5-5000.theiadocker-3-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/${isbn}`) // Replace with your actual API endpoint
        .then((response) => {
            const bookDetails = response.data.book;

            if (bookDetails) {
                res.status(200).json({ book: bookDetails });
            } else {
                res.status(404).json({ message: "Book not found" });
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        });
});
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    // Retrieve the author from request parameters
    const author = req.params.author;

    // Initialize an array to store books with the matching author
    const matchingBooks = [];

    // Iterate through the keys of the 'books' object
    for (const isbn in books) {
        if (books.hasOwnProperty(isbn)) {
            const book = books[isbn];
            if (book.author === author) {
                // If the author matches, add the book to the matchingBooks array
                matchingBooks.push(book);
            }
        }
    }

    // Check if any books with the author were found
    if (matchingBooks.length > 0) {
        // Books found, send their details as a JSON response
        res.status(200).json({ books: matchingBooks });
    } else {
        // No books with the author found, send a 404 Not Found response
        res.status(404).json({ message: "No books found for the author" });
    }
});

// Get book details based on author using Axios and Promise callbacks
public_users.get('/promise/author/:author', function (req, res) {
    const author = req.params.author;

    axios.get(`https://rehankhalid5-5000.theiadocker-3-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/author/${author}`) // Replace with your actual API endpoint
        .then((response) => {
            const matchingBooks = response.data.books;

            if (matchingBooks && matchingBooks.length > 0) {
                res.status(200).json({ books: matchingBooks });
            } else {
                res.status(404).json({ message: "No books found for the author" });
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        });
});
//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    // Retrieve the ISBN from request parameters
    const isbn = req.params.isbn;

    // Check if the book with the given ISBN exists
    if (books[isbn]) {
        // Book found, retrieve its reviews (assuming reviews are stored in the 'reviews' property of the book object)
        const bookReviews = books[isbn].reviews;

        // Send the book reviews as a JSON response
        res.status(200).json({ reviews: bookReviews });
    } else {
        // Book not found, send a 404 Not Found response
        res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;

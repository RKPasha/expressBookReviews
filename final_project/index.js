const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"extremelySecretKey",resave: true, saveUninitialized: true}))

// Define your authentication middleware
app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if a user is authenticated based on their session
    if (req.session && req.session.user) {
      // User is authenticated
      next();
    } else {
      // User is not authenticated, return an error
      res.status(401).json({ message: "Unauthorized" });
    }
  });
 
const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
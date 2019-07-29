// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const morgan = require('morgan');
const cookieSession = require("cookie-session");


// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users_router");
const restaurantsRoutes = require("./routes/restaurants_router");
const dishesRoutes = require("./routes/dishes_router");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/users", usersRoutes(db));
app.use("/restaurants", restaurantsRoutes(db));
app.use("/dishes", dishesRoutes(db));
// Note: mount other resources here, using the same pattern above


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (request, response) => {
  if (!request.session.user_id) {
    response.render("index", { user: false });
  } else {
    response.render("index", { user: true });
  }
});

app.post("/login", (request, response) => {
  const userId = request.body.user;
  request.session.user_id = userId;
  console.log(userId);
  if (userId == 4) {
    console.log("I HAVE REACHED RESTO endpoint");
    response.redirect("/restaurants")
  } else {
    console.log("I HAVE REACHED USERS endpoint");
    response.redirect(`/users/${userId}`)
  }
});

app.post("/logout", (request, response) => {
  request.session = null;
  response.redirect("/");
});

// /logout
// empty cookies and redirect to /

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

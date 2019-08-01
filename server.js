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

var http = require('http').createServer(app);
var io = require('socket.io')(http);



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
app.use("/users", usersRoutes(db, io));
app.use("/restaurants", restaurantsRoutes(db, io));
app.use("/dishes", dishesRoutes(db));
// Note: mount other resources here, using the same pattern above




// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (request, response) => {
  const userId = request.session.user;
  const queryConfig = {
    text: `
    SELECT name FROM users WHERE id = $1
    `,
    values: [userId]
  }
  db.query(queryConfig)
    .then((queryResponse) => {
      const userName = queryResponse.rows[0].name;
      if (!userName) {
        response.render("index", { user: userName });
      } else {
        response.render("index", { user: userName });
      }
    })
    .catch((error) => {
      response.render('index', { user: false })
    });
});

app.post("/login", (request, response) => {
  const userName = request.body.user;
  const queryConfig = {
    text: `
      SELECT id AS user_id FROM users WHERE name = $1
    `,
    values: [userName]
  }
  db.query(queryConfig)
    .then((queryResponse) => {
      const userId = queryResponse.rows[0].user_id;
      request.session.user = userId; // set unique cookie for each user using
      // their id so that two users with the same name don't get the same cookie
      if (Number(userId) !== 4) {
        response.redirect(`/`)
      } else {
        response.redirect(`/restaurants`)
      }
    })
    .catch((error) => {
      response.redirect(`/`);
    })

});

app.post("/logout", (request, response) => {
  request.session = null;
  response.redirect("/");
});

io.on('connection', function(socket) {
  console.log('a user connected');
});

// /logout
// empty cookies and redirect to /

http.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

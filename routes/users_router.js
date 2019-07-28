/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // show the current status of user's order
  router.get("/:id", (request, response) => {
    const user = request.params.id;
    db.query(`SELECT * FROM orders WHERE user_id = ${user};`)
      .then(data => {
        let orders = data.rows;
        response.render("user", { user, orders })
      });
  });

  // router.get("/all", (req, res) => {
  //   db.query(`SELECT * FROM users;`)
  //     .then(data => {
  //       const users = data.rows;
  //       res.json({ users });
  //     })
  //     .catch(err => {
  //       res
  //         .status(500)
  //         .json({ error: err.message });
  //     });
  // });

  return router;
};

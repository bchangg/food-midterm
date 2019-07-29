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
    db.query(`
      SELECT * FROM orders
      JOIN orders_details ON orders.id = order_id
      JOIN dishes ON dishes.id = dish_id
      WHERE user_id = ${user};
    `)
      .then(orderData => {
        let orders = orderData.rows;
        db.query(`
        SELECT order_status, user_id
        FROM orders
        WHERE user_id = ${user};
        `)
        .then(orderStatusData => {
          let status = orderStatusData.rows;
          response.render("user", { user, orders, status })
        })
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

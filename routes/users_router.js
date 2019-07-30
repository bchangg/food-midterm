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
    const userId = request.params.id;
    const queryConfig = {
      text: `SELECT name FROM users WHERE id = $1`,
      values: [userId]
    }

    db.query(queryConfig)
      .then((queryResponse) => {
        const user = queryResponse.rows[0].name;
        if (user) {
          db.query(`
            SELECT * FROM orders
            JOIN orders_details ON orders.id = order_id
            JOIN dishes ON dishes.id = dish_id
            WHERE user_id = ${userId};
          `)
            .then(orderData => {
              let orders = orderData.rows;
              db.query(`
                SELECT id, order_status, user_id
                FROM orders
                WHERE user_id = ${userId};
              `)
                .then(orderStatusData => {
                  console.log('I HAVE AREACEHD');
                  let status = orderStatusData.rows;
                  response.render("user", { user, orders, status })
                })
                .catch((error) => {
                  console.error(`query error on status`, error.stack);
                })
            })
            .catch((error) => {
              console.error(`query error on order retrieval`, error.stack);
            })

        }
        // response.render('user', { user, orders, status })
      })
      .catch((error) => {
        reponse.redirect(`/`);
      });
  });

  // router.get("/:id", (request, response) => {
  //   const userId = request.params.id;
  //   const queryConfig = {
  //     text: `SELECT name FROM users WHERE id = $1`,
  //     values: [userId]
  //   }
  //
  //   db.query(queryConfig)
  //     .then((queryResponse) => {
  //       console.log(queryResponse.rows);
  //       const userName = queryResponse.rows[0].name;
  //       console.log(userName);
  //       response.render('user', { user: userName })
  //     })
  //     .catch((error) => {
  //       reponse.redirect(`/`);
  //     });
  // });

  // router.get("/", (req, res) => {
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

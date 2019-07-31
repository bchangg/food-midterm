const express = require('express');
const router = express.Router();
const { queryConfig, getOrdersPerUser, getItemsPerUser } = require('../query/userQueries');

module.exports = (db) => {
  //coundown timer
  router.get("/", (request, response) => {
    db.query(`
      SELECT order_id, orders.created_at, sum(order_duration)
      FROM orders_details JOIN orders ON orders.id = order_id
      GROUP BY order_id, orders.created_at;
    `).then(data => {
      response.json(data.rows)
    }).catch((error) => {
      response.status(500).json({ error: error })
    })
  });

  // show the current status of user's order
  router.get("/:id", (request, response) => {
    const userId = request.params.id;
    queryConfig(db, userId)
      .then(user => {
        if (user) {
          getOrdersPerUser(db, userId)
            .then(orders => {
              getItemsPerUser(db, userId)
                .then(status => {
                  response.render("user", { user, orders, status })
                })
            })
        }
      })
      .catch((error) => {
        console.error(`query error on order retrieval`, error.stack);
        reponse.redirect(`/`);
      });
  });

  // the post request will change the order_status to 'Cancelled' in the database
  router.post("/", (request, response) => {
    const orderId = request.body.order_id;
    const user = request.body.user_id;
    db.query(`
      SELECT id, order_status, user_id
      FROM orders
      WHERE id = ${orderId}
      `).then(data => {
      if (data.rows[0].order_status !== 'Pending') {
        return response.redirect(`/users/${user}`)
      }
      db.query(`
          UPDATE orders
          SET order_status = 'Cancelling'
          WHERE id = ${orderId}
          RETURNING *;
        `).then(data => {
        response.redirect(`/users/${user}`)
      })
        .catch(err => {
          console.log('error:', err);
          response.status(500)
            .json({ error: err.message });
        });

    });

  })


  return router;
};

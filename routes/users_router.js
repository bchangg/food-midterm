const express = require('express');
const router = express.Router();
const timeClock = require('../public/scripts/countdownTimer')
const { queryConfig, getOrdersPerUser, getItemsPerUser } = require('../query/userQueries');


module.exports = (db) => {
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
    const cancelOrder = `
    UPDATE orders
    SET order_status = 'Cancelled'
    WHERE id = ${orderId}
    RETURNING *;
    `
    const user = request.body.user_id;
    db.query(cancelOrder)
      .then(data => {
        response.redirect(`/users/${user}`)
      })
      .catch(err => {
        console.log('error:', err);
        response.status(500)
          .json({ error: err.message });
      });
    });

  router.get("/timer", (request, response) => {
    const userId = request.params.id;
    db.query(`
      SELECT order_duration
      FROM orders_details
      WHERE user_id = ${userId}
    `).then(data => {
      console.log(data.rows)
      timeClock();
    })

  });


  return router;
};

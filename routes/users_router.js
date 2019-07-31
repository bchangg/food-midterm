const express = require('express');
const router = express.Router();
const { seedOrdersTableWithUserId, getUserIdFromName, getNameFromUserId, getOrdersPerUser, getItemsPerUser } = require('../query/userQueries');

module.exports = (db) => {
  router.post('/', (request, response) => {
    getUserIdFromName(db, [request.body.currentUsername])
      .then((queryResponse) => {
        response.redirect(`/users/${queryResponse.rows[0].id}`);
      })
      .catch((error) => {
        response.redirect('/');
      });
  });

  router.post('/:userName/placeOrder', (request, response) => {
    getUserIdFromName(db, request.params.userName)
      .then((userId) => {
        if (userId) {
          return seedOrdersTableWithUserId(db, userId)
        }
      })
      .then((userAndOrderId) => {
        // insert into orders table with user id
        console.log(userAndOrderId);
      })

  })

  //coundown timer
  router.get("/", (request, response) => {
    console.log('entered users/ route');
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

    getNameFromUserId(db, userId)
      .then(user => {
        if (user) {
          getOrdersPerUser(db, userId)
            .then(orders => {
              getItemsPerUser(db, userId)
                .then(status => {
                  response.render("user", { user, orders, status });
                });
            })
        }
      })
      .catch((error) => {
        console.error(`query error on order retrieval`, error.stack);
        reponse.redirect(`/`);
      });
  });

  // the post request will change the order_status to 'Cancelled' in the database
  router.post("/cancel", (request, response) => {
    const orderId = request.body.order_id;
    const user = request.body.user_id;
    db.query(`
        SELECT id, order_status, user_id
        FROM orders
        WHERE id = ${orderId}
      `)
      .then(data => {
        console.log(data);
        if (data.rows[0].order_status !== 'Pending') {
          response.redirect(`/users/${user}`)
        }
        db.query(`
              UPDATE orders
              SET order_status = 'Cancelled'
              WHERE id = ${orderId}
              RETURNING *;
            `)
          .then(data => {
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

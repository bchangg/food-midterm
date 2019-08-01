const express = require('express');
const router = express.Router();
const { updateOrdersTableWIthTotalPriceTotalDuration, seedOrdersDetailsTableWithCurrentOrderReturningOrderId, seedOrdersTableWithUserIdReturningOrderId, getUserIdFromName, getNameFromUserId, getOrdersPerUser, getItemsPerUser } = require('../query/userQueries');

module.exports = (db, io) => {
  router.post('/', (request, response) => {
    getUserIdFromName(db, request.body.currentUsername)
      .then((queryResponse) => {
        response.redirect(`/users/${queryResponse}`);
      })
      .catch((error) => {
        console.log(error);
        response.redirect('/');
      });
  });

  router.post('/:userName/placeOrder', (request, response) => {
    const currentOrder = request.body;
    let currentUserId;
    // use request.body['foodId'] to access the request body
    getUserIdFromName(db, request.params.userName)
      .then((userId) => {
        // insert into orders table with user id if user exists
        if (userId) {
          currentUserId = userId;
          return seedOrdersTableWithUserIdReturningOrderId(db, userId)
        }
      })
      .then((orderId) => {
        // got the user and order id from orders table, now can seed into orders details with current order object (currentOrder)
        // insert orderId, dishId, dishQuantity x dishDuration, dishQuantity x dishPrice into orders details
        let promiseToFindOrderId;
        for (let dish in currentOrder) {
          promiseToFindOrderId = seedOrdersDetailsTableWithCurrentOrderReturningOrderId(db,
            [dish,
              orderId,
              currentOrder[dish].quantity * currentOrder[dish].duration,
              currentOrder[dish].quantity * currentOrder[dish].price,
              currentOrder[dish].quantity
            ]);
        }
        io.emit('updateOrders', { for: 'everyone' });
        return promiseToFindOrderId;
      })
      .then((queryResponse) => {
        updateOrdersTableWIthTotalPriceTotalDuration(db, queryResponse.rows[0].order_id);
        response.send(`/users/${currentUserId}`);
      })
      .catch((error) => {
        console.error(`query access error`, error.stack);
      })

  })

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
    getNameFromUserId(db, userId)
      .then(user => {
        console.log(`user user user user user`, user)
        if (user) {
          getOrdersPerUser(db, userId)
            .then(orders => {
              getItemsPerUser(db, userId)
                .then(status => {
                  response.render("user", { user, userId, orders, status });
                });
            })
        }
      })
      .catch((error) => {
        console.error(`query error on order retrieval`, error.stack);
        reponse.redirect(`/`);
      });
  });
  // show user's order history
  router.get("/:id/history", (request, response) => {
    const userId = request.params.id;

    getNameFromUserId(db, userId)
      .then(user => {
        if (user) {
          getOrdersPerUser(db, userId)
            .then(orders => {
              getItemsPerUser(db, userId)
                .then(status => {
                  response.render("user_history", { user, userId, orders, status });
                });
            })
        }
      })
      .catch((error) => {
        console.error(`query error on order retrieval`, error.stack);
        reponse.redirect(`/`);
      });
  });
  // the post request will change the order_status to 'Cancelling' in the database
  router.post("/cancel", (request, response) => {
    const orderId = request.body.order_id;
    const user = request.body.user_id;

    db.query(`
        SELECT id, order_status, user_id
        FROM orders
        WHERE id = ${orderId}
      `)
      .then(data => {
        if (data.rows[0].order_status !== 'Pending') {
          return response.redirect(`/users/${user}`)
        }
        db.query(`
              UPDATE orders
              SET order_status = 'Cancelling'
              WHERE id = ${orderId}
              RETURNING *;
            `)
          .then(data => {
            io.emit('updateStatusFieldAfterCancel', { for: 'everyone' });
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

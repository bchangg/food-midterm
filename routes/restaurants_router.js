const express = require('express');
const router = express.Router();
const { getPendingAndInProgressOrders, getItemsPerOrder, updateOrderStatus, checkDb } = require('../query/restaurantQueries');

module.exports = (db) => {
  router.get("/", (req, res) => {

    getPendingAndInProgressOrders(db)
      .then((orders) => {
        getItemsPerOrder(db)
          .then(items => {
            res.render("restaurantCurOrders", { user: true, orders, items });
          })
      })
      .catch(err => {
        console.log('error:', err);
        res.status(500)
          .json({ error: err.message });
      });
  });

  router.get('/order', (req, res) => {
    getPendingAndInProgressOrders(db)
      .then((orders) => {
        getItemsPerOrder(db)
          .then(items => {
            res.render("restaurantCurOrders", { user: true, orders, items });
          })
      })
      .catch(err => {
        console.log('error:', err);
        res.status(500)
          .json({ error: err.message });
      });
  });

  router.post("/", (request, response) => {
    const orderId = request.body.order_id;
    const orderStatus = request.body.current_status;
    checkDb(db, [orderId, orderStatus])
      .then(data => {
        if (data) {
          updateOrderStatus(db, request)
            .then(() => {
              response.redirect("/restaurants")
            })
            .catch(err => {
              console.log('error:', err);
              response.status(500)
                .json({ error: err.message });
            });
        } else {
          response.redirect("/restaurants");
        }
      })

  });

  return router;
};

const express = require('express');
const router = express.Router();
const { getPendingAndInProgressOrders, getItemsPerOrder, updateOrderStatus } = require('../query/restaurantQueries');



module.exports = (db) => {
  router.get("/", (req, res) => {
    // render order status
    console.log("I HAVE REACHED RESTO page");

    getPendingAndInProgressOrders(db)
      .then((orders) => {
        getItemsPerOrder(db).then(items => {
          res.render("restaurant", { user: true, orders, items });
        })
      })
      .catch(err => {
        console.log('error:', err);
        res.status(500)
          .json({ error: err.message });
      });
  });

  router.post("/", (request, response) => {
    updateOrderStatus(db, request)
      .then(() => {
        response.redirect("/restaurants")
      })
      .catch(err => {
        console.log('error:', err);
        response.status(500)
          .json({ error: err.message });
      });
  });

  return router;
};

const express = require('express');
const router = express.Router();
const { getPendingAndInProgressOrders, getItemsPerOrder, updateOrderStatus } = require('../query/restaurantQueries');



module.exports = (db) => {
  router.get("/", (req, res) => {
    // render order status
    console.log("I HAVE REACHED RESTO page");

    getPendingAndInProgressOrders(db)
      .then((orders) => {
        getItemsPerOrder(db)
          .then(items => {
            console.log('render');
            res.render("restaurant", { user: 'Restaurant', orders, items });
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

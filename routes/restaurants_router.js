const express = require('express');
const router = express.Router();
const { getPendingAndInProgressOrders, getItemsPerOrder } = require('../query/restaurantQueries');



module.exports = (db) => {
  router.get("/", (req, res) => {
<<<<<<< HEAD
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
=======
    res.render("restaurant", { user: true });
>>>>>>> brian
  });

  router.post("/", (request, response) => {
    const newStatus = request.body.order_status;
    const orderId = request.body.order_id;

    const updateOrderStatus = `
    UPDATE orders
    SET order_status = '${newStatus}'
    WHERE id = ${orderId}
    RETURNING *;
    `

    db.query(updateOrderStatus)
      .then(data => {
        console.log(data.body);
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

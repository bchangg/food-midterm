const express = require('express');
const router = express.Router();

const getPendingAndInProgressOrders = `select * from orders WHERE LOWER(order_status) = LOWER('Pending') OR LOWER(order_status) = LOWER('Accepted')`;

module.exports = (db) => {
  router.get("/", (req, res) => {
    // render order status
    console.log("I HAVE REACHED RESTO page");

    res.render("restaurant", { user: true });
    db.query(getPendingAndInProgressOrders)
      .then(data => {
        console.log(data.rows);
        const orders = data.rows;
        res.json({ orders });
      })
      .catch(err => {
        // console.log('error:', err);
        // res.status(500)
        //   .json({ error: err.message });
      });
  });
  return router;
};

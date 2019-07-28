const express = require('express');
const router = express.Router();

const getPendingAndInProgressOrders = `
select orders.id AS order_id, orders.order_status, users.phone, users.name from orders
RIGHT JOIN users ON orders.user_id = users.id
WHERE LOWER(order_status) = LOWER('Pending')
OR LOWER(order_status) = LOWER('Ready')
OR LOWER(order_status) = LOWER('Preparing')
ORDER BY CASE
  WHEN orders.order_status ='Pending' THEN 1
  WHEN orders.order_status ='Preparing' THEN 2
  WHEN orders.order_status ='Ready' THEN 3
  WHEN orders.order_status ='Complete' THEN 4
  ELSE 5
END;`;

const getItemsPerOrder = `
SELECT dishes.name AS dish_name, orders_details.order_id  AS order_id from orders_details
JOIN dishes ON orders_details.dish_id = dishes.id
GROUP BY orders_details.order_id, dishes.name
ORDER BY orders_details.order_id;`;

module.exports = (db) => {
  router.get("/", (req, res) => {
    // render order status
    console.log("I HAVE REACHED RESTO page");

    db.query(getPendingAndInProgressOrders)
      .then(ordersFromQuery => {
        db.query(getItemsPerOrder)
          .then(itemsFromQuery => {
            const items = itemsFromQuery.rows;
            const orders = ordersFromQuery.rows;
            res.render("restaurant", { user: true, orders: orders, items: items });
          })
      })
      .catch(err => {
        // console.log('error:', err);
        // res.status(500)
        //   .json({ error: err.message });
      });
  });
  return router;
};

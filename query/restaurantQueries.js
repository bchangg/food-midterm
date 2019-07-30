const getPendingAndInProgressOrdersQuery = `
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

const getItemsPerOrderQuery = `
SELECT dishes.name AS dish_name, orders_details.order_id AS order_id, orders_details.quantity AS quantity from orders_details
JOIN dishes ON orders_details.dish_id = dishes.id
GROUP BY orders_details.order_id, dishes.name, orders_details.quantity
ORDER BY orders_details.order_id;`;

const updateOrderStatusQuery =
  `UPDATE orders
  SET order_status =  $1
  WHERE id = $2
  RETURNING *;`;


function getPendingAndInProgressOrders(db) {
  return db.query(getPendingAndInProgressOrdersQuery).then(ordersFromQuery => {
    return ordersFromQuery.rows;
  })
};

function getItemsPerOrder(db) {
  return db.query(getItemsPerOrderQuery).then(itemsFromQuery => {
    return itemsFromQuery.rows
  })
}

function updateOrderStatus(db, request) {
  const newStatus = request.body.order_status;
  const orderId = request.body.order_id;
  return db.query(updateOrderStatusQuery, [newStatus, orderId])
}

module.exports = {
  getPendingAndInProgressOrders,
  getItemsPerOrder,
  updateOrderStatus
}


const getPendingAndInProgressOrdersQuery = `
  select orders.id AS order_id, orders.order_status from orders
  RIGHT JOIN users ON orders.user_id = users.id
  WHERE LOWER(order_status) = LOWER('Pending')
  OR LOWER(order_status) = LOWER('Preparing')
  OR LOWER(order_status) = LOWER('Cancelling');
  `;

const getItemsPerOrderQuery = `
  SELECT dishes.name AS dish_name, orders_details.order_id AS order_id, orders_details.quantity AS quantity from orders_details
  JOIN dishes ON orders_details.dish_id = dishes.id
  GROUP BY orders_details.order_id, dishes.name, orders_details.quantity
  ORDER BY orders_details.order_id;
  `;

const updateOrderStatusQuery =
  `UPDATE orders
  SET order_status =  $1
  WHERE id = $2
  RETURNING *;`;

const getOrderByOrderIdQuery = `
  SELECT order_status from orders WHERE id = $1;
`;

const checkDbQuery = `
  select order_status, id from orders Where id = $1 AND order_status = $2
`

const getCompletedAndCancelledOrdersQuery = `
select orders.id AS order_id, orders.order_status AS order_status, users.phone AS phone, users.id, orders.total_price AS total_price,
orders.created_at AS date
from orders
RIGHT JOIN users ON orders.user_id = users.id
WHERE LOWER(order_status) = LOWER('Complete') OR
LOWER(order_status) = LOWER('Cancelled');
`;


const getReadyForPickupQuery = `
SELECT orders.id, users.name, users.phone from orders
JOIN users ON orders.user_id = users.id
WHERE orders.order_status = 'Ready';
`;

function getPendingAndInProgressOrders(db) {
  return db.query(getPendingAndInProgressOrdersQuery).then(ordersFromQuery => {
    return ordersFromQuery.rows;
  })
};

function getOrderByOrderId(db, request) {
  const orderId = request.body.orderId;
  const orderStatus = request.body.orderStatus;
  return db.query(getOrderByOrderIdQuery, [orderId]).then(orderFromQuery => {
    return (orderFromQuery.rows.length > 0);
  })
};

function getItemsPerOrder(db) {
  return db.query(getItemsPerOrderQuery).then(itemsFromQuery => {
    return itemsFromQuery.rows
  })
}

function checkDb(db, request) {
  const orderId = request.body.order_id;
  const orderStatus = request.body.current_status;
  return db.query(checkDbQuery, [orderId, orderStatus]).then(order => {
    if (order.rows[0]) {
      return order.rows[0].order_status === orderStatus;
    } else {
      return false;
    }
  })
    .catch((error) => {
      console.error(error);
      return false;
    })
}

function updateOrderStatus(db, request) {
  const newStatus = request.body.order_status;
  const orderId = request.body.order_id;
  return db.query(updateOrderStatusQuery, [newStatus, orderId]);
}

function getCompletedAndCancelledOrders(db) {
  return db.query(getCompletedAndCancelledOrdersQuery).then(orders => {
    return orders.rows;
  })
}


function getReadyForPickup(db) {
  return db.query(getReadyForPickupQuery).then(orders => {
    return orders.rows;
  })
}

module.exports = {
  getPendingAndInProgressOrders,
  getItemsPerOrder,
  updateOrderStatus,
  getOrderByOrderId,
  checkDb,
  getCompletedAndCancelledOrders,
  getReadyForPickup
}

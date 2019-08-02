const getIdFromUserNameQuery =
  `SELECT id FROM users WHERE name = $1`;

const getNameFromUserIdQuery =
  `SELECT name FROM users WHERE id = $1`;

const getOrdersPerUserQuery = `
  SELECT * FROM orders
  JOIN orders_details ON orders.id = order_id
  JOIN dishes ON dishes.id = dish_id
  WHERE user_id = $1;
`;
const getItemsPerUserQuery = `
  SELECT *
  FROM orders
  WHERE user_id = $1;
`;

const seedOrdersTableWithUserIdQuery = `
  INSERT INTO orders (user_id)
  VALUES ($1)
  RETURNING id;
`;

const seedOrdersDetailsTableWithCurrentOrderQuery = `
  INSERT INTO orders_details (
    dish_id,
    order_id,
    order_duration,
    order_price,
    quantity
  )
  VALUES ($1, $2, $3, $4, $5)
  RETURNING order_id;
`;

const updateOrdersTableWIthTotalPriceTotalDurationQuery = `
  UPDATE orders
  SET total_price = (
    SELECT sum(order_price) FROM orders_details WHERE order_id = $1
  ), total_duration = (
    SELECT sum(order_duration) FROM orders_details WHERE order_id = $1
  )
  WHERE id = $1;
`;

const getIdCreateAtSumDurationQuery = `
  SELECT order_id, orders.created_at, sum(order_duration)
  FROM orders_details JOIN orders ON orders.id = order_id
  GROUP BY order_id, orders.created_at;
`

const cancellingStatusByOrderIdQuery = `
  UPDATE orders
  SET order_status = 'Cancelling'
  WHERE id = $1
  RETURNING *;
`

const getIdandOrderStatusQuery = `
  SELECT id, order_status, user_id
  FROM orders
  WHERE id = $1
`

function updateOrdersTableWIthTotalPriceTotalDuration(db, orderId) {
  return db.query(updateOrdersTableWIthTotalPriceTotalDurationQuery, [orderId]);
}


function seedOrdersDetailsTableWithCurrentOrderReturningOrderId(db, dishData) {
  return db.query(seedOrdersDetailsTableWithCurrentOrderQuery, dishData);
}

function seedOrdersTableWithUserIdReturningOrderId(db, userId) {
  return db.query(seedOrdersTableWithUserIdQuery, [userId])
    .then((data) => {
      return data.rows[0].id;
    });
}

function getUserIdFromName(db, userName) {
  return db.query(getIdFromUserNameQuery, [userName])
    .then((data) => {
      return data.rows[0].id;
    });
}

function getNameFromUserId(db, userData) {
  return db.query(getNameFromUserIdQuery, [userData])
    .then(user => {
      return user.rows[0].name;
    })
};

function getOrdersPerUser(db, userId) {
  return db.query(getOrdersPerUserQuery, [userId])
    .then(orderData => {
      return orderData.rows;
    });
}

function getItemsPerUser(db, userId) {
  return db.query(getItemsPerUserQuery, [userId])
    .then(orderStatusData => {
      return orderStatusData.rows
    })
};

function getIdCreateAtSumDuration(db) {
  return db.query(getIdCreateAtSumDurationQuery).then(durationFromQuery => {
    return durationFromQuery.rows;
  })
};

function getIdandOrderStatus(db, orderId) {
  return db.query(getIdandOrderStatusQuery, [orderId]).then(data => {
    return data.rows[0];
  })
}

function cancellingStatusByOrderId(db, orderId) {
  return db.query(cancellingStatusByOrderIdQuery, [orderId])
}

module.exports = {
  updateOrdersTableWIthTotalPriceTotalDuration,
  seedOrdersDetailsTableWithCurrentOrderReturningOrderId,
  seedOrdersTableWithUserIdReturningOrderId,
  getUserIdFromName,
  getNameFromUserId,
  getOrdersPerUser,
  getItemsPerUser,
  getIdCreateAtSumDuration,
  getIdandOrderStatus,
  cancellingStatusByOrderId
}

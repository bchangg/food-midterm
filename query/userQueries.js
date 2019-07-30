const queryConfigQuery =
  `SELECT name FROM users WHERE id = $1`;

const getOrdersPerUserQuery = `
  SELECT * FROM orders
  JOIN orders_details ON orders.id = order_id
  JOIN dishes ON dishes.id = dish_id
  WHERE user_id = $1;
`;
const getItemsPerUserQuery = `
  SELECT id, order_status, user_id
  FROM orders
  WHERE user_id = $1;
`;

function queryConfig(db, userData) {
  return db.query(queryConfigQuery, [userData])
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

module.exports = {
  queryConfig,
  getOrdersPerUser,
  getItemsPerUser
}

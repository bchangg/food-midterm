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
  SELECT id, order_status, user_id
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
    total_duration_per_dish,
    total_price_per_dish,
    quantity
  )
  VALUES ($1, $2, $3, $4, $5)
  RETURNING order_id;
`;

const updateOrdersTableWIthTotalPriceTotalDurationQuery = `
  UPDATE orders
  SET total_price = (
    SELECT sum(total_price_per_dish) FROM orders_details WHERE order_id = $1
  ), total_duration = (
    SELECT sum(total_duration_per_dish) FROM orders_details WHERE order_id = $1
  )
  WHERE id = $1;
`;

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

module.exports = {
  updateOrdersTableWIthTotalPriceTotalDuration,
  seedOrdersDetailsTableWithCurrentOrderReturningOrderId,
  seedOrdersTableWithUserIdReturningOrderId,
  getUserIdFromName,
  getNameFromUserId,
  getOrdersPerUser,
  getItemsPerUser
}

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
  RETURNING id AS order_id, user_id AS user_id;
`;

function seedOrdersTableWithUserId(db, userId) {
  return db.query(seedOrdersTableWithUserIdQuery, [userId])
    .then((data) => {
      console.log(data.rows);
      return data.rows;
    })
}

function getUserIdFromName(db, userName) {
  return db.query(getIdFromUserNameQuery, [userName])
    .then((data) => {
      return data.rows[0].id;
    })
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
  seedOrdersTableWithUserId,
  getUserIdFromName,
  getNameFromUserId,
  getOrdersPerUser,
  getItemsPerUser
}

module.exports = getPendingAndInProgressOrders = `
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

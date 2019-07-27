DROP TABLE IF EXISTS orders_details CASCADE;
CREATE TABLE orders_details (
  id SERIAL PRIMARY KEY NOT NULL,
  quantity int,
  order_price int,
  order_duration int,
  order_id int REFERENCES orders (id) ON DELETE CASCADE,
  dish_id int REFERENCES dishes (id) ON DELETE CASCADE
);

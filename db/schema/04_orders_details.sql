DROP TABLE IF EXISTS orders_details CASCADE;
CREATE TABLE orders_details (
  id SERIAL PRIMARY KEY NOT NULL,
  quantity int,
  total_price_per_dish int,
  total_duration_per_dish int,
  order_id int REFERENCES orders (id) ON DELETE CASCADE,
  dish_id int REFERENCES dishes (id) ON DELETE CASCADE
);

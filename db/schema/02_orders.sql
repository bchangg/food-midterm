DROP TABLE IF EXISTS orders CASCADE;
CREATE SEQUENCE IF NOT EXISTS orders_id_seq;

CREATE TABLE orders (
  id INT UNIQUE NOT NULL DEFAULT NEXTVAL('orders_id_seq'),
  created_at TIMESTAMP DEFAULT NOW(),
  order_status VARCHAR(255) DEFAULT 'Pending',
  total_price int,
  total_duration int,
  user_id int REFERENCES users (id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  order_status VARCHAR(255) DEFAULT 'Pending',
  total_price int,
  total_duration int,
  user_id int REFERENCES users (id) ON DELETE CASCADE
);

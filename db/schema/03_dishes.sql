DROP TABLE IF EXISTS dishes CASCADE;
CREATE TABLE dishes (
  id SERIAL PRIMARY KEY NOT NULL,
  name varchar(255),
  description text,
  price int,
  imgURL text,
  duration int
);

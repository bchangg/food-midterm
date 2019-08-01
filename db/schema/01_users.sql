DROP TABLE IF EXISTS users CASCADE;
CREATE SEQUENCE IF NOT EXISTS users_id_seq;

CREATE TABLE users (
  id  INT UNIQUE NOT NULL DEFAULT NEXTVAL('users_id_seq'),
  name VARCHAR(255) NOT NULL,
  phone char(10) not null,
  email varchar(255)
);

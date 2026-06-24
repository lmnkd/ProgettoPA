CREATE TABLE users (
  cf SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE,
  passwordHash VARCHAR,
  role VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE users (
  cf SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE,
  passwordHash VARCHAR,
  role VARCHAR,
  token INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE vaccini (
  id SERIAL PRIMARY KEY,
  nome VARCHAR,
  disponibilita INTEGER,
  scadenza DATE
);



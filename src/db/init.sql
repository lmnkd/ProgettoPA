CREATE TABLE users (
  cf VARCHAR(16) PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE,
  password_hash VARCHAR,
  role VARCHAR,
  token INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE vaccini (
  id SERIAL PRIMARY KEY,
  nome VARCHAR NOT NULL UNIQUE,
  durataCopertura INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE lotti_vaccino (
  id SERIAL PRIMARY KEY,
  vaccino_id INTEGER NOT NULL REFERENCES vaccini(id),

  codice_lotto VARCHAR UNIQUE NOT NULL,
  quantita_disponibile INTEGER NOT NULL,

  data_consegna DATE NOT NULL,
  data_scadenza DATE NOT NULL,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE vaccinazioni (
  id SERIAL PRIMARY KEY,

  user_cf VARCHAR NOT NULL REFERENCES users(cf),
  vaccino_id INTEGER NOT NULL REFERENCES vaccini(id),
  lotto_id INTEGER NOT NULL REFERENCES lotti_vaccino(id),

  data_vaccinazione DATE NOT NULL,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);



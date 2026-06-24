-- USERS
INSERT INTO users (cf, email, passwordHash, role)
VALUES
('RSSMRA80A01H501U', 'mario.rossi@email.it', '$2a$10$hash1', 'operator'),
('VRDLGI85B15F205X', 'luigi.verdi@email.it', '$2a$10$hash2', 'user'),
('BNCMRA90C20D612Y', 'maria.bianchi@email.it', '$2a$10$hash3', 'user'),
('MEDCST75D10H501Z', 'medico@asl.it', '$2a$10$hash4', 'operator'),
('ADMINA70E01F205K', 'admin@asl.it', '$2a$10$hash5', 'admin');

-- VACCINI
INSERT INTO vaccini (nome, durataCopertura)
VALUES
('Pfizer', 365),
('Moderna', 365),
('AstraZeneca', 365),
('Antinfluenzale', 180);

-- LOTTI
INSERT INTO lotti_vaccino (
  vaccino_id,
  codice_lotto,
  quantita_disponibile,
  data_consegna,
  data_scadenza
)
VALUES
(1, 'PFZ-2025-001', 500, '2025-01-10', '2026-01-10'),
(1, 'PFZ-2025-002', 300, '2025-03-15', '2026-03-15'),
(2, 'MOD-2025-001', 400, '2025-02-01', '2026-02-01'),
(3, 'AZ-2025-001', 250, '2025-01-20', '2026-01-20'),
(4, 'FLU-2025-001', 1000, '2025-09-01', '2026-03-01');

-- VACCINAZIONI
INSERT INTO vaccinazioni (
  user_cf,
  vaccino_id,
  lotto_id,
  data_vaccinazione
)
VALUES
('RSSMRA80A01H501U', 1, 1, '2025-02-15'),
('VRDLGI85B15F205X', 2, 3, '2025-03-10'),
('BNCMRA90C20D612Y', 4, 5, '2025-10-01');
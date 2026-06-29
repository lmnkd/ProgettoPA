# Backend vaccinazione
Questo progetto consiste nella realizzazione di un backend che gestisce delle vaccinazioni.

- [Obiettivo del progetto](#obiettivo-del-progetto)
- [Progettazione](#progettazione)
- [Casi d'uso](#casi-duso)
- [Diagrammi di sequenza](#diagrammi-di-sequenza)
- [API Reference](#api-reference)
- [API Summary](#api-summary)
- [API Reference Detail](#api-reference-detail)
- [Design pattern utilizzati](#design-pattern-utilizzati)
- [Istruzioni per l'avvio del backend (Docker)](#istruzioni-per-lavvio-del-backend-docker)
- [Test del Progetto](#test-del-progetto)

# Obiettivo del progetto

L'obiettivo del progetto è lo sviluppo di un sistema backend che consenta la gestione delle vaccinazioni e dei relativi dati sanitari, al fine di dimostrare la comprensione dei concetti e delle buone pratiche relative allo sviluppo di API REST, autenticazione, gestione dati e architetture backend scalabili illustrate nel corso.

In generale, il sistema deve essere in grado di gestire i seguenti aspetti:

- gestione dei vaccini e delle relative informazioni (nome, durata della copertura);
- gestione delle dosi di vaccino (lotto, data di consegna, data di scadenza, disponibilità);
- registrazione delle vaccinazioni effettuate agli utenti;
- gestione degli utenti tramite codice fiscale;
- generazione di documenti PDF con lo storico delle vaccinazioni;
- analisi e visualizzazione di statistiche sui vaccini e sulle coperture;
- gestione della scadenza della copertura vaccinale degli utenti;
- utilizzo di codici temporanei per accesso ai dati tramite Redis.

---

## Autenticazione e autorizzazione

Il sistema utilizza autenticazione basata su **JWT (JSON Web Token)**.

Le tipologie di utenza previste sono:

- **user**: può consultare i propri dati vaccinali;
- **operator**: può registrare vaccinazioni e gestire vaccini e dosi;
- un utente può avere più ruoli contemporaneamente.

Il JWT contiene:
- metadati dell’utente
- codice fiscale
- lista dei ruoli

Se il numero di token disponibili per un utente termina, ogni richiesta deve restituire `401 Unauthorized`.

---

##  Funzionalità principali

Il sistema deve supportare le seguenti operazioni:

- Creazione di nuovi vaccini con durata della copertura;
- Aggiunta di dosi di vaccino (lotto, data consegna, scadenza);
- Consultazione vaccini con filtri su:
  - nome
  - disponibilità (>, <, range)
  - scadenza (>, <, range)
- Consultazione dosi disponibili per vaccino con filtri su quantità;
- Inserimento vaccinazione con validazioni:
  - utente esistente
  - lotto valido
  - vaccino non scaduto
  - copertura rispettata
- Recupero storico vaccinazioni utente in JSON e PDF;
- Statistiche vaccini:
  - min, max, media, deviazione standard
  - distribuzione mensile
- Individuazione utenti con copertura scaduta;
- Calcolo giorni rimanenti o scaduti per ogni vaccinazione;
- Generazione codice temporaneo (Redis) per accesso senza JWT.

---

## Sistema di token temporanei (Redis)

Il sistema consente la generazione di un codice univoco con durata limitata (N minuti).

Questo codice:
- viene salvato in Redis
- ha una scadenza (TTL)
- permette di accedere ai dati senza JWT
- viene invalidato automaticamente alla scadenza

---

## Tecnologie utilizzate

Il progetto è sviluppato in **TypeScript** e utilizza:

- **Node.js** → runtime backend
- **Express** → framework per API REST
- **Sequelize** → ORM per database relazionale
- **Redis** → gestione token temporanei e cache
- **PDFKit (o simili)** → generazione PDF
- **RDBMS** → PostgreSQL / MySQL / SQLite (a scelta)

---

## Qualità del software

Il progetto include:

- utilizzo di middleware per:
  - autenticazione
  - validazione
  - gestione errori
- gestione centralizzata degli errori
- utilizzo di Design Pattern (documentati nel README)
- seed iniziali con dati realistici
- test con **Jest** (middleware)
- test API con **Postman**
- utilizzo di **Docker / docker-compose** per avvio sistema








# API Reference


## 📡 API Summary

Molte rotte avranno rotte apparentemente simili, in realtà poi con il router gestiamo l'api in modo da evitare conflitti.

| Rotta | Metodo HTTP | Ruolo autorizzato | Descrizione |
|--------|------------|-------------------|-------------|
| /auth/login | POST | Utente non autenticato | Rotta di autenticazione |
| /users | POST | Utente non autenticato | Crea un nuovo utente specificando il ruolo |
| /admin/addToken/:cf | GET | Admin | Ricarica il numero di token di un utente identificato dal codice fiscale |
| /admin/code | POST | Admin | Genera un codice temporaneo Redis per accedere ai dati di un utente senza JWT |
| /vaccini/:vaccinoId/lotti | POST | Operator | Crea un nuovo lotto per il vaccino specificato |
| /vaccini/:vaccinoId/lotti | GET | Operator | Restituisce tutti i lotti associati a un vaccino |
| /coperturascaduta | GET | Operator | Restituisce la lista degli utenti con copertura vaccinale scaduta |
| /:cf | GET | Operator | Restituisce i dati di un utente dato il codice fiscale |
| /:cf | PUT | Operator | Aggiorna i dati di un utente o operatore dato il codice fiscale |
| /:cf | DELETE | Operator | Elimina un utente o operatore dato il codice fiscale |
| /vaccinazioni | POST | Operator | Registra una nuova vaccinazione rispettando i vincoli previsti dal progetto |
| /vaccinazioni | GET | Operator | Restituisce tutte le vaccinazioni registrate |
| /vaccinazioni/:id | GET | Operator | Restituisce una specifica vaccinazione dato l'id |
| /vaccinazioni/:id | PUT | Operator | Aggiorna una vaccinazione dato l'id |
| /vaccinazioni/:id | DELETE | Operator | Elimina una vaccinazione dato l'id |
| /pdf | User, Operator | GET | Genera un PDF contenente le vaccinazioni di un utente. L'admin/operator può specificare il CF tramite query string |
| /filtrareuseradmin | User, Operator | GET | Restituisce le vaccinazioni filtrate per nome vaccino e/o intervallo di date |
| /copertura | User, Operator | GET | Restituisce per ogni vaccinazione il numero di giorni mancanti alla scadenza della copertura o trascorsi dalla sua scadenza |
| /copertura/pdf | User, Operator | GET | Genera un PDF con il report della copertura vaccinale di un utente |
| /copertura/code | Accesso tramite codice Redis | GET | Restituisce il report di copertura utilizzando un codice temporaneo senza autenticazione JWT |
|-------|---------|---------|--------|
| /creavaccino | POST | Operator | Crea una nuova tipologia di vaccino (i nomi non possono essere duplicati) |
| /readAllVaccini | GET | Operator | Restituisce tutti i vaccini presenti nel sistema |
| /vaccini | GET | User, Operator | Ricerca vaccini con filtri su nome, disponibilità e data di scadenza |
| /:id | GET | Operator | Restituisce un vaccino dato il suo ID |
| /:nome | GET | Operator | Restituisce un vaccino dato il nome |
| /:id | PUT | Operator | Aggiorna un vaccino esistente |
| /:id | DELETE | Operator | Elimina un vaccino dal sistema |








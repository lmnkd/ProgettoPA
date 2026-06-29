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

## 📡 API Reference

| Rotta | Metodo HTTP | Ruolo autorizzato | Descrizione |
|------|------------|-------------------|-------------|
| /auth/login | POST | Utente non autenticato | Rotta di autenticazione |
| /users | POST | Utente non autenticato | Crea un nuovo utente specificando il ruolo |
| /admin/addToken/:cf | GET | Admin | Ricarica token utente tramite codice fiscale |
| /admin/code | POST | Admin | Genera codice temporaneo Redis |
| /creavaccino | POST | Operator | Crea una nuova tipologia di vaccino |
| /readAllVaccini | GET | Operator | Restituisce tutti i vaccini |
| /vaccini | GET | User, Operator | Ricerca vaccini con filtri |
| /vaccini/statistiche | GET | Operator | Statistiche sui vaccini |
| /vaccini/statistiche/copertura | GET | Operator | Statistiche copertura vaccinale |
| /vaccini/id/:id | GET | Operator | Restituisce vaccino per ID |
| /vaccini/nome/:nome | GET | Operator | Restituisce vaccino per nome |
| /vaccini/:id | PUT | Operator | Aggiorna vaccino |
| /vaccini/:id | DELETE | Operator | Elimina vaccino |
| /coperturascaduta | GET | Operator | Utenti con copertura scaduta |
| /:cf | GET | Operator | Dati utente per CF |
| /:cf | PUT | Operator | Aggiorna utente |
| /:cf | DELETE | Operator | Elimina utente |
| /vaccinazioni | POST | Operator | Registra vaccinazione |
| /vaccinazioni | GET | Operator | Lista vaccinazioni |
| /vaccinazioni/:id | GET | Operator | Dettaglio vaccinazione |
| /vaccinazioni/:id | PUT | Operator | Aggiorna vaccinazione |
| /vaccinazioni/:id | DELETE | Operator | Elimina vaccinazione |
| /pdf | User, Operator | GET | PDF storico vaccinazioni |
| /filtrareuseradmin | User, Operator | GET | Filtra vaccinazioni |
| /copertura | User, Operator | GET | Report copertura vaccinale |
| /copertura/pdf | User, Operator | GET | PDF copertura |
| /copertura/code | Code Redis | GET | Accesso senza JWT |

# 📡 API Reference Detail

Di seguito sono riportate le rotte HTTP con la relativa descrizione e struttura delle richieste e risposte.

---

## 🔐 POST /api/auth/login

Rotta utilizzata per autenticare un utente.  
L’utente deve fornire email e password nel body della richiesta HTTP.

La password deve rispettare i seguenti criteri:
- almeno 8 caratteri
- almeno una lettera minuscola
- almeno una lettera maiuscola
- almeno un numero
- almeno un carattere speciale

Se le credenziali sono corrette viene restituito un token JWT utilizzato per le richieste successive.

---

### 📥 Richiesta

```http
POST /api/auth/login HTTP/1.1
Content-Type: application/json
```
### Body
```
{
  "email": "{{USER_ROLE_EMAIL}}",
  "password": "{{USER_ROLE_PSW}}"
}
```
### Richiesta con successo
```
{
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjZiI6Ik5SQUdQUDkyRTE4QTY2MlUiLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE3ODI0ODIzNDEsImV4cCI6MTc4MjQ4NTk0MX0...."
}
```


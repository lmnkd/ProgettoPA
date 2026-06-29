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
| /statistiche | GET | Operator | Statistiche sui vaccini |
| /statistiche/copertura | GET | Operator | Statistiche copertura vaccinale |
| /:id | GET | Operator | Restituisce vaccino per ID |
| /:nome | GET | Operator | Restituisce vaccino per nome |
| /:id | PUT | Operator | Aggiorna vaccino |
| /:id | DELETE | Operator | Elimina vaccino |
| /:cf | GET | Operator | Dati utente per CF |
| /:cf | PUT | Operator | Aggiorna utente |
| /:cf | DELETE | Operator | Elimina utente |
| /vaccinazioni | POST | Operator | Registra vaccinazione |
| /vaccinazioni | GET | Operator | Lista vaccinazioni |
| /vaccinazioni/:id | GET | Operator | Dettaglio vaccinazione |
| /vaccinazioni/:id | PUT | Operator | Aggiorna vaccinazione |
| /vaccinazioni/:id | DELETE | Operator | Elimina vaccinazione |
| /pdf | User, Admin | GET | PDF storico vaccinazioni |
| /filtrareuseradmin | Admin | GET | Filtra vaccinazioni |
| /copertura | User, Admin | GET | Report copertura vaccinale |
| /copertura/pdf | User, Admin | GET | PDF copertura |
| /copertura/code | User, Admin | GET | Accesso senza JWT |

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
## 🔐 POST /users

Rotta utilizzata per creare un utente.  
L’utente deve fornire cf, nome, email, password e ruolo nel body della richiesta HTTP.



Se i dati sono corretti viene restituito un json con i parametri indicati nel body e la conferma del processo di creazione dell'utente.

---

### 📥 Richiesta

```http
POST /users HTTP/1.1
Content-Type: application/json
```
### Body
```
{
  "cf": "NRAGPP92E18A662U",
  "name": "Giuseppe neri",
  "email": "giuseppe.ner@email.it",
  "password": "password123",
  "role": "admin"
}
```
### Richiesta con successo
```
{
    "message": "User crato correttamente.",
    "user": {
        "token": 1,
        "cf": "NRAGPP92E18A662U",
        "name": "Giuseppe neri",
        "email": "giuseppe.ner@email.it",
        "passwordHash": "$2b$10$yWjJGX115Ddw6fGr6NpZkO0NLJ5KA4xQb3Tp4q1P/7vSDjF4Pq6v6",
        "role": "admin",
        "updatedAt": "2026-06-26T13:58:58.019Z",
        "createdAt": "2026-06-26T13:58:58.019Z"
    }
}
```
## 🔐 /admin/addToken/:cf

Rotta utilizzata per aggiungere dei token ad un utente dato un certo cf.  
Nella rotta l'admin dovrà aggiungere alla fine il cf dell'utente che vuole venga ricaricato.
Nel body dovrà precisare la quantità di token da dare allo stesso.
Il body non può avere come numero di crediti un numero negativo.


Se i dati sono corretti viene restituito un json con il messaggio che informa del fatto che i token sono stati aggiornati e tutte le specifiche dell'user a cui l'aggiunta era rivolta con il numero di token corretti.

---

### 📥 Richiesta

```http
GET /admin/addToken/:cf HTTP/1.1
Content-Type: application/json
```
### Body
```
{
    "amount":  2
}

```
### Richiesta con successo
```
{
    "message": "Token aggiornato correttamente",
    "user": {
        "cf": "RSSMRA80A01H501U",
        "name": "Mario Rossi",
        "email": "mario.rossi@email.it",
        "passwordHash": "$2b$10$xqbKlHCs/oNRZWMudXMEBuQgNqC.s2TquXnlylBTXg2d53zfaN9W2",
        "token": 3,
        "role": "operator",
        "createdAt": "2026-06-29T13:17:54.996Z",
        "updatedAt": "2026-06-29T13:23:50.877Z"
    }
}
```

## 🔐 /admin/code

Rotta utilizzata per creare un code Redis dato un cf che metteremo nel body.
Se la richiesta è andata a buon fine apparirà un json con il code di Redis e il cf a esso collegato con il tempo entro il quale scadrà.

---

### 📥 Richiesta

```http
POST /admin/code HTTP/1.1
Content-Type: application/json
```
### Body
```
{
  "cf": "RSSMRA80A01H501U"
}

```
### Richiesta con successo
```
{
    "code": "72aab61f-8a13-4d0e-a438-f5f2a08fec7e",
    "cf": "RSSMRA80A01H501U",
    "expiresIn": 600
}
```
## 🔐 /creavaccino

Rotta utilizzata per creare un vaccino dato il nome e la durata della copertura che metteremo nel body.
Se la richiesta è andata a buon fine apparirà un json con il messaggio di avvenuta creazione e tutti i dati del vaccino appena creato.

---

### 📥 Richiesta

```http
POST /creavaccino HTTP/1.1
Content-Type: application/json
```
### Body
```
{
    "nome": "Bscottino",
    "durataCopertura": 80
}

```
### Richiesta con successo
```
{
    "message": "Vaccino creato correttamente",
    "vaccino": {
        "id": 5,
        "nome": "Bscottino",
        "durataCopertura": 80,
        "updatedAt": "2026-06-29T13:37:40.190Z",
        "createdAt": "2026-06-29T13:37:40.190Z"
    }
}
```

## 🔐 /readAllVaccini

Rotta utilizzata per visualizzare tutti i vaccini, il body è vuoto.
Se la richiesta è andata a buon fine avremo un array Json con tutti i vaccini presenti nel db.

---

### 📥 Richiesta

```http
GET /readAllVaccini HTTP/1.1
Content-Type: application/json
```
### Body
```
```
### Richiesta con successo
```
[
    {
        "id": 1,
        "nome": "Pfizer",
        "durataCopertura": 180,
        "createdAt": "2026-06-29T13:37:09.495Z",
        "updatedAt": "2026-06-29T13:37:09.495Z"
    },
    {
        "id": 2,
        "nome": "Moderna",
        "durataCopertura": 365,
        "createdAt": "2026-06-29T13:37:09.495Z",
        "updatedAt": "2026-06-29T13:37:09.495Z"
    },
    {
        "id": 3,
        "nome": "AstraZeneca",
        "durataCopertura": 365,
        "createdAt": "2026-06-29T13:37:09.495Z",
        "updatedAt": "2026-06-29T13:37:09.495Z"
    },
    {
        "id": 4,
        "nome": "Antinfluenzale",
        "durataCopertura": 180,
        "createdAt": "2026-06-29T13:37:09.495Z",
        "updatedAt": "2026-06-29T13:37:09.495Z"
    },
    {
        "id": 5,
        "nome": "Bscottino",
        "durataCopertura": 80,
        "createdAt": "2026-06-29T13:37:40.190Z",
        "updatedAt": "2026-06-29T13:37:40.190Z"
    }
]
```

## 🔐 /vaccini

Rotta utilizzata per visualizzare i vaccini con la possibilità di filtrarli come richiesto nelle specifiche del progetto.
Più precisamente nella richiesta http è possibile filtrare attraverso:
- ?nome=Pfizer
- ?nome=Pfizer,Moderna
- ?scadenzaMaggioreDi=2026-01-01
- ?scadenzaMinoreDi=2026-12-31
- ?scadenzaMaggioreDi=2026-01-01&scadenzaMinoreDi=2026-12-31
- ?disponibilitaMin=100
- ?disponibilitaMax=500
- ?disponibilitaMin=100&disponibilitaMax=500
- ?nome=Pfizer,Moderna&scadenzaMaggioreDi=2026-01-01&scadenzaMinoreDi=2026-12-31&disponibilitaMin=100&disponibilitaMax=500

Il body è vuoto mentre se la richiesta ha successo il risultato sarà un json con tutti i medicinali trovati che rispettano i filtri.

---

### 📥 Richiesta

```http
GET /vaccini HTTP/1.1
Content-Type: application/json
```
### Body
```
```
### Richiesta con successo
```
[
    {
        "id": 2,
        "nome": "Moderna",
        "durataCopertura": 365,
        "createdAt": "2026-06-29T13:37:09.495Z",
        "updatedAt": "2026-06-29T13:37:09.495Z",
        "disponibilitaTotale": "400"
    }
]
```




## 🔐 /statistiche

Rotta utilizzata per visualizzare le statistiche dei vaccini come richiesto nelle specifiche del progetto.
Le statistiche avranno:
- media dosi consegnate
- statistiche mensili

Il body è vuoto mentre se la richiesta ha successo il risultato sarà un json con tutte le statistiche per vaccino.

---

### 📥 Richiesta

```http
GET /statistiche HTTP/1.1
Content-Type: application/json
```
### Body
```
```
### Richiesta con successo
```
{
    "vaccini": [
        {
            "id": 1,
            "nome": "Pfizer",
            "mediaDosiConsegnate": 400,
            "statisticheMensili": [
                {
                    "mese": 2,
                    "min": 1,
                    "max": 1,
                    "media": 1,
                    "deviazioneStandard": 0
                }
            ]
        },
        {
            "id": 2,
            "nome": "Moderna",
            "mediaDosiConsegnate": 400,
            "statisticheMensili": [
                {
                    "mese": 3,
                    "min": 1,
                    "max": 1,
                    "media": 1,
                    "deviazioneStandard": 0
                }
            ]
        },
        {
            "id": 3,
            "nome": "AstraZeneca",
            "mediaDosiConsegnate": 250,
            "statisticheMensili": []
        },
        {
            "id": 4,
            "nome": "Antinfluenzale",
            "mediaDosiConsegnate": 1000,
            "statisticheMensili": [
                {
                    "mese": 10,
                    "min": 1,
                    "max": 1,
                    "media": 1,
                    "deviazioneStandard": 0
                }
            ]
        },
        {
            "id": 5,
            "nome": "Bscottino",
            "mediaDosiConsegnate": 0,
            "statisticheMensili": []
        }
    ]
}
```
## 🔐 /statistiche/copertura

Rotta utilizzata per visualizzare le statistiche dele coperture come richiesto nelle specifiche del progetto.
Le statistiche avranno:
- utenti scoperti entro 30 giorni
- utenti scoperti tra i 31 3 i 90 giorni
- utenti scoperti oltre i 90 giorni

Il body è vuoto mentre se la richiesta ha successo il risultato sarà un json con tutte le statistiche riguardanti le coperture del vaccino.

---

### 📥 Richiesta

```http
GET /statistiche/copertura HTTP/1.1
Content-Type: application/json
```
### Body
```
```
### Richiesta con successo
```
{
    "utentiScopertiEntro30Giorni": 0,
    "utentiScopertiTra31E90Giorni": 0,
    "utentiScopertiOltre90Giorni": 3
}
```

## 🔐 /:id

Rotta utilizzata per visualizzare un vaccinoi dato un id che inseriremo dentro la richiesta

Il body è vuoto mentre se la richiesta ha successo il risultato sarà un json con il vaccino richiesto.

---

### 📥 Richiesta

```http
GET /1 HTTP/1.1
Content-Type: application/json
```
### Body
```
```
### Richiesta con successo
```
{
    "id": 1,
    "nome": "Pfizer",
    "durataCopertura": 180,
    "createdAt": "2026-06-29T13:37:09.495Z",
    "updatedAt": "2026-06-29T13:37:09.495Z"
}
```
## 🔐 /:nome

Rotta utilizzata per visualizzare un vaccinoi dato un nome che inseriremo dentro la richiesta

Il body è vuoto mentre se la richiesta ha successo il risultato sarà un json con il vaccino richiesto.

---

### 📥 Richiesta

```http
GET /pfizer HTTP/1.1
Content-Type: application/json
```
### Body
```
```
### Richiesta con successo
```
{
    "id": 1,
    "nome": "Pfizer",
    "durataCopertura": 180,
    "createdAt": "2026-06-29T13:37:09.495Z",
    "updatedAt": "2026-06-29T13:37:09.495Z"
}
```

## 🔐 /:id

Rotta utilizzata per modificare un vaccino dato un id che inseriremo dentro la richiesta.

Il body ha i dati da cambiare al suo interno mentre se la richiesta ha successo il risultato sarà un json con il vaccino cambiato.

---

### 📥 Richiesta

```http
PUT /1 HTTP/1.1
Content-Type: application/json
```
### Body
```
{
    "nome": "Pfizerzzz",
    "durataCopertura": 180
}

```
### Richiesta con successo
```
{
    "message": "Vaccino aggiornato correttamente",
    "vaccino": {
        "id": 1,
        "nome": "Pfizerzzz",
        "durataCopertura": 180,
        "createdAt": "2026-06-29T13:37:09.495Z",
        "updatedAt": "2026-06-29T14:12:26.199Z"
    }
}
```


## 🔐 /:id

Rotta utilizzata per eliminare un vaccino dato un id che inseriremo dentro la richiesta.

Il body è vuoto mentre se la richiesta ha successo il risultato sarà un json con l'avvenuta conferma di eliminazione.

---

### 📥 Richiesta

```http
DELETE /1 HTTP/1.1
Content-Type: application/json
```
### Body
```
```
### Richiesta con successo
```
{
    "message": "Vaccino cancellato correttamente"
}
```
## 🔐 /:cf da fare per update delete e tutto il resto

Rotta utilizzata per vedere gli utenti con la copertura scaduta.

Il body è vuoto mentre se la richiesta ha successo il risultato sarà un json con i nomi di tutti gli utenti con la copertura scaduta.

---

### 📥 Richiesta

```http
GET /coperturascaduta HTTP/1.1
Content-Type: application/json
```
### Body
```
```
### Richiesta con successo
```
{
    "message": "Vaccino cancellato correttamente"
}
```

## 🔐 /vaccinazioni/:id da fare per update delete e tutto il resto e all

Rotta utilizzata per vedere gli utenti con la copertura scaduta.

Il body è vuoto mentre se la richiesta ha successo il risultato sarà un json con i nomi di tutti gli utenti con la copertura scaduta.

---

### 📥 Richiesta

```http
GET /coperturascaduta HTTP/1.1
Content-Type: application/json
```
### Body
```
```
### Richiesta con successo
```
{
    "message": "Vaccino cancellato correttamente"
}
```

| /copertura | User, Operator | GET | Report copertura vaccinale |
| /copertura/pdf | User, Operator | GET | PDF copertura |
| /copertura/code | Code Redis | GET | Accesso senza JWT |


## 🔐 /pdf 

Rotta utilizzata per vedere lo storico delle coperture tramite pdf.
l'admin potrà richiedere tramite richiesta http specificando il cf lo sotricodi un dato user, un user invece può vedere solo le sue.
Il body è vuoto mentre se la richiesta ha successo il risultato sarà un pdf con tutte le vaccinazioni di un dato utente o in generale tutte per admin.

---

### 📥 Richiesta

```http
GET /pdf HTTP/1.1
Content-Type: application/json
```
### Body
```
```
### Richiesta con successo
```
mettere immagine
```
## 🔐 /filtrareuseradmin

Rotta utilizzata per vedere le vaccinazioni filtrare utilizzabile solo dall'admin.
L'admin potrà filtrare attraverso:
- ?nome=pfizer&dataMin=2024-01-01&dataMax=2024-12-31
- ?nome=moderna&before=2024-06-01
- ?cf=BNCMRA90C20D612Y&dataMin=2025-09-01&dataMax=2025-12-31
Il body è vuoto mentre se la richiesta ha successo il risultato sarà un json con tutte le vaccinazioni filtrate secondo i parametri.

---

### 📥 Richiesta

```http
GET /filtrareuseradmin HTTP/1.1
Content-Type: application/json
```
### Body
```
```
### Richiesta con successo
```
[
    {
        "id": 3,
        "userCf": "BNCMRA90C20D612Y",
        "vaccinoId": 4,
        "lottoId": 5,
        "dataVaccinazione": "2025-10-01T00:00:00.000Z",
        "createdAt": "2026-06-29T14:36:20.885Z",
        "updatedAt": "2026-06-29T14:36:20.885Z",
        "Vaccino": {
            "nome": "Antinfluenzale",
            "durataCopertura": 180
        },
        "LottoVaccino": {
            "codiceLotto": "FLU-2025-001"
        }
    }
]
```

## 🔐 /copertura

Rotta utilizzata per vedere le vaccinazioni con le rispettive coperture.
L'admin potrà vederle di tutti gli user, gli user solo di loro stessi.
Inoltre si ha la possibilità di cambiare l'ordine in modo crescente o decrescente tramite richiesta ?order=asc o desc
Il body è vuoto mentre se la richiesta ha successo il risultato sarà un json con tutte le vaccinazioni con le rispettive coperture.
Nell'esempio abbiamo utilizzato admin per vedere tutte le vaccinazioni e coperture in ordine decrescente

---

### 📥 Richiesta

```http
GET /copertura HTTP/1.1
Content-Type: application/json
```
### Body
```
```
### Richiesta con successo
```
[
    {
        "vaccinazioneId": 3,
        "userCf": "BNCMRA90C20D612Y",
        "vaccino": "Antinfluenzale",
        "dataVaccinazione": "2025-10-01T00:00:00.000Z",
        "fineCopertura": "2026-03-30T00:00:00.000Z",
        "giorniDifferenza": -91,
        "statoCoperura": "scaduta"
    },
    {
        "vaccinazioneId": 2,
        "userCf": "VRDLGI85B15F205X",
        "vaccino": "Moderna",
        "dataVaccinazione": "2025-03-10T00:00:00.000Z",
        "fineCopertura": "2026-03-10T00:00:00.000Z",
        "giorniDifferenza": -111,
        "statoCoperura": "scaduta"
    },
    {
        "vaccinazioneId": 1,
        "userCf": "RSSMRA80A01H501U",
        "vaccino": "Pfizer",
        "dataVaccinazione": "2025-02-15T00:00:00.000Z",
        "fineCopertura": "2025-08-14T00:00:00.000Z",
        "giorniDifferenza": -319,
        "statoCoperura": "scaduta"
    }
]
```

































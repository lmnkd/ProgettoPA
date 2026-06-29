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

## Obiettivo del progetto

L'obiettivo del progetto è lo sviluppo di un sistema backend che consenta la gestione delle vaccinazioni e dei relativi dati sanitari, al fine di dimostrare la comprensione dei concetti e delle buone pratiche relative allo sviluppo di API REST, autenticazione, gestione dati e architetture backend scalabili illustrate nel corso.

In generale, il sistema deve essere in grado di gestire i seguenti aspetti:

gestione dei vaccini e delle relative informazioni (nome, durata della copertura);
gestione delle dosi di vaccino (lotto, data di consegna, data di scadenza, disponibilità);
registrazione delle vaccinazioni effettuate agli utenti;
gestione degli utenti e delle relative informazioni identificative (es. codice fiscale);
generazione di documenti PDF contenenti lo storico delle vaccinazioni;
analisi e visualizzazione di statistiche sui vaccini e sulle coperture;
gestione della scadenza della copertura vaccinale degli utenti;
gestione di un sistema di token temporanei per l’accesso alle informazioni.

Il backend deve prevedere due tipologie principali di utenza:

utente (user): può consultare i propri dati vaccinali e richiedere informazioni personali;
operatore (operator): può registrare vaccinazioni e gestire i dati relativi a vaccini, dosi e somministrazioni.

Un operatore può essere anche un utente, e ogni utenza può avere più ruoli contemporaneamente. Il sistema di autorizzazione si basa su token JWT, che includono la lista dei ruoli e i metadati essenziali dell’utente (in particolare il codice fiscale).

Autenticazione e autorizzazione

Il sistema utilizza autenticazione basata su JWT (JSON Web Token).
Ogni richiesta autenticata è soggetta a controllo dei ruoli e del numero di token disponibili per l’utente.

Quando i token disponibili terminano, ogni richiesta successiva da parte dello stesso utente deve restituire errore 401 Unauthorized.

Funzionalità principali del sistema

Il backend deve supportare le seguenti operazioni:

inserimento di nuovi vaccini con relativa durata della copertura;
aggiunta di dosi di vaccino con lotto, data di consegna e scadenza;
consultazione dei vaccini con filtri su:
nome
disponibilità (maggiore, minore o intervallo)
scadenza (maggiore, minore o intervallo)
consultazione delle dosi disponibili per un vaccino con filtri sulla disponibilità;
inserimento di una vaccinazione per un utente con validazione di:
esistenza utente
validità lotto
scadenza vaccino
rispetto della copertura vaccinale
recupero dello storico vaccinazioni per utente in formato JSON e PDF;
generazione di statistiche aggregate sui vaccini (min, max, media, deviazione standard, distribuzioni mensili);
identificazione degli utenti con copertura vaccinale scaduta;
calcolo del tempo residuo o scaduto della copertura vaccinale per ogni vaccino;
generazione di un codice temporaneo (gestito tramite Redis) che consente l’accesso ai dati senza JWT per un tempo limitato.
Sistema di token temporanei

Il sistema prevede la possibilità di generare un codice univoco con durata limitata (N minuti) per l’accesso ai dati di un utente.
Tale meccanismo è gestito tramite Redis utilizzando chiavi con TTL, consentendo il bypass temporaneo dell’autenticazione JWT.

🛠 Requisiti tecnologici

Il backend è sviluppato in TypeScript e utilizza le seguenti tecnologie:

Node.js: runtime JavaScript lato server;
Express: framework per la creazione di API REST;
Sequelize: ORM per la gestione del database relazionale;
Redis: per la gestione dei token temporanei e cache;
PDFKit (o librerie equivalenti): per la generazione di documenti PDF;
RDBMS a scelta (es. PostgreSQL, MySQL o SQLite).
Qualità del software

Il progetto prevede inoltre:

utilizzo di middleware per autenticazione, validazione ed error handling;
gestione centralizzata degli errori tramite middleware dedicati;
utilizzo di Design Pattern, opportunamente documentati nel README;
sviluppo di seed iniziali per popolare il database con dati significativi;
test di middleware tramite Jest;
test delle API tramite Postman;
utilizzo di Docker o docker-compose per l’avvio dell’intero sistema.
gestione TTL con Redis

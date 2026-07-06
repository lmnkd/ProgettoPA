 
/*
    * Messaggi di successo restituiti nelle risposte HTTP (campo "message" del body).
    * Ogni controller seleziona la voce corrispondente all'operazione appena completata,
    * seguendo lo stesso schema di AppErrorsMessage per gli errori.
    */

export enum AppSuccessMessage {
  USER_CREATED = 'User crato correttamente.',
  USER_UPDATED = 'User aggiornato correttamente.',
  USER_DELETED = 'User eliminato correttamente.',
  LOGIN_SUCCESSFUL = 'Login effettuato con successo.',
  LOGOUT_SUCCESSFUL = 'Logout effettuato con successo.',
  PASSWORD_CHANGED = 'Password modificata con successo.',
  EMAIL_SENT = 'Email inviata correttamente.',
  VACCINO_CREATED = "Vaccino creato correttamente",
  VACCINO_UPDATED = "Vaccino aggiornato correttamente",
  VACCINO_DELETED = "Vaccino cancellato correttamente",
  TOKENS_UPDATED = "Token aggiornato correttamente",
  VACCINAZIONE_UPDATED = "Vaccizazione aggiornata correttamente",
  VACCINAZIONE_DELETED = "Vaccinazione cancellatta correttamente",
  VACCINAZIONE_CREATED = "Vaccinazione creata correttamente"
}
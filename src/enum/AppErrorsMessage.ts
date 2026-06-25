
/**
 * Ancora all'inizio, da aggiornare in base alle esigenze del progetto.
 */

export enum AppErrorsMessage {
    INVALID_CREDENTIALS = 'Credenziali non valide.',
    USER_NOT_FOUND = 'User non trovato.',
    UNAUTHORIZED_ACCESS = 'Accesso non autorizzato.',
    SERVER_ERROR = 'Si è verificato un errore imprevisto del server.',
    INVALID_INPUT = 'Input non valido fornito.',
    RESOURCE_NOT_FOUND = 'Risorsa richiesta non trovata.',
    OPERATION_FAILED = 'Operazione non riuscita.',
    PERMISSION_DENIED = 'Permesso negato per l\'operazione richiesta.',
    SESSION_EXPIRED = 'La sessione è scaduta. Per favore effettua nuovamente il login.',
    ACCOUNT_LOCKED = 'Il tuo account è stato bloccato. Per favore contatta il supporto.',
    PASSWORD_MISMATCH = 'Le password non corrispondono.',
    EMAIL_ALREADY_EXISTS = 'Un account con questo indirizzo email esiste già.',
    INVALID_JWT_TOKEN = 'Il token fornito non è valido o è scaduto.', 
    JWT_TOKENS_CREATION_FAILED = 'La creazione dei token JWT è fallita.',
    MISSING_TOKEN = "MISSING_TOKEN",
    TOKEN_EXPIRED = "TOKEN_EXPIRED",
    INVALID_TOKEN = "INVALID_TOKEN",
    VACCINO_ALREADY_EXISTS = "VACCINO_ALREADY_EXISTS",
    VACCINO_NOT_FOUND = "VACCINO_NOT_FOUND",
    NO_TOKENS_LEFT = "NO_TOKENS_LEFT",
    NEGATIVE_NUMBER_NOT_AVAILABLE = "NEGATIVE_NUMBER_NOT_AVAILABLE",
    VACCINAZIONE_NOT_FOUND = "VACCINAZIONE_NOT_FOUND",
    VACCINAZIONE_ALREADY_EXISTS = "VACCINAZIONE_ALREADY_EXISTS"
}       
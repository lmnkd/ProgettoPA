/*
    * Interfaccia per rappresentare il payload del token JWT dell'applicazione.
    * Contiene il codice fiscale dell'utente e un array di ruoli associati all'utente.
    * I ruoli possono essere "admin", "user", "operator" o "both".
    */

export interface AppJwtPayload {
    cf: string;
    roles: ("admin" | "user" | "operator" | "both")[];
}

// Composizione token
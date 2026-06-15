import { Request, Response, NextFunction } from "express";
import { AppErrorsMessage } from "../enum/AppErrorsMessage";



/**
 * Utilizzeremo Auth0 per gestire l'autenticazione e l'autorizzazione.
 * La funzione checkPermission verifica se l'utente ha il permesso richiesto.
 * In questo caso useremo scope per gestire i permessi. Lo scope è una stringa che contiene i permessi separati da spazi.
 * Ad esempio, uno scope potrebbe essere "read:users write:users delete:users".
 * La funzione checkPermission prende in input il permesso richiesto e verifica se l'utente ha quel permesso.
 * Se l'utente non ha il permesso, viene restituito un errore 403 (Forbidden).
 * Tutte le informazioni sono contenute nel token JWT, che viene decodificato e aggiunto alla richiesta dall'Auth0 middleware.
 * @param permission 
 * @returns 
 */
export const checkPermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const auth = (req as any).auth;
    const scope: string = auth?.payload?.scope || "";
    const scopeList = scope.split(" ");

    if (!scopeList.includes(permission)) {
      return res.status(403).json({ 
        error: AppErrorsMessage.PERMISSION_DENIED 
      });
    }
    next();
  };
};

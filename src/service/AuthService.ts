import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { privateKey } from "../config/keys";
import { AppJwtPayload } from "../types/jwt-payload";
import { userDao } from "../dao/UserDao";
import { AppErrorsName } from "../enum/AppErrorsName";

/*
    * Funzione di utilità per convertire un ruolo in un array di ruoli.
    * Se il ruolo è "both", restituisce un array contenente sia "user" che "operator".
    * Altrimenti, restituisce un array contenente solo il ruolo specificato.
    * @param role - Il ruolo dell'utente, che può essere "admin", "user", "operator" o "both".
    * @returns Un array di ruoli corrispondenti al ruolo specificato.
    */

function toRolesArray(role: 'admin' | 'user' | 'operator' | 'both'): ("admin" | "user" | "operator")[] {
    if (role === 'both') return ['user', 'operator'];
    return [role];
}

export class AuthService {

    // Funzione login che evita email sbagliata, controlla password e crea un JWT token all'avvenuto accesso
    async login(email: string, password: string): Promise<string> {
        const user = await userDao.findByEmail(email);
         console.log("USER RAW:", JSON.stringify(user?.dataValues)); // tutti i campi raw dal DB
         console.log("PASSWORD HASH:", user?.passwordHash); // deve essere non-null
    
        if (!user) {
            const err = new Error("Invalid credentials");
            err.name = AppErrorsName.INVALID_CREDENTIALS;
            throw err;
        }

        
        const valid = await bcrypt.compare(password, user.passwordHash);
        console.log("PASSWORD RICEVUTA:", JSON.stringify(password)); // JSON.stringify mostra eventuali caratteri nascosti
        console.log("BCRYPT VALID:", valid);
        if (!valid) {
            const err = new Error("Invalid credentials");
            err.name = AppErrorsName.INVALID_CREDENTIALS;
            throw err;
        }
        console.log("PASSWORD RICEVUTA:", JSON.stringify(password)); // JSON.stringify mostra eventuali caratteri nascosti
        console.log("BCRYPT VALID:", valid);

        const payload: AppJwtPayload = {
            cf: user.cf,
            roles: toRolesArray(user.role),
        };

        return jwt.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: process.env.JWT_EXPIRES_IN || "1h",
        });
    }
}

export const authService = new AuthService();
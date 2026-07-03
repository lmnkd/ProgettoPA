import { User } from "../model/User";

/**
 * Rimuove il passwordHash dall'oggetto User per evitare di esporlo nelle risposte API
 */
export function sanitizeUser(user: User): any {
    const userObj = user instanceof User ? user.toJSON() : user;
    const { passwordHash, ...userWithoutPassword } = userObj;
    return userWithoutPassword;
}

/**
 * Rimuove il passwordHash da un array di utenti
 */
export function sanitizeUsers(users: User[]): any[] {
    return users.map(sanitizeUser);
}

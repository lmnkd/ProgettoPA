import bcrypt from "bcrypt";
import { userDao } from "../dao/UserDao";



/*    * Servizio per la gestione degli utenti.
    * Fornisce metodi per creare, leggere, aggiornare e cancellare utenti, nonché per ottenere utenti con copertura vaccinale scaduta.
    * Utilizza il DAO UserDao per interagire con il database.
    */
const SALT_ROUNDS = 10;


/*    * Interfaccia per i dati di input necessari per creare un nuovo utente.
    * Contiene il codice fiscale, il nome, l'email, la password e il ruolo dell'utente.
    */
interface CreateUserInput {
    cf: string;
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'user' | 'operator' | 'both';
}

export class UserService {

    async createUser(data: CreateUserInput) {
        // l'unicità dell'email è già verificata dal middleware checkEmailNotExists
        const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

        return userDao.create({
            cf: data.cf,
            name: data.name,
            email: data.email,
            passwordHash,
            role: data.role,
        });
    }

    async getUserByCf(targetCf: string) {
        // l'esistenza è già verificata dal middleware checkUserExistsByParam
        return userDao.findById(targetCf);
    }

    async getAllUsers() {
        return userDao.findAll();
    }

    async updateUser(
        targetCf: string,
        data: Partial<{ name: string; email: string; role: 'admin' | 'user' | 'operator' | 'both' }>
    ) {
        // l'esistenza è già verificata dal middleware checkUserExistsByParam
        const updated = await userDao.update({ cf: targetCf }, data);
        return updated;
    }

/*    * Ottiene un report degli utenti con copertura vaccinale scaduta.
    * @param filters - Un oggetto contenente filtri opzionali per il nome del vaccino e i giorni minimi e massimi di scadenza della copertura.
    * @returns Un array di utenti con copertura vaccinale scaduta in base ai filtri forniti.
    */

    async getUsersWithExpiredCoverage(filters: {
        vaccino?: string;
        giorniMin?: number;
        giorniMax?: number;
    }) {
        return userDao.findUsersWithExpiredCoverage(filters);
    }

    async deleteUser(cf: string) {
        // l'esistenza è già verificata dal middleware checkUserExistsByParam
        await userDao.delete(cf);
    }
}

export const userService = new UserService();
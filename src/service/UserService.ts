import { userDao } from "../dao/UserDao";
import { User, UserCreationAttributes, UserAttributes } from "../model/User";
import { AppLogicError } from "../errors/App_Logic_Error";
import { AppErrorsName } from "../enum/AppErrorsName";


export class UserService {

    // Crea utente — controlla prima se email esiste già
    async createUser(data: UserCreationAttributes): Promise<User> {
        const existing = await userDao.findByEmail(data.email);
        if (existing) throw new AppLogicError(AppErrorsName.EMAIL_ALREADY_EXISTS);
        return await userDao.create(data);
    }

    // Legge utente — lancia errore se non esiste
    async getUserById(id: number): Promise<User> {
        const user = await userDao.findById(id);
        if (!user) throw new AppLogicError(AppErrorsName.USER_NOT_FOUND);
        return user;
    }

    // Ritorna tutti gli utentiid
    async getAllUsers(): Promise<User[]> {
        return await userDao.findAll();
    }

    // Aggiorna utente — controlla se esiste
    async updateUser( data: Partial<UserAttributes>, updatedData: Partial<UserAttributes>): Promise<User> {
        const user = await userDao.update(data, updatedData);
        if (!user) throw new AppLogicError(AppErrorsName.USER_NOT_FOUND);
        return user;
    }

    // Elimina utente — controlla se esiste
    async deleteUser(id: number): Promise<boolean> {
        const deleted = await userDao.delete(id);
        if (!deleted) throw new AppLogicError(AppErrorsName.USER_NOT_FOUND);
        return true;
    }

    // Legge utente per email — lancia errore se non esiste
    async getUserByEmail(email: string): Promise<User> {
        const user = await userDao.findByEmail(email);
        if (!user) throw new AppLogicError(AppErrorsName.USER_NOT_FOUND);
        return user;
    }
}

export const userService = new UserService();
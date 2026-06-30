import bcrypt from "bcrypt";
import { userDao } from "../dao/UserDao";
import { AppErrorsName } from "../enum/AppErrorsName";

const SALT_ROUNDS = 10;

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
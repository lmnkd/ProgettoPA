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
        const existing = await userDao.findByEmail(data.email);
        if (existing) {
            const err = new Error("Email already exists");
            err.name = AppErrorsName.EMAIL_ALREADY_EXISTS;
            throw err;
        }

        const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

        return userDao.create({
            cf: data.cf,
            name: data.name,
            email: data.email,
            passwordHash,
            role: data.role,
        });
    }

    // requesterCf/isOperator: chi sta chiedendo; targetCf: chi si vuole leggere
    async getUserByCf(targetCf: string) {
        const user = await userDao.findById(targetCf);
        if (!user) {
            const err = new Error("User not found");
            err.name = AppErrorsName.USER_NOT_FOUND;
            throw err;
        }

        return user;
    }

    async getAllUsers() {
        return userDao.findAll();
    }

    async updateUser(
        requesterCf: string,
        isOperator: boolean,
        targetCf: string,
        data: Partial<{ name: string; email: string; role: 'admin' | 'user' | 'operator' | 'both' }>
    ) {
        if (!isOperator && requesterCf !== targetCf) {
            const err = new Error("Permission denied");
            err.name = AppErrorsName.PERMISSION_DENIED;
            throw err;
        }

        const updated = await userDao.update({ cf: targetCf }, data);
        if (!updated) {
            const err = new Error("User not found");
            err.name = AppErrorsName.USER_NOT_FOUND;
            throw err;
        }

        return updated;
    }

    async getUsersWithExpiredCoverage(filters: {
        vaccino?: string;
        giorniMin?: number;
        giorniMax?: number;
    }) {

        return userDao.findUsersWithExpiredCoverage(
            filters
        );
    }

    async deleteUser(cf: string) {
        const deleted = await userDao.delete(cf);
        if (!deleted) {
            const err = new Error("User not found");
            err.name = AppErrorsName.USER_NOT_FOUND;
            throw err;
        }
    }
}

export const userService = new UserService();
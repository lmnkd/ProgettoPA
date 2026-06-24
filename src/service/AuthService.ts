import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { privateKey } from "../config/keys";
import { AppJwtPayload } from "../types/jwt-payload";
import { userDao } from "../dao/UserDao";
import { AppErrorsName } from "../enum/AppErrorsName";

function toRolesArray(role: 'user' | 'operator' | 'both'): ("user" | "operator")[] {
    if (role === 'both') return ['user', 'operator'];
    return [role];
}

export class AuthService {

    async login(email: string, password: string): Promise<string> {
        const user = await userDao.findByEmail(email);
        if (!user) {
            const err = new Error("Invalid credentials");
            err.name = AppErrorsName.INVALID_CREDENTIALS;
            throw err;
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            const err = new Error("Invalid credentials");
            err.name = AppErrorsName.INVALID_CREDENTIALS;
            throw err;
        }

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
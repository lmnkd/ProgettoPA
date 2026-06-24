import { Request, Response } from "express";
import { authService } from "../service/AuthService";
import { AppErrorsName } from "../enum/AppErrorsName";
import { AppErrorsMessage } from "../enum/AppErrorsMessage";

export class AuthController {

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const token = await authService.login(email, password);
            res.status(200).json({ token });
        } catch (error: any) {
            console.error("Errore durante il login:", error);
            if (error.name === AppErrorsName.INVALID_CREDENTIALS) {
                res.status(401).json({ error: AppErrorsMessage.INVALID_CREDENTIALS });
            } else {
                res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
            }
        }
    }
}

export const authController = new AuthController();
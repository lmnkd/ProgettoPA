// middleware/user.middleware.ts
import { Request, Response, NextFunction } from "express";
import { userDao } from "../dao/UserDao";
import { AppErrorsMessage } from "../enum/AppErrorsMessage";

export async function checkEmailNotExists(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email } = req.body;

    if (!email) {
        res.status(400).json({ error: AppErrorsMessage.MISSING_DATA });
        return;
    }

    const existing = await userDao.findByEmail(email);
    if (existing) {
        res.status(409).json({ error: AppErrorsMessage.EMAIL_ALREADY_EXISTS });
        return;
    }

    next();
}
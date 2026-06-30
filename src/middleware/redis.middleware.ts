import { Request, Response, NextFunction } from "express";
import { userDao } from "../dao/UserDao";
import { AppErrorsMessage } from "../enum/AppErrorsMessage";

export async function userExist(req: Request, res: Response, next: NextFunction): Promise<void> {
    const cf = req.body?.cf || req.params?.cf; // optional chaining, evita il crash

    if (!cf) {
        res.status(400).json({ error: AppErrorsMessage.MISSING_DATA });
        return;
    }

    const user = await userDao.findById(cf);
    if (!user) {
        res.status(404).json({ error: AppErrorsMessage.USER_NOT_FOUND });
        return;
    }

    (req as any).targetUser = user;
    next();
}
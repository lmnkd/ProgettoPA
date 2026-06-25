// middleware/tokenMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { userDao } from "../dao/UserDao";
import { AppJwtPayload } from "../types/jwt-payload";
import { AppErrorsMessage } from "../enum/AppErrorsMessage";


// Funzione per check dei token

export async function checkTokenAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
    const user = (req as any).user as AppJwtPayload;

    const ok = await userDao.decrementTokenIfAvailable(user.cf);
    if (!ok) {
        res.status(401).json({ error: AppErrorsMessage.NO_TOKENS_LEFT });
        return;
    }
    next();
}
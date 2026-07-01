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


// Funzione per check dei numeri negativi e corretta formattazzione.
export async function correctAmount(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { amount } = req.body;

    if (amount === undefined || amount === null) {
        res.status(400).json({ error: AppErrorsMessage.MISSING_DATA });
        return;
    }

    if (typeof amount !== "number" || isNaN(amount)) {
        res.status(400).json({ error: AppErrorsMessage.INVALID_DATA });
        return;
    }

    if (amount < 0) {
        res.status(400).json({ error: AppErrorsMessage.NEGATIVE_NUMBER_NOT_AVAILABLE });
        return;
    }

    next();
}
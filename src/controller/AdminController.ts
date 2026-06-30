import { Request, Response } from "express";
import { userService } from "../service/UserService";
import { AppErrorsName } from "../enum/AppErrorsName";
import { AppErrorsMessage } from "../enum/AppErrorsMessage";
import { AppSuccessMessage } from "../enum/AppSuccessMessage";
import {userDao} from "../dao/UserDao"
import { AppJwtPayload } from "../types/jwt-payload";

export class AdminController{

    // Metodo per aggiungere token ad un certo User (sia operator che user)

 async increaseUserTokens(req: Request, res: Response): Promise<void> {
    try {
        const { amount } = req.body;
        const targetUser = (req as any).targetUser;

        const user = await userDao.increaseTokens(targetUser.cf, amount);

        res.status(200).json({ message: AppSuccessMessage.TOKENS_UPDATED, user });
    } catch {
        res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
    }
 }
}

export const adminController = new AdminController();
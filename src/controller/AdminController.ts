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

            // Nonostante ci siano alcuni middleware questa dicitura verrà usata lo stesso per evitare problemi di privilegi (possibile rimozione in futuro)
            const requester = (req as any).user as AppJwtPayload;

            // Verifica che l'utente sia admin
            if (!requester.roles.includes("admin")) {
                res.status(403).json({ error: AppErrorsMessage.PERMISSION_DENIED });
                return;
            }
            
            const { amount } = req.body;
            
            // Verifica che amount sia positivo (prima di fare l'operazione), anche qui potremmo usare un middleware in futuro
            if (amount < 0) {
                res.status(400).json({error: AppErrorsMessage.NEGATIVE_NUMBER_NOT_AVAILABLE});
                return;
            }
            
            // Stessa cosa qui, abbiamo preferito inserire controlli anche dentro alcuni metodi

            const user = await userDao.increaseTokens(req.params.cf, amount);
            if (!user) {
                res.status(404).json({ error: AppErrorsMessage.USER_NOT_FOUND });
                return;
            }
            res.status(200).json({ message: AppSuccessMessage.TOKENS_UPDATED, user });
        } catch {
            res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
        }
    }

}

export const adminController = new AdminController();
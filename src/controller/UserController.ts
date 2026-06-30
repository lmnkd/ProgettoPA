import { Request, Response } from "express";
import { userService } from "../service/UserService";
import { AppErrorsMessage } from "../enum/AppErrorsMessage";
import { AppSuccessMessage } from "../enum/AppSuccessMessage";

export class UserController {

    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const user = await userService.createUser(req.body);
            res.status(201).json({ message: AppSuccessMessage.USER_CREATED, user });
        } catch {
            res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
        }
    }

    // GET /api/users/:cf — utente già verificato dal middleware checkUserExistsByParam
    async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const user = (req as any).targetUser;
            res.status(200).json(user);
        } catch {
            res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
        }
    }

    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await userService.getAllUsers();
            res.status(200).json(users);
        } catch {
            res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
        }
    }

    async getUsersWithExpiredCoverage(req: Request, res: Response): Promise<void> {
        try {
            const utenti = await userService.getUsersWithExpiredCoverage({
                vaccino: req.query.vaccino as string,
                giorniMin: req.query.giorniMin ? Number(req.query.giorniMin) : undefined,
                giorniMax: req.query.giorniMax ? Number(req.query.giorniMax) : undefined,
            });

            res.status(200).json(utenti);
        } catch {
            res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
        }
    }

    // PUT /api/users/:cf — utente già verificato dal middleware checkUserExistsByParam
    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const user = await userService.updateUser(req.params.cf, req.body);
            res.status(200).json({ message: AppSuccessMessage.USER_UPDATED, user });
        } catch {
            res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
        }
    }

    // DELETE /api/users/:cf — utente già verificato dal middleware checkUserExistsByParam
    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            await userService.deleteUser(req.params.cf);
            res.status(200).json({ message: AppSuccessMessage.USER_DELETED });
        } catch {
            res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
        }
    }
}

export const userController = new UserController();
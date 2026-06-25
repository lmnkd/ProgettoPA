import { Request, Response } from "express";
import { userService } from "../service/UserService";
import { AppErrorsName } from "../enum/AppErrorsName";
import { AppErrorsMessage } from "../enum/AppErrorsMessage";
import { AppSuccessMessage } from "../enum/AppSuccessMessage";
import { AppJwtPayload } from "../types/jwt-payload";

export class UserController {

    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const user = await userService.createUser(req.body);
            res.status(201).json({ message: AppSuccessMessage.USER_CREATED, user });
        } catch (error: any) {
            if (error.name === AppErrorsName.EMAIL_ALREADY_EXISTS) {
                res.status(409).json({ error: AppErrorsMessage.EMAIL_ALREADY_EXISTS });
            } else {
                res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
            }
        }
    }

    // GET /api/users/:id — operator vede tutti, user solo se stesso (CF)
    async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const requester = (req as any).user as AppJwtPayload;
            const isOperator = requester.roles.includes("operator");

            const user = await userService.getUserByCf(requester.cf, isOperator, req.params.cf);
            res.status(200).json(user);
        } catch (error: any) {
            if (error.name === AppErrorsName.USER_NOT_FOUND) {
                res.status(404).json({ error: AppErrorsMessage.USER_NOT_FOUND });
            } else if (error.name === AppErrorsName.PERMISSION_DENIED) {
                res.status(403).json({ error: AppErrorsMessage.PERMISSION_DENIED });
            } else {
                res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
            }
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

    // Anche per update potremmo aggiornare il codice
    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const requester = (req as any).user as AppJwtPayload;
            const isOperator = requester.roles.includes("operator");

            const user = await userService.updateUser(
                requester.cf,
                isOperator,
                req.params.cf,
                req.body
            );
            res.status(200).json({ message: AppSuccessMessage.USER_UPDATED, user });
        } catch (error: any) {
            if (error.name === AppErrorsName.USER_NOT_FOUND) {
                res.status(404).json({ error: AppErrorsMessage.USER_NOT_FOUND });
            } else if (error.name === AppErrorsName.PERMISSION_DENIED) {
                res.status(403).json({ error: AppErrorsMessage.PERMISSION_DENIED });
            } else {
                res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
            }
        }
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            await userService.deleteUser(req.params.cf);
            res.status(200).json({ message: AppSuccessMessage.USER_DELETED });
        } catch (error: any) {
            if (error.name === AppErrorsName.USER_NOT_FOUND) {
                res.status(404).json({ error: AppErrorsMessage.USER_NOT_FOUND });
            } else {
                res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
            }
        }
    }
}

export const userController = new UserController();
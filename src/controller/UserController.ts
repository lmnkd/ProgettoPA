import { Request, Response } from "express";
import { userService } from "../service/UserService";
import { AppErrorsName } from "../enum/AppErrorsName";
import { AppErrorsMessage } from "../enum/AppErrorsMessage";
import { AppSuccessMessage } from "../enum/AppSuccessMessage";

export class UserController {

    // POST /api/users
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

    // GET /api/users/:id
    async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const user = await userService.getUserById(Number(req.params.id));
            res.status(200).json(user);
        } catch (error: any) {
            if (error.name === AppErrorsName.USER_NOT_FOUND) {
                res.status(404).json({ error: AppErrorsMessage.USER_NOT_FOUND });
            } else {
                res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
            }
        }
    }

    // GET /api/users
    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await userService.getAllUsers();
            res.status(200).json(users);
        } catch {
            res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
        }
    }

    // PUT /api/users/:id
    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const user = await userService.updateUser({ id: Number(req.params.id) }, req.body);
            res.status(200).json({ message: AppSuccessMessage.USER_UPDATED, user });
        } catch (error: any) {
            if (error.name === AppErrorsName.USER_NOT_FOUND) {
                res.status(404).json({ error: AppErrorsMessage.USER_NOT_FOUND });
            } else {
                res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
            }
        }
    }

    // DELETE /api/users/:id
    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            await userService.deleteUser(Number(req.params.id));
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
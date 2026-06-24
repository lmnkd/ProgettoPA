import { Request, Response } from "express";
import { vaccinoService } from "../service/VaccinoService";
import { AppErrorsName } from "../enum/AppErrorsName";
import { AppErrorsMessage } from "../enum/AppErrorsMessage";
import { AppSuccessMessage } from "../enum/AppSuccessMessage";
import { AppJwtPayload } from "../types/jwt-payload";

export class VaccinoController {

    async createVaccino(req: Request, res: Response): Promise<void> {
        try {

            const requester = (req as any).user as AppJwtPayload;
            
            // Verifica che l'utente sia operator
            if (!requester.roles.includes("operator")) {
                res.status(403).json({ error: AppErrorsMessage.PERMISSION_DENIED });
                return;
            }

            const vaccino = await vaccinoService.createVaccino(req.body);
            res.status(201).json({ message: AppSuccessMessage.VACCINO_CREATED, vaccino });
        } catch (error: any) {
            if (error.name === AppErrorsName.VACCINO_ALREADY_EXISTS) {
                res.status(409).json({ error: AppErrorsMessage.VACCINO_ALREADY_EXISTS });
            } else {
                res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
            }
        }
    }   

    async getVaccinoById(req: Request, res: Response): Promise<void> {
        try {
            const requester = (req as any).user as AppJwtPayload;
            const isOperator = requester.roles.includes("operator");
            const targetId = Number(req.params.id);
            const vaccino = await vaccinoService.getVaccinoById(requester.cf, isOperator, targetId);
            res.status(200).json(vaccino);
        } catch (error: any) {
            if (error.name === AppErrorsName.VACCINO_NOT_FOUND) {
                res.status(404).json({ error: AppErrorsMessage.VACCINO_NOT_FOUND });
            } else if (error.name === AppErrorsName.PERMISSION_DENIED) {
                res.status(403).json({ error: AppErrorsMessage.PERMISSION_DENIED });
            } else {
                res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
            }
        }
    }   

    async getAllVaccini(req: Request, res: Response): Promise<void> {
        try {
            const requester = (req as any).user as AppJwtPayload;
            const isOperator = requester.roles.includes("operator");
            const vaccini = await vaccinoService.getAllVaccini(requester.cf, isOperator);
            res.status(200).json(vaccini);
        } catch (error: any) {
            if (error.name === AppErrorsName.PERMISSION_DENIED) {
                res.status(403).json({ error: AppErrorsMessage.PERMISSION_DENIED });
            } else {
                res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
            }
        }   
    }

    async updateVaccino(req: Request, res: Response): Promise<void> {
        try {
            const requester = (req as any).user as AppJwtPayload;   
            const isOperator = requester.roles.includes("operator");
            const targetId = Number(req.params.id);
        const vaccino = await vaccinoService.updateVaccino(
                isOperator,
                targetId,
                req.body
            );
            res.status(200).json({ message: AppSuccessMessage.VACCINO_UPDATED, vaccino });
        } catch (error: any) {
            if (error.name === AppErrorsName.VACCINO_NOT_FOUND) {
                res.status(404).json({ error: AppErrorsMessage.VACCINO_NOT_FOUND });
            } else if (error.name === AppErrorsName.PERMISSION_DENIED) {
                res.status(403).json({ error: AppErrorsMessage.PERMISSION_DENIED });
            } else {
                res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
            }
        }   
    }

    async deleteVaccino(req: Request, res: Response): Promise<void> {
        try {
            const requester = (req as any).user as AppJwtPayload;
            const isOperator = requester.roles.includes("operator");
            const targetId = Number(req.params.id);
            await vaccinoService.deleteVaccino(isOperator, targetId);
            res.status(200).json({ message: AppSuccessMessage.VACCINO_DELETED });
        } catch (error: any) {
            if (error.name === AppErrorsName.VACCINO_NOT_FOUND) {
                res.status(404).json({ error: AppErrorsMessage.VACCINO_NOT_FOUND });
            } else if (error.name === AppErrorsName.PERMISSION_DENIED) {
                res.status(403).json({ error: AppErrorsMessage.PERMISSION_DENIED });
            } else {
                res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
            }   
        }
    }

}

export const vaccinoController = new VaccinoController();
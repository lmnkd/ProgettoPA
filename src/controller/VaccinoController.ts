import { Request, Response } from "express";
import { vaccinoService } from "../service/VaccinoService";
import { AppErrorsMessage } from "../enum/AppErrorsMessage";
import { AppSuccessMessage } from "../enum/AppSuccessMessage";

export class VaccinoController {

    async createVaccino(req: Request, res: Response): Promise<void> {
        try {
            const vaccino = await vaccinoService.createVaccino(req.body);
            res.status(201).json({ message: AppSuccessMessage.VACCINO_CREATED, vaccino });
        } catch {
            res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
        }
    }

    // vaccino già verificato dal middleware checkVaccinoExistsById
    async getVaccinoById(req: Request, res: Response): Promise<void> {
        try {
            const vaccino = (req as any).targetVaccino;
            res.status(200).json(vaccino);
        } catch {
            res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
        }
    }

    async getStatistiche(req: Request, res: Response): Promise<void> {
        try {
            const statistiche = await vaccinoService.getStatistiche();
            res.status(200).json(statistiche);
        } catch {
            res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
        }
    }

    async getStatisticheCopertura(req: Request, res: Response): Promise<void> {
        try {
            const statistiche = await vaccinoService.getStatisticheCopertura();
            res.status(200).json(statistiche);
        } catch {
            res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
        }
    }

    async searchVaccini(req: Request, res: Response): Promise<void> {
        try {
            const vaccini = await vaccinoService.searchVaccini(req.query);
            res.status(200).json(vaccini);
        } catch {
            res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
        }
    }

    async getAllVaccini(req: Request, res: Response): Promise<void> {
        try {
            const vaccini = await vaccinoService.getAllVaccini();
            res.status(200).json(vaccini);
        } catch {
            res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
        }
    }

    // vaccino e unicità nome già verificati dai middleware
    async updateVaccino(req: Request, res: Response): Promise<void> {
        try {
            const targetId = Number(req.params.id);
            const vaccino = await vaccinoService.updateVaccino(targetId, req.body);
            res.status(200).json({ message: AppSuccessMessage.VACCINO_UPDATED, vaccino });
        } catch {
            res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
        }
    }

    // vaccino già verificato dal middleware checkVaccinoExistsById
    async deleteVaccino(req: Request, res: Response): Promise<void> {
        try {
            const targetId = Number(req.params.id);
            await vaccinoService.deleteVaccino(targetId);
            res.status(200).json({ message: AppSuccessMessage.VACCINO_DELETED });
        } catch {
            res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
        }
    }
}

export const vaccinoController = new VaccinoController();
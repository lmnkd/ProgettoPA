import { Request, Response } from "express";
import { lottoVaccinoService } from "../service/LottoVaccinoService";
import { AppErrorsMessage } from "../enum/AppErrorsMessage";

export class LottoVaccinoController {

    async createLotto(req: Request, res: Response): Promise<void> {
        try {
            const vaccinoId = Number(req.params.vaccinoId);
            const lotto = await lottoVaccinoService.createLotto(vaccinoId, req.body);
            res.status(201).json(lotto);
        } catch {
            res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
        }
    }

    // vaccino già verificato dal middleware checkVaccinoExists
    // filtro disponibilità opzionale: ?min=k&max=k2
    async getLottiByVaccino(req: Request, res: Response): Promise<void> {
        try {
            const vaccinoId = Number(req.params.vaccinoId);

            const min = req.query.min !== undefined ? Number(req.query.min) : undefined;
            const max = req.query.max !== undefined ? Number(req.query.max) : undefined;

            const lotti = await lottoVaccinoService.getLottiByVaccino(vaccinoId, min, max);

            res.status(200).json(lotti);
        } catch {
            res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
        }
    }
}

export const lottoVaccinoController = new LottoVaccinoController();
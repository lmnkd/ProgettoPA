import { Request, Response } from "express";
import { lottoVaccinoService } from "../service/LottoVaccinoService";
import { AppJwtPayload } from "../types/jwt-payload";
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

    async getLottiByVaccino(req: Request, res: Response): Promise<void> {
        try {
            const vaccinoId = Number(req.params.vaccinoId);

            const lotti = await lottoVaccinoService.getLottiByVaccino(vaccinoId);

            res.status(200).json(lotti);

        } catch {
            res.status(500).json({ error: "SERVER_ERROR" });
        }
    }
}

export const lottoVaccinoController = new LottoVaccinoController();
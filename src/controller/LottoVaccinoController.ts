import { Request, Response } from "express";
import { lottoVaccinoService } from "../service/LottoVaccinoService";
import { AppJwtPayload } from "../types/jwt-payload";

export class LottoVaccinoController {

    async createLotto(req: Request, res: Response): Promise<void> {

        console.log("=== CREATE LOTTO ===");

        try {
            const requester = (req as any).user as AppJwtPayload;

            if (!requester.roles.includes("operator")) {
                res.status(403).json({ error: "PERMISSION_DENIED" });
                return;
            }

            const vaccinoId = Number(req.params.vaccinoId);

            const lotto = await lottoVaccinoService.createLotto(
                vaccinoId,
                req.body
            );

            console.log("RISULTATO CREATE:", lotto);

            res.status(201).json(lotto);

        } catch (error: any) {

            if (error.message === "VACCINO_NOT_FOUND") {
                res.status(404).json({ error: error.message });
                return;
            }

            if (error.message === "LOTTO_ALREADY_EXISTS") {
                res.status(409).json({ error: error.message });
                return;
            }

            res.status(500).json({ error: "SERVER_ERROR" });
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
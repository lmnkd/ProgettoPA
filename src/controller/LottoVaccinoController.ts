import { Request, Response } from "express";
import { lottoVaccinoService } from "../service/LottoVaccinoService";
import { AppErrorsMessage } from "../enum/AppErrorsMessage";

export class LottoVaccinoController {

    /*
        * Crea un nuovo lotto per un vaccino specifico.
        * @param req - La richiesta HTTP contenente l'ID del vaccino e i dati del lotto.
        * @param res - La risposta HTTP che conterrà il lotto creato o un messaggio di errore.
        */

    async createLotto(req: Request, res: Response): Promise<void> {
        try {
            const vaccinoId = Number(req.params.vaccinoId);
            const lotto = await lottoVaccinoService.createLotto(vaccinoId, req.body);
            res.status(201).json(lotto);
        } catch {
            res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
        }
    }

   
    /*
        * Recupera tutti i lotti disponibili per un vaccino specifico.
        * @param req - La richiesta HTTP contenente l'ID del vaccino, e opzionalmente i parametri di query min e max per filtrare i lotti in base alla disponibilità.
        * @param res - La risposta HTTP che conterrà l'elenco dei lotti o un messaggio di errore.
        */
    
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
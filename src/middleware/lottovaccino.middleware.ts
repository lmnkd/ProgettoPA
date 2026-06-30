import { Request, Response, NextFunction } from "express";
import { vaccinoDao } from "../dao/VaccinoDao";
import { lottoVaccinoDao } from "../dao/LottoVaccinoDao";
import { AppErrorsMessage } from "../enum/AppErrorsMessage";

// 1. Verifica che il vaccino esista
export async function checkVaccinoExists(req: Request, res: Response, next: NextFunction): Promise<void> {
    const vaccinoId = Number(req.params.vaccinoId);

    if (isNaN(vaccinoId)) {
        res.status(400).json({ error: AppErrorsMessage.MISSING_DATA });
        return;
    }

    const vaccino = await vaccinoDao.findById(vaccinoId);
    if (!vaccino) {
        res.status(404).json({ error: AppErrorsMessage.VACCINO_NOT_FOUND });
        return;
    }

    (req as any).vaccino = vaccino;
    next();
}

// 2. Verifica che il codice lotto non sia già usato
export async function checkCodiceLottoUnique(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { codiceLotto } = req.body;

    if (!codiceLotto) {
        res.status(400).json({ error: AppErrorsMessage.MISSING_DATA });
        return;
    }

    const existing = await lottoVaccinoDao.findByCodiceLotto(codiceLotto);
    if (existing) {
        res.status(409).json({ error: AppErrorsMessage.LOTTO_ALREADY_EXISTS });
        return;
    }

    next();
}
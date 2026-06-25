import { Request, Response, NextFunction } from "express";
import { userDao } from "../dao/UserDao";
import { lottoVaccinoDao } from "../dao/LottoVaccinoDao";
import { vaccinoDao } from "../dao/VaccinoDao";
import { vaccinazioneDao } from "../dao/VaccinazioneDao";
import { AppErrorsMessage } from "../enum/AppErrorsMessage";

// 1. Utente esistente
export async function checkUserExists(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { cf } = req.body;

    if (!cf) {
        res.status(400).json({ error: AppErrorsMessage.MISSING_DATA });
        return;
    }

    const user = await userDao.findById(cf);
    if (!user) {
        res.status(404).json({ error: AppErrorsMessage.USER_NOT_FOUND });
        return;
    }

    (req as any).targetUser = user;
    next();
}

// 2. Lotto valido
export async function checkLottoValid(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { lotto_id } = req.body;

    if (!lotto_id) {
        res.status(400).json({ error: AppErrorsMessage.MISSING_DATA });
        return;
    }

    const lotto = await lottoVaccinoDao.findById(lotto_id);
    if (!lotto) {
        res.status(404).json({ error: AppErrorsMessage.LOTTO_NOT_FOUND });
        return;
    }

    (req as any).lotto = lotto;
    next();
}

// 3. Vaccino (lotto) non scaduto rispetto alla data di vaccinazione
export async function checkVaccineNotExpired(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { data_vaccinazione } = req.body;
    const lotto = (req as any).lotto;

    if (!data_vaccinazione) {
        res.status(400).json({ error: AppErrorsMessage.MISSING_DATA });
        return;
    }

    const dataVacc = new Date(data_vaccinazione);

    if (isNaN(dataVacc.getTime())) {
        res.status(400).json({ error: AppErrorsMessage.INVALID_DATE });
        return;
    }

    if (dataVacc > new Date(lotto.dataScadenza)) {
        res.status(409).json({ error: AppErrorsMessage.VACCINE_EXPIRED });
        return;
    }

    (req as any).dataVaccinazione = dataVacc;
    next();
}

// 4. Copertura non ancora esaurita (vaccinazione anticipata)
export async function checkCoverageExpired(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { cf } = req.body;
    const lotto = (req as any).lotto;
    const dataVacc = (req as any).dataVaccinazione;

    const vaccino = await vaccinoDao.findById(lotto.vaccinoId);
    if (!vaccino) {
        res.status(404).json({ error: AppErrorsMessage.VACCINO_NOT_FOUND });
        return;
    }

    const lastVaccinazione = await vaccinazioneDao.findLastByUserAndVaccino(cf, lotto.vaccinoId);

    if (lastVaccinazione) {
        const coverageEnd = new Date(lastVaccinazione.dataVaccinazione);
        coverageEnd.setDate(coverageEnd.getDate() + vaccino.durataCopertura);

        if (dataVacc < coverageEnd) {
            res.status(409).json({ error: AppErrorsMessage.COVERAGE_NOT_EXPIRED });
            return;
        }
    }

    (req as any).vaccino = vaccino;
    next();
}

import { Request, Response, NextFunction } from "express";
import { vaccinoDao } from "../dao/VaccinoDao";
import { AppErrorsMessage } from "../enum/AppErrorsMessage";

// Verifica che il vaccino esista (per get singolo, update, delete)
export async function checkVaccinoExistsById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const targetId = Number(req.params.id);

    if (isNaN(targetId)) {
        res.status(400).json({ error: AppErrorsMessage.MISSING_DATA });
        return;
    }

    const vaccino = await vaccinoDao.findById(targetId);
    if (!vaccino) {
        res.status(404).json({ error: AppErrorsMessage.VACCINO_NOT_FOUND });
        return;
    }

    (req as any).targetVaccino = vaccino;
    next();
}

// Verifica che il nome non sia già usato da un altro vaccino (per create e update)
export async function checkNomeVaccinoUnique(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { nome } = req.body;

    if (!nome) {
        // in update il nome può essere assente (campo opzionale), si passa oltre
        next();
        return;
    }

    const existing = await vaccinoDao.findByNome(nome);
    const targetId = req.params.id ? Number(req.params.id) : undefined;

    if (existing && existing.id !== targetId) {
        res.status(409).json({ error: AppErrorsMessage.VACCINO_ALREADY_EXISTS });
        return;
    }

    next();
}
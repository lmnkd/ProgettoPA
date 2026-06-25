import { Request, Response } from "express";
import { vaccinazioneService } from "../service/VaccinazioneService";
import { AppErrorsName } from "../enum/AppErrorsName";
import { AppErrorsMessage } from "../enum/AppErrorsMessage";
import { AppSuccessMessage } from "../enum/AppSuccessMessage";
import { AppJwtPayload } from "../types/jwt-payload";

export class VaccinazioneController {

    async createVaccinazione(req: Request, res: Response): Promise<void> {
        try {
            // Values are prepared by vaccination middleware: checkUserExists, checkLottoValid,
            // checkVaccineNotExpired, checkCoverageExpired
            const { cf } = req.body;
            const targetUser = (req as any).targetUser; // set by checkUserExists
            const lotto = (req as any).lotto; // set by checkLottoValid
            const vaccino = (req as any).vaccino; // set by checkCoverageExpired
            const dataVaccinazione = (req as any).dataVaccinazione; // set by checkVaccineNotExpired

            const vaccinazione = await vaccinazioneService.createVaccinazione({
                user_cf: cf,
                lotto_id: lotto.id,
                vaccino_id: vaccino.id,
                data_vaccinazione: dataVaccinazione,
            });

            res.status(201).json({ message: AppSuccessMessage.VACCINAZIONE_CREATED, vaccinazione });
        } catch (error: any) {
            // Service now only creates; middleware already returned specific errors where needed.
            res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
        }
    }

async getVaccinazioneById(req: Request, res: Response): Promise<void> {
        try {
            const targetId = Number(req.params.id);
            const vaccinazione = await vaccinazioneService.getVaccinazioneById(targetId);
            res.status(200).json(vaccinazione);
        } catch (error: any) {
            if (error.name === AppErrorsName.VACCINAZIONE_NOT_FOUND) {
                res.status(404).json({ error: AppErrorsMessage.VACCINAZIONE_NOT_FOUND });
            } else if (error.name === AppErrorsName.PERMISSION_DENIED) {
                res.status(403).json({ error: AppErrorsMessage.PERMISSION_DENIED });
            } else {
                res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
            }
        }
    }   

    async getAllVaccinazioni(req: Request, res: Response): Promise<void> {
        try {
            const vaccinazioni = await vaccinazioneService.getAllVaccinazioni();
            res.status(200).json(vaccinazioni);
        } catch (error: any) {
            if (error.name === AppErrorsName.PERMISSION_DENIED) {
                res.status(403).json({ error: AppErrorsMessage.PERMISSION_DENIED });
            } else {
                res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
            }
        }   
    }

    async updateVaccinazione(req: Request, res: Response): Promise<void> {
        try {
            const targetId = Number(req.params.id);
            const vaccinazione = await vaccinazioneService.updateVaccinazione(
                targetId,
                req.body
            );
            res.status(200).json({ message: AppSuccessMessage.VACCINAZIONE_UPDATED, vaccinazione });
        } catch (error: any) {
            if (error.name === AppErrorsName.VACCINAZIONE_NOT_FOUND) {
                res.status(404).json({ error: AppErrorsMessage.VACCINAZIONE_NOT_FOUND });
            } else if (error.name === AppErrorsName.PERMISSION_DENIED) {
                res.status(403).json({ error: AppErrorsMessage.PERMISSION_DENIED });
            } else {
                res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
            }
        }   
    }

    async deleteVaccinazione(req: Request, res: Response): Promise<void> {
        try {
            const targetId = Number(req.params.id);
            await vaccinazioneService.deleteVaccinazione(targetId);
            res.status(200).json({ message: AppSuccessMessage.VACCINAZIONE_DELETED });
        } catch (error: any) {
            if (error.name === AppErrorsName.VACCINAZIONE_NOT_FOUND) {
                res.status(404).json({ error: AppErrorsMessage.VACCINAZIONE_NOT_FOUND });
            } else if (error.name === AppErrorsName.PERMISSION_DENIED) {
                res.status(403).json({ error: AppErrorsMessage.PERMISSION_DENIED });
            } else {
                res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
            }   
        }
    }

}

export const vaccinazioneController = new VaccinazioneController();
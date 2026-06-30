import { Request, Response } from "express";
import { vaccinazioneService } from "../service/VaccinazioneService";
import { AppErrorsName } from "../enum/AppErrorsName";
import { AppErrorsMessage } from "../enum/AppErrorsMessage";
import { AppSuccessMessage } from "../enum/AppSuccessMessage";
import { AppJwtPayload } from "../types/jwt-payload";
import redis from "../config/redis";

export class VaccinazioneController {

    async getCoperturaByCode(req: Request, res: Response): Promise<void> {
        try {
            const code =
                (req.query.code as string) ||
                (req.headers["x-access-code"] as string) ||
                (req.body?.code as string);

            if (!code) {
                res.status(400).json({ error: AppErrorsMessage.MISSING_DATA });
                return;
            }

            const cf = await redis.get(`copertura:${code}`);

            if (!cf) {
                res.status(401).json({ error: AppErrorsMessage.INVALID_TOKEN });
                return;
            }

            const order = (req.query.order as string) === "desc" ? "desc" : "asc";

            const report = await vaccinazioneService.getCoperturaReport(cf, order);

            res.status(200).json(report);
        } catch {
            res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
        }
    }

    // cf già verificato dal middleware userExist, disponibile in req.targetUser
    async generateCoperturaCode(req: Request, res: Response): Promise<void> {
        try {
            const targetUser = (req as any).targetUser;
            const cf = targetUser.cf;

            const code = await vaccinazioneService.createCoperturaCode(cf, 10);

            res.status(200).json({
                code,
                cf,
                expiresIn: 600
            });
        } catch {
            res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
        }
    }

    // tutti i dati (targetUser, lotto, vaccino, dataVaccinazione) arrivano già validati dai middleware in catena
    async createVaccinazione(req: Request, res: Response): Promise<void> {
        try {
            const targetUser = (req as any).targetUser;
            const lotto = (req as any).lotto;
            const vaccino = (req as any).vaccino;
            const dataVaccinazione = (req as any).dataVaccinazione;

            const vaccinazione = await vaccinazioneService.createVaccinazione({
                user_cf: targetUser.cf,
                lotto_id: lotto.id,
                vaccino_id: vaccino.id,
                data_vaccinazione: dataVaccinazione,
            });

            res.status(201).json({ message: AppSuccessMessage.VACCINAZIONE_CREATED, vaccinazione });
        } catch {
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
            } else {
                res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
            }
        }
    }

    async getAllVaccinazioni(req: Request, res: Response): Promise<void> {
        try {
            const vaccinazioni = await vaccinazioneService.getAllVaccinazioni();
            res.status(200).json(vaccinazioni);
        } catch {
            res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
        }
    }

    async updateVaccinazione(req: Request, res: Response): Promise<void> {
        try {
            const targetId = Number(req.params.id);
            const vaccinazione = await vaccinazioneService.updateVaccinazione(targetId, req.body);
            res.status(200).json({ message: AppSuccessMessage.VACCINAZIONE_UPDATED, vaccinazione });
        } catch (error: any) {
            if (error.name === AppErrorsName.VACCINAZIONE_NOT_FOUND) {
                res.status(404).json({ error: AppErrorsMessage.VACCINAZIONE_NOT_FOUND });
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
            } else {
                res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
            }
        }
    }

    // [A,U]: admin specifica il CF in query, user usa il proprio dal JWT
    async pdfVaccinazione(req: Request, res: Response): Promise<void> {
        try {
            const requester = (req as any).user as AppJwtPayload;
            const isAdmin = requester.roles?.includes("admin") || requester.roles?.includes("operator");

            let targetCf: string;

            if (isAdmin) {
                const cfParam = req.query.cf as string;
                if (!cfParam) {
                    res.status(400).json({ error: AppErrorsMessage.MISSING_DATA });
                    return;
                }
                targetCf = cfParam;
            } else {
                targetCf = requester.cf;
            }

            const pdfBuffer = await vaccinazioneService.generatePdfReport(targetCf);

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename="vaccinazioni_${targetCf}.pdf"`);

            res.status(200).send(pdfBuffer);
        } catch (error: any) {
            if (error.name === AppErrorsName.USER_NOT_FOUND) {
                res.status(404).json({ error: AppErrorsMessage.USER_NOT_FOUND });
            } else {
                res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
            }
        }
    }

    async getFilteredVaccinazioni(req: Request, res: Response): Promise<void> {
        try {
            const requester = (req as any).user as AppJwtPayload;
            const isAdmin = requester.roles?.includes("admin") || requester.roles?.includes("operator");

            let targetCf: string;
            if (isAdmin) {
                const cfParam = req.query.cf as string;
                if (!cfParam) {
                    res.status(400).json({ error: AppErrorsMessage.MISSING_DATA });
                    return;
                }
                targetCf = cfParam;
            } else {
                targetCf = requester.cf;
            }

            const { nomeVaccino, dataGt, dataLt, dataMin, dataMax } = req.query;

            const vaccinazioni = await vaccinazioneService.getFilteredVaccinazioni(targetCf, {
                nomeVaccino: nomeVaccino as string,
                dataGt: dataGt as string,
                dataLt: dataLt as string,
                dataMin: dataMin as string,
                dataMax: dataMax as string,
            });

            res.status(200).json(vaccinazioni);
        } catch (error: any) {
            if (error.name === AppErrorsName.USER_NOT_FOUND) {
                res.status(404).json({ error: AppErrorsMessage.USER_NOT_FOUND });
            } else {
                res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
            }
        }
    }

    async getCoperturaReport(req: Request, res: Response): Promise<void> {
        try {
            const requester = (req as any).user as AppJwtPayload;
            const isAdmin = requester.roles?.includes("admin") || requester.roles?.includes("operator");

            // admin: vede tutti (a meno che non passi un cf specifico in query, opzionale)
            // user: vede solo le proprie
            const targetCf = isAdmin ? (req.query.cf as string | undefined) : requester.cf;

            const order = (req.query.order as string) === "desc" ? "desc" : "asc";

            const report = await vaccinazioneService.getCoperturaReport(targetCf, order);
            res.status(200).json(report);
        } catch {
            res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
        }
    }

    async getCoperturaPdf(req: Request, res: Response): Promise<void> {
        try {
            const requester = (req as any).user as AppJwtPayload;
            const isAdmin = requester.roles?.includes("admin") || requester.roles?.includes("operator");

            const targetCf = isAdmin ? (req.query.cf as string | undefined) : requester.cf;
            const order = (req.query.order as string) === "desc" ? "desc" : "asc";

            if (!targetCf) {
                res.status(400).json({ error: AppErrorsMessage.MISSING_DATA });
                return;
            }

            const pdfBuffer = await vaccinazioneService.generateCoperturaPdf(targetCf, order);

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename="copertura_${targetCf}.pdf"`);

            res.send(pdfBuffer);
        } catch {
            res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
        }
    }
}

export const vaccinazioneController = new VaccinazioneController();
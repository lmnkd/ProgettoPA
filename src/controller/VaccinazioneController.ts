import { Request, Response } from "express";
import { vaccinazioneService } from "../service/VaccinazioneService";
import { AppErrorsName } from "../enum/AppErrorsName";
import { AppErrorsMessage } from "../enum/AppErrorsMessage";
import { AppSuccessMessage } from "../enum/AppSuccessMessage";
import { AppJwtPayload } from "../types/jwt-payload";
import { request } from "http";


export class VaccinazioneController {

    async createVaccinazione(req: Request, res: Response): Promise<void> {
           try {
   
               const requester = (req as any).user as AppJwtPayload;
               
               // Verifica che l'utente sia operator
               if (!requester.roles.includes("operator")) {
                   res.status(403).json({ error: AppErrorsMessage.PERMISSION_DENIED });
                   return;
               }
   
               const vaccino = await vaccinazioneService.createVaccino(req.body);
               res.status(201).json({ message: AppSuccessMessage.VACCINO_CREATED, vaccino });
           } catch (error: any) {
               if (error.name === AppErrorsName.VACCINAZIONE_ALREADY_EXISTS) {
                   res.status(409).json({ error: AppErrorsMessage.VACCINAZIONE_ALREADY_EXISTS });
               } else {
                   res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
               }
           }
       }   

async getVaccinazioneById(req: Request, res: Response): Promise<void> {
        try {
            const requester = (req as any).user as AppJwtPayload;
            
            // Verifica che l'utente sia operator
            if (!requester.roles.includes("operator")) {
                res.status(403).json({ error: AppErrorsMessage.PERMISSION_DENIED });
                return;
            }

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
            const requester = (req as any).user as AppJwtPayload;
            
            // Verifica che l'utente sia operator
            if (!requester.roles.includes("operator")) {
                res.status(403).json({ error: AppErrorsMessage.PERMISSION_DENIED });
                return;
            }
            const isOperator = requester.roles.includes("operator");
            const vaccinazioni = await vaccinazioneService.getAllVaccinazioni(requester.cf, isOperator);
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
            const requester = (req as any).user as AppJwtPayload;   
            const isOperator = requester.roles.includes("operator");
            const targetId = Number(req.params.id);
            const vaccinazione = await vaccinazioneService.updateVaccinazione(
                isOperator,
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
            const requester = (req as any).user as AppJwtPayload;
            const isOperator = requester.roles.includes("operator");
            const targetId = Number(req.params.id);
            await vaccinazioneService.deleteVaccinazione(isOperator, targetId);
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
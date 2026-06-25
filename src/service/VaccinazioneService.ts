import {vaccinazioneDao} from "../dao/VaccinazioneDao";
import {AppErrorsName} from "../enum/AppErrorsName";
import { VaccinazioneAttributes } from "../model/Vaccinazione";

interface CreateVaccinazioneInput {
    user_cf: string;
    lotto_id: number;
    vaccino_id: number;
    data_vaccinazione: Date;
}

export class VaccinazioneService {

    async createVaccinazione(data: CreateVaccinazioneInput) {
        return vaccinazioneDao.create({
            userCf: data.user_cf,
            lottoId: data.lotto_id,
            vaccinoId: data.vaccino_id,
            dataVaccinazione: data.data_vaccinazione,
        });
    }
    

    async getVaccinazioneById(targetId: number) {
        const vaccinazione = await vaccinazioneDao.findById(targetId);
        if (!vaccinazione) {
            const err = new Error("Vaccinazione not found");
            err.name = AppErrorsName.VACCINAZIONE_NOT_FOUND;
            throw err;
        }
        return vaccinazione;
    }   

    async getAllVaccinazioni() {
        return vaccinazioneDao.findAll();
    }

     async updateVaccinazione(
        targetId: number,
        updatedData: Partial<VaccinazioneAttributes>
    ) {
        const updatedVaccinazione = await vaccinazioneDao.update({ id: targetId }, updatedData);
        if (!updatedVaccinazione) {
            const err = new Error("Vaccinazione not found");
            err.name = AppErrorsName.VACCINAZIONE_NOT_FOUND;
            throw err;
        }

        return updatedVaccinazione;
    }

    async deleteVaccinazione(targetId: number) {
        const deleted = await vaccinazioneDao.delete(targetId);
        if (!deleted) {
            const err = new Error("Vaccinazione not found");
            err.name = AppErrorsName.VACCINAZIONE_NOT_FOUND;
            throw err;
        }       
        return deleted;
    }   

}

export const vaccinazioneService = new VaccinazioneService();
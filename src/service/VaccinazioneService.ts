import {vaccinazioneDao} from "../dao/VaccinazioneDao";
import {AppErrorsName} from "../enum/AppErrorsName";

interface CreateVaccinazioneInput {
    id?: number;
    user_cf: string;
    vaccino_id: number;
    lotto_id: number;
    data_vaccinazione: Date;
    created_at: Date;
    updated_at:Date
}

export class VaccinazioneService {

    async createVaccino(data: CreateVaccinazioneInput) {
        if (data.id) {
            const existingById = await vaccinazioneDao.findById(data.id);
            if (existingById) {
                const err = new Error("Vaccinazione alreadyy exist.");
                err.name = AppErrorsName.VACCINAZIONE_ALREADY_EXISTS;
                throw err;
            }
        }

        return vaccinazioneDao.create({
            id: data.id,
            userCf: data.user_cf,
            vaccinoId: data.vaccino_id,
            lottoId: data.lotto_id,
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

    async getAllVaccinazioni(requesterCf: string, isOperator: boolean) {
        if (!isOperator) {
            const err = new Error("Permission denied");
            err.name = AppErrorsName.PERMISSION_DENIED;
            throw err;
        }
        return vaccinazioneDao.findAll();
    }

    async updateVaccinazione(
        isOperator: boolean,
        targetId: number,
        updatedData: Partial<CreateVaccinazioneInput>
    ) {
        if (!isOperator) {
            const err = new Error("Permission denied");
            err.name = AppErrorsName.PERMISSION_DENIED;
            throw err;
        }

        if (updatedData.id) {
            const existingById = await vaccinazioneDao.findById(updatedData.id);
            if (existingById) {
                const err = new Error("Vaccinazione already exists");
                err.name = AppErrorsName.VACCINAZIONE_ALREADY_EXISTS;
                throw err;
            }
        }

        const updatedVaccinazione = await vaccinazioneDao.update({ id: targetId }, updatedData);
        if (!updatedVaccinazione) {
            const err = new Error("Vaccinazione not found");
            err.name = AppErrorsName.VACCINAZIONE_NOT_FOUND;
            throw err;
        }

        return updatedVaccinazione;
    }

    async deleteVaccinazione(isOperator: boolean, targetId: number) {
        if (!isOperator) {
            const err = new Error("Permission denied");
            err.name = AppErrorsName.PERMISSION_DENIED;
            throw err;
        }

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
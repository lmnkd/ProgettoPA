import {vaccinoDao} from "../dao/VaccinoDao";
import {AppErrorsName} from "../enum/AppErrorsName";

interface CreateVaccinoInput {
    id: number;
    nome: string;
    disponibilita: number;
    scadenza: Date;   
}

export class VaccinoService {

    async createVaccino(data: CreateVaccinoInput) {
        const existing = await vaccinoDao.findById(data.id);
        if (existing) {
            const err = new Error("Vaccino already exists");
            err.name = AppErrorsName.VACCINO_ALREADY_EXISTS;
            throw err;
        }
        return vaccinoDao.create({
            id: data.id,
            nome: data.nome,
            disponibilita: data.disponibilita,
            scadenza: data.scadenza
        });
    }   

    async getVaccinoById(requesterCf: string, isOperator: boolean, targetId: number) {
        if (!isOperator) {
            const err = new Error("Permission denied");
            err.name = AppErrorsName.PERMISSION_DENIED;
            throw err;
        }
        return vaccinoDao.findById(targetId);
    }   

    async getAllVaccini(requesterCf: string, isOperator: boolean) {
        if (!isOperator) {
            const err = new Error("Permission denied");
            err.name = AppErrorsName.PERMISSION_DENIED;
            throw err;
        }
        return vaccinoDao.findAll();
    }

    async updateVaccino(
        isOperator: boolean,
        targetId: number,
        updatedData: Partial<CreateVaccinoInput>
    ) {
        if (!isOperator) {
            const err = new Error("Permission denied");
            err.name = AppErrorsName.PERMISSION_DENIED;
            throw err;
        }
        const updatedVaccino = await vaccinoDao.update({ id: targetId }, updatedData);
        if (!updatedVaccino) {
            const err = new Error("Vaccino not found");
            err.name = AppErrorsName.VACCINO_NOT_FOUND;
            throw err;
        }
        return updatedVaccino;
    }

    async deleteVaccino(isOperator: boolean, targetId: number) {
        if (!isOperator) {
            const err = new Error("Permission denied");
            err.name = AppErrorsName.PERMISSION_DENIED;
            throw err;
        }
        const deleted = await vaccinoDao.delete(targetId);
        if (!deleted) {
            const err = new Error("Vaccino not found");
            err.name = AppErrorsName.VACCINO_NOT_FOUND;
            throw err;
        }       
        return deleted;
    }   

}

export const vaccinoService = new VaccinoService();
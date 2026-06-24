import {vaccinoDao} from "../dao/VaccinoDao";
import {AppErrorsName} from "../enum/AppErrorsName";

interface CreateVaccinoInput {
    id?: number;
    nome: string;
    durataCopertura: number;
}

export class VaccinoService {

    async createVaccino(data: CreateVaccinoInput) {
        if (data.id) {
            const existingById = await vaccinoDao.findById(data.id);
            if (existingById) {
                const err = new Error("Vaccino already exists");
                err.name = AppErrorsName.VACCINO_ALREADY_EXISTS;
                throw err;
            }
        }

        const existingByNome = await vaccinoDao.findByNome(data.nome);
        if (existingByNome) {
            const err = new Error("Vaccino already exists");
            err.name = AppErrorsName.VACCINO_ALREADY_EXISTS;
            throw err;
        }

        return vaccinoDao.create({
            id: data.id,
            nome: data.nome,
            durataCopertura: data.durataCopertura,
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

        if (updatedData.nome) {
            const existingByNome = await vaccinoDao.findByNome(updatedData.nome);
            if (existingByNome && existingByNome.id !== targetId) {
                const err = new Error("Vaccino already exists");
                err.name = AppErrorsName.VACCINO_ALREADY_EXISTS;
                throw err;
            }
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
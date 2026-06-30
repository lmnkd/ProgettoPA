import { vaccinoDao } from "../dao/VaccinoDao";
import { userDao } from "../dao/UserDao";

interface CreateVaccinoInput {
    nome: string;
    durataCopertura: number;
}

export class VaccinoService {

    async createVaccino(data: CreateVaccinoInput) {
        // unicità del nome già verificata dal middleware checkNomeVaccinoUnique
        return vaccinoDao.create({
            nome: data.nome,
            durataCopertura: data.durataCopertura,
        });
    }

    async getVaccinoById(targetId: number) {
        // esistenza già verificata dal middleware checkVaccinoExistsById
        return vaccinoDao.findById(targetId);
    }

    async searchVaccini(filters: any) {
        return vaccinoDao.searchVaccini(filters);
    }

    async getAllVaccini() {
        return vaccinoDao.findAll();
    }

    async getStatistiche() {
        const vaccini = await vaccinoDao.getStatisticheVaccini();
        return { vaccini };
    }

    async getStatisticheCopertura() {
        return userDao.getCoverageStatistics();
    }

    async updateVaccino(targetId: number, updatedData: Partial<CreateVaccinoInput>) {
        // esistenza e unicità nome già verificate dai middleware
        return vaccinoDao.update({ id: targetId }, updatedData);
    }

    async deleteVaccino(targetId: number) {
        // esistenza già verificata dal middleware checkVaccinoExistsById
        await vaccinoDao.delete(targetId);
    }
}

export const vaccinoService = new VaccinoService();
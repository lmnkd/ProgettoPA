import { IDao } from "./IDao";
import { Vaccinazione, VaccinazioneAttributes, VaccinazioneCreationAttributes } from "../model/Vaccinazione";

export class VaccinazioneDao implements IDao<Vaccinazione> {

    async read(item: Vaccinazione): Promise<Vaccinazione | null> {
        return await Vaccinazione.findByPk(item.id);
    }

    async create(item: VaccinazioneCreationAttributes): Promise<Vaccinazione> {
        return await Vaccinazione.create(item);
    }

    async findAll(): Promise<Vaccinazione[]> {
        return await Vaccinazione.findAll();
    }

    async update(
        item: Partial<VaccinazioneAttributes>,
        updatedVaccinazione: Partial<VaccinazioneAttributes>
    ): Promise<Vaccinazione | null> {
        const vaccinazione = await Vaccinazione.findByPk(item.id);
        if (!vaccinazione) {
            return null;
        }
        await vaccinazione.update(updatedVaccinazione);
        return vaccinazione;
    }

    async delete(id: number): Promise<boolean> {
        const vaccinazione = await Vaccinazione.findByPk(id);
        if (!vaccinazione) {
            return false;
        }
        await vaccinazione.destroy();
        return true;
    }

    async findById(id: number): Promise<Vaccinazione | null> {
            return Vaccinazione.findByPk(id);
        }
    
        // Dao normale ma con metodo per trovare una vaccinazione dato un user e una tipologia di vaccino
    
    async findLastByUserAndVaccino(userCf: string, vaccinoId: number): Promise<Vaccinazione | null> {
        return Vaccinazione.findOne({
            where: { userCf, vaccinoId },
            order: [["dataVaccinazione", "DESC"]],
        });
    }   
    
}

export const vaccinazioneDao = new VaccinazioneDao();


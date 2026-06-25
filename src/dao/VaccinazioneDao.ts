import { IDao } from "./IDao";
import { Vaccinazione, VaccinazioneAttributes, VaccinazioneCreationAttributes } from "../model/Vaccinazione";
import { Op, WhereOptions } from "sequelize";
import { Vaccino } from "../model/Vaccino";
import { LottoVaccino } from "../model/LottoVaccino";

interface VaccinazioneFilters {
    nomeVaccino?: string;
    dataGt?: Date;
    dataLt?: Date;
    dataMin?: Date;
    dataMax?: Date;
}

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


    async findAllByUserCf(userCf: string): Promise<Vaccinazione[]> {
        return Vaccinazione.findAll({
            where: { userCf },
            order: [["dataVaccinazione", "DESC"]],
        });
    }

    async findFilteredByUserCf(userCf: string, filters: VaccinazioneFilters): Promise<Vaccinazione[]> {
    const where: WhereOptions = { userCf };

    // Filtro data: range ha priorità se entrambi min e max sono presenti
    if (filters.dataMin && filters.dataMax) {
        (where as any).dataVaccinazione = { [Op.between]: [filters.dataMin, filters.dataMax] };
    } else if (filters.dataGt) {
        (where as any).dataVaccinazione = { [Op.gt]: filters.dataGt };
    } else if (filters.dataLt) {
        (where as any).dataVaccinazione = { [Op.lt]: filters.dataLt };
    }

    const vaccinoWhere: WhereOptions = {};
    if (filters.nomeVaccino) {
        (vaccinoWhere as any).nome = { [Op.iLike]: `%${filters.nomeVaccino}%` };
    }

    return Vaccinazione.findAll({
        where,
        include: [
            { model: Vaccino, attributes: ["nome", "durataCopertura"], where: vaccinoWhere },
            { model: LottoVaccino, attributes: ["codiceLotto"] },
        ],
        order: [["dataVaccinazione", "DESC"]],
    });
    
}
}

export const vaccinazioneDao = new VaccinazioneDao();


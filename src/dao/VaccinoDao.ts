import {IDao} from "./IDao";
import {Vaccino, VaccinoAttributes, VaccinoCreationAttributes} from "../model/Vaccino";

export class VaccinoDao implements IDao<Vaccino> {


    async read(item: Vaccino): Promise<Vaccino | null> {
        return Vaccino.findByPk(item.id);
    }


    async create(vaccino: VaccinoCreationAttributes): Promise<Vaccino> {
        return Vaccino.create(vaccino);
    }

    async findById(id: number): Promise<Vaccino | null> {
        return Vaccino.findByPk(id);
    }

    async findAll(): Promise<Vaccino[]> {
        return Vaccino.findAll();
    }

    async update(item: Partial<VaccinoAttributes>, updatedVaccino: Partial<VaccinoAttributes>): Promise<Vaccino | null> {
        const vaccino = await Vaccino.findByPk(item.id);
        if (!vaccino) {
            return null;
        }
        await vaccino.update(updatedVaccino);
        return vaccino;
    }

    async delete(id: number): Promise<boolean> {
        const vaccino = await Vaccino.findByPk(id);
        if (!vaccino) {
            return false;
        }
        await vaccino.destroy();
        return true;
    }

}

export const vaccinoDao = new VaccinoDao();
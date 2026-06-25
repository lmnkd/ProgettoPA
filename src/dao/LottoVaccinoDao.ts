import { IDao } from "./IDao";
import { Op } from "sequelize";
import { LottoVaccino } from "../model/LottoVaccino";

export class LottoVaccinoDao implements IDao<LottoVaccino> {

    // Dao di lotto vaccino con i metodi di default

    async create(item: any): Promise<LottoVaccino> {
        return await LottoVaccino.create(item);
    }

    async read(item: any): Promise<LottoVaccino | null> {
        return await LottoVaccino.findByPk(item.id);
    }

    async update(item: any, updatedItem: any): Promise<LottoVaccino | null> {
        const lotto = await LottoVaccino.findByPk(item.id);
        if (!lotto) return null;

        await lotto.update(updatedItem);
        return lotto;
    }

    async delete(id: number): Promise<boolean> {
        const lotto = await LottoVaccino.findByPk(id);
        if (!lotto) return false;

        await lotto.destroy();
        return true;
    }

    async findAll(): Promise<LottoVaccino[]> {
        return await LottoVaccino.findAll();
    }

    async findById(id: number) {
        return await LottoVaccino.findByPk(id);
    }

    async findByVaccinoId(
        vaccinoId: number,
        min?: number,
        max?: number
    ): Promise<LottoVaccino[]> {

        const where: any = { vaccinoId };

        if (min !== undefined && max !== undefined) {
            where.quantitaDisponibile = {
                [Op.between]: [min, max]
            };
        }
        else if (min !== undefined) {
            where.quantitaDisponibile = {
                [Op.gte]: min
            };
        }
        else if (max !== undefined) {
            where.quantitaDisponibile = {
                [Op.lte]: max
            };
        }

        return LottoVaccino.findAll({ where });
    }

    async findByCodiceLotto(codiceLotto: string): Promise<LottoVaccino | null> {
        return await LottoVaccino.findOne({ where: { codiceLotto } });
    }
}

export const lottoVaccinoDao = new LottoVaccinoDao();
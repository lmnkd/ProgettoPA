import { lottoVaccinoDao } from "../dao/LottoVaccinoDao";
import { vaccinoDao } from "../dao/VaccinoDao";

export class LottoVaccinoService {

    async createLotto(vaccinoId: number, data: any) {

        // 1. controllo vaccino esiste
        const vaccino = await vaccinoDao.findById(vaccinoId);
        if (!vaccino) {
            throw new Error("VACCINO_NOT_FOUND");
        }

        // 2. controllo codice lotto unico
        const existing = await lottoVaccinoDao.findByCodiceLotto(data.codiceLotto);
        if (existing) {
            throw new Error("LOTTO_ALREADY_EXISTS");
        }

        // 3. creazione lotto
        return await lottoVaccinoDao.create({
            vaccinoId,
            codiceLotto: data.codiceLotto,
            quantitaDisponibile: data.quantitaDisponibile,
            dataConsegna: data.dataConsegna,
            dataScadenza: data.dataScadenza
        });
    }

    async getLottiByVaccino(
        vaccinoId: number,
        min?: number,
        max?: number
    ) {
        return lottoVaccinoDao.findByVaccinoId(
            vaccinoId,
            min,
            max
        );
    }

    async getLottoById(id: number) {
        const lotto = await lottoVaccinoDao.findById(id);
        if (!lotto) throw new Error("LOTTO_NOT_FOUND");
        return lotto;
    }
}

export const lottoVaccinoService = new LottoVaccinoService();
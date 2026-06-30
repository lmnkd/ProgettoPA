import { lottoVaccinoDao } from "../dao/LottoVaccinoDao";

export class LottoVaccinoService {

    async createLotto(vaccinoId: number, data: any) {
        // vaccino esistente e unicità codiceLotto già verificati dai middleware
        // checkVaccinoExists e checkCodiceLottoUnique sulla rotta
        return lottoVaccinoDao.create({
            vaccinoId,
            codiceLotto: data.codiceLotto,
            quantitaDisponibile: data.quantitaDisponibile,
            dataConsegna: data.dataConsegna,
            dataScadenza: data.dataScadenza
        });
    }

    async getLottiByVaccino(vaccinoId: number, min?: number, max?: number) {
        return lottoVaccinoDao.findByVaccinoId(vaccinoId, min, max);
    }

    async getLottoById(id: number) {
        // se serve in futuro, l'esistenza andrebbe verificata da un middleware analogo
        return lottoVaccinoDao.findById(id);
    }
}

export const lottoVaccinoService = new LottoVaccinoService();
import { IDao } from "./IDao";
import { Op, fn, col } from "sequelize";
import {
    Vaccino,
    VaccinoAttributes,
    VaccinoCreationAttributes
} from "../model/Vaccino";
import { LottoVaccino } from "../model/LottoVaccino";

export class VaccinoDao implements IDao<Vaccino> {

    async read(item: Vaccino): Promise<Vaccino | null> {
        return Vaccino.findByPk(item.id);
    }

    async create(
        vaccino: VaccinoCreationAttributes
    ): Promise<Vaccino> {
        return Vaccino.create(vaccino);
    }

    async findByNome(
        nome: string
    ): Promise<Vaccino | null> {
        return Vaccino.findOne({
            where: { nome }
        });
    }

    async findById(
        id: number
    ): Promise<Vaccino | null> {
        return Vaccino.findByPk(id);
    }

    async findAll(): Promise<Vaccino[]> {
        return Vaccino.findAll();
    }

    async searchVaccini(filters: any) {

        const whereVaccino: any = {};
        const whereLotto: any = {};

        // ======================
        // FILTRO NOME
        // ======================

        if (filters.nome) {

            const nomi = String(filters.nome)
                .split(",")
                .map((n: string) => n.trim());

            whereVaccino.nome = {
                [Op.in]: nomi
            };
        }

        // ======================
        // FILTRO SCADENZA
        // ======================

        if (
            filters.scadenzaMaggioreDi &&
            filters.scadenzaMinoreDi
        ) {

            whereLotto.dataScadenza = {
                [Op.between]: [
                    new Date(filters.scadenzaMaggioreDi),
                    new Date(filters.scadenzaMinoreDi)
                ]
            };

        } else if (filters.scadenzaMaggioreDi) {

            whereLotto.dataScadenza = {
                [Op.gte]: new Date(filters.scadenzaMaggioreDi)
            };

        } else if (filters.scadenzaMinoreDi) {

            whereLotto.dataScadenza = {
                [Op.lte]: new Date(filters.scadenzaMinoreDi)
            };
        }

        const vaccini = await Vaccino.findAll({

            where: whereVaccino,

            include: [
                {
                    model: LottoVaccino,
                    as: "lotti",
                    attributes: [],
                    where: whereLotto,
                    required: true
                }
            ],

            attributes: {
                include: [
                    [
                        fn(
                            "COALESCE",
                            fn(
                                "SUM",
                                col("lotti.quantita_disponibile")
                            ),
                            0
                        ),
                        "disponibilitaTotale"
                    ]
                ]
            },

            group: ["Vaccino.id"]
        });

        // ======================
        // FILTRO DISPONIBILITÀ
        // ======================

        const disponibilitaMin =
            filters.disponibilitaMin !== undefined
                ? Number(filters.disponibilitaMin)
                : undefined;

        const disponibilitaMax =
            filters.disponibilitaMax !== undefined
                ? Number(filters.disponibilitaMax)
                : undefined;

        let result = vaccini;

        // maggiore di k

        if (
            disponibilitaMin !== undefined &&
            disponibilitaMax === undefined
        ) {
            result = result.filter(
                (v: any) =>
                    Number(
                        v.get("disponibilitaTotale")
                    ) >= disponibilitaMin
            );
        }

        // minore di k

        if (
            disponibilitaMax !== undefined &&
            disponibilitaMin === undefined
        ) {
            result = result.filter(
                (v: any) =>
                    Number(
                        v.get("disponibilitaTotale")
                    ) <= disponibilitaMax
            );
        }

        // compreso tra k1 e k2

        if (
            disponibilitaMin !== undefined &&
            disponibilitaMax !== undefined
        ) {
            result = result.filter(
                (v: any) => {

                    const q = Number(
                        v.get("disponibilitaTotale")
                    );

                    return (
                        q >= disponibilitaMin &&
                        q <= disponibilitaMax
                    );
                }
            );
        }

        return result;
    }

    async update(
        item: Partial<VaccinoAttributes>,
        updatedVaccino: Partial<VaccinoAttributes>
    ): Promise<Vaccino | null> {

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
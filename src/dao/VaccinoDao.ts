import { IDao } from "./IDao";
import { Op, fn, col, literal } from "sequelize";
import { sequelize } from "../connector/connector";
import { QueryTypes } from "sequelize";
import {
    Vaccino,
    VaccinoAttributes,
    VaccinoCreationAttributes
} from "../model/Vaccino";
import { LottoVaccino } from "../model/LottoVaccino";
import { Vaccinazione } from "../model/Vaccinazione";


/*
    * Classe DAO per la gestione delle operazioni CRUD sui vaccini.
    * Implementa l'interfaccia IDao per i vaccini.
    * Fornisce metodi per creare, leggere, aggiornare e cancellare vaccini, nonché per trovare vaccini filtrati e statistiche sui vaccini.
    */


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


/*
    * Cerca i vaccini in base ai filtri forniti.
    * @param filters - Un oggetto contenente i filtri opzionali per il nome del vaccino, la disponibilità e le date di scadenza dei lotti.
    * @returns Un array di vaccini che soddisfano i criteri di ricerca, con la disponibilità totale calcolata per ciascun vaccino.
*/

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


/*
    * Ottiene le statistiche sui vaccini, inclusi i dati sulle vaccinazioni e la disponibilità dei lotti.
    * @returns Un array di oggetti contenenti le statistiche per ciascun vaccino, inclusi il nome del vaccino, la media delle dosi consegnate e le statistiche mensili delle vaccinazioni.
    */

    async getStatisticheVaccini() {

        const vaccini = await Vaccino.findAll({

            include: [

                {
                    model: Vaccinazione,
                    attributes: [
                        "dataVaccinazione"
                    ]
                },

                {
                    model: LottoVaccino,
                    as: "lotti",
                    attributes: [
                        "quantitaDisponibile"
                    ]
                }
            ]
        });

        return vaccini.map((vaccino: any) => {

            const mesi: Record<number, number[]> = {};

            // ==========================
            // DOSI SOMMINISTRATE PER ANNO
            // ==========================

            for (const vaccinazione of vaccino.Vaccinaziones ?? []) {

                const data = new Date(
                    vaccinazione.dataVaccinazione
                );

                const mese = data.getMonth() + 1;

                const anno = data.getFullYear();

                if (!mesi[mese]) {
                    mesi[mese] = [];
                }

                let posizioneAnno =
                    mesi[mese].findIndex(
                        (_: any, index: number) => false
                    );

                // uso una mappa temporanea
            }

            // conta vaccinazioni per mese/anno

            const conteggi: Record<number, Record<number, number>> = {};

            for (const vaccinazione of vaccino.Vaccinaziones ?? []) {

                const data = new Date(vaccinazione.dataVaccinazione);

                const mese = data.getMonth() + 1;
                const anno = data.getFullYear();

                if (!conteggi[mese]) {
                    conteggi[mese] = {};
                }

                conteggi[mese][anno] =
                    (conteggi[mese][anno] ?? 0) + 1;
            }

            const statisticheMensili = Object.entries(conteggi).map(

                ([mese, anni]) => {

                    const valori = Object.values(anni);

                    const min = Math.min(...valori);

                    const max = Math.max(...valori);

                    const media =
                        valori.reduce((a, b) => a + b, 0) /
                        valori.length;

                    const deviazione =
                        Math.sqrt(

                            valori.reduce(

                                (somma, valore) =>
                                    somma +
                                    Math.pow(
                                        valore - media,
                                        2
                                    ),

                                0
                            ) / valori.length
                        );

                    return {

                        mese: Number(mese),

                        min,

                        max,

                        media: Number(
                            media.toFixed(2)
                        ),

                        deviazioneStandard: Number(
                            deviazione.toFixed(2)
                        )
                    };
                }
            );

            // ==========================
            // MEDIA DOSI CONSEGNATE
            // ==========================

            const lotti = vaccino.lotti ?? [];

            const mediaConsegnate =

                lotti.length === 0

                    ? 0

                    : Number(

                        (

                            lotti.reduce(

                                (somma: number, lotto: any) =>
                                    somma +
                                    lotto.quantitaDisponibile,

                                0
                            ) /

                            lotti.length

                        ).toFixed(2)
                    );

            return {

                id: vaccino.id,

                nome: vaccino.nome,

                mediaDosiConsegnate: mediaConsegnate,

                statisticheMensili
            };
        });
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
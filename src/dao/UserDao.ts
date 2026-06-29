import {IDao} from "./IDao";
import { Vaccinazione } from "../model/Vaccinazione";
import { Vaccino } from "../model/Vaccino";
import { fn, col, where } from "sequelize";
import {User, UserAttributes, UserCreationAttributes} from "../model/User";
import { Op, literal } from "sequelize";


export class UserDao implements IDao<User> {

    // Anche qua metodi classici ma in più ci sono i metodi che riguardano i token

    async create(item: UserCreationAttributes): Promise<User> {
        return await User.create(item);
    }

    async findById(cf: string): Promise<User | null> {
        return await User.findByPk(cf);
    }

    async findAll(): Promise<User[]> {
        return await User.findAll();
    }

    async update(item: Partial<UserAttributes>, updatedItem: Partial<UserAttributes>): Promise<User | null> {
        const user = await User.findByPk(item.cf);
        if (user) {
            await user.update(updatedItem);
            return user;
        }   else {          
            return null;
        }
    }

    async delete(cf: string): Promise<boolean> {
        const user = await User.findByPk(cf);
        if (user) {
            await user.destroy();
            return true;
        } else {
            return false;
        }   
    }

    async read(item: UserAttributes): Promise<User | null> {
        return await User.findByPk(item.cf);
    }

    async findByEmail(email: string): Promise<User | null> {
        return await User.findOne({ where: { email } });
    }

    async findUsersWithExpiredCoverage(filters: {
        vaccino?: string;
        giorniMin?: number;
        giorniMax?: number;
    }) {

        const utenti = await User.findAll({

            include: [
                {
                    model: Vaccinazione,
                    as: "vaccinazioni",
                    required: true,

                    include: [
                        {
                            model: Vaccino,
                            required: true,

                            ...(filters.vaccino
                                ? {
                                    where: {
                                        nome: filters.vaccino
                                    }
                                }
                                : {})
                        }
                    ]
                }
            ]
        });

        const oggi = new Date();

        return utenti.filter((u: any) => {

            const vaccinazioni = u.vaccinazioni  ?? [];

            return vaccinazioni.some((v: any) => {

                const dataVaccino =
                    new Date(v.dataVaccinazione);

                const durata =
                    v.Vaccino.durataCopertura;

                const scadenza =
                    new Date(dataVaccino);

                scadenza.setDate(
                    scadenza.getDate() + durata
                );

                const giorniScaduti = Math.floor(
                    (oggi.getTime() - scadenza.getTime()) /
                    (1000 * 60 * 60 * 24)
                );

                if (giorniScaduti <= 0) {
                    return false;
                }

                if (
                    filters.giorniMin !== undefined &&
                    filters.giorniMax === undefined
                ) {
                    return giorniScaduti >= filters.giorniMin;
                }

                if (
                    filters.giorniMax !== undefined &&
                    filters.giorniMin === undefined
                ) {
                    return giorniScaduti <= filters.giorniMax;
                }

                if (
                    filters.giorniMin !== undefined &&
                    filters.giorniMax !== undefined
                ) {
                    return (
                        giorniScaduti >= filters.giorniMin &&
                        giorniScaduti <= filters.giorniMax
                    );
                }

                return true;
            });
        });
    }

    async getCoverageStatistics() {

        const utenti = await User.findAll({

            include: [
                {
                    model: Vaccinazione,
                    as: "vaccinazioni",
                    required: true,

                    include: [
                        {
                            model: Vaccino,
                            required: true
                        }
                    ]
                }
            ]
        });

        const oggi = new Date();

        let entro30 = 0;
        let tra31e90 = 0;
        let oltre90 = 0;

        for (const u of utenti as any[]) {

            const vaccinazioni = u.vaccinazioni ?? [];

            let massimoScaduto = 0;

            for (const v of vaccinazioni) {

                const dataVaccino = new Date(v.dataVaccinazione);

                const scadenza = new Date(dataVaccino);

                scadenza.setDate(
                    scadenza.getDate() +
                    v.Vaccino.durataCopertura
                );

                const giorniScaduti = Math.floor(
                    (oggi.getTime() - scadenza.getTime()) /
                    (1000 * 60 * 60 * 24)
                );

                if (giorniScaduti > massimoScaduto) {
                    massimoScaduto = giorniScaduti;
                }
            }

            if (massimoScaduto <= 0) {
                continue;
            }

            if (massimoScaduto <= 30) {
                entro30++;
            }
            else if (massimoScaduto <= 90) {
                tra31e90++;
            }
            else {
                oltre90++;
            }
        }

        return {

            utentiScopertiEntro30Giorni: entro30,

            utentiScopertiTra31E90Giorni: tra31e90,

            utentiScopertiOltre90Giorni: oltre90
        };
    }

    async decrementTokenIfAvailable(cf: string): Promise<boolean> {
        const [affectedRows] = await User.update(
            { token: literal('"token" - 1') as any },
            { where: { cf, token: { [Op.gt]: 0 } } }
        );
        return affectedRows > 0;
    }

    async increaseTokens(cf: string, amount: number): Promise<User | null> {
        const user = await User.findByPk(cf);
        if (!user) return null;
        await user.increment("token", { by: amount });
        return user.reload();
    }



}


// Singleton
export const userDao = new UserDao();
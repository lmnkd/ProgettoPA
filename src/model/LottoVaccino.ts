import * as Sequelize from 'sequelize';
import { DataTypes, Optional, Model } from 'sequelize';

export interface LottoVaccinoAttributes {
    id: number;

    vaccinoId: number;

    codiceLotto: string;

    quantitaDisponibile: number;

    dataConsegna: Date;

    dataScadenza: Date;
}

export interface LottoVaccinoCreationAttributes
    extends Optional<LottoVaccinoAttributes, 'id'> {}

export class LottoVaccino
    extends Model<
        LottoVaccinoAttributes,
        LottoVaccinoCreationAttributes
    >
    implements LottoVaccinoAttributes {

    public id!: number;

    public vaccinoId!: number;

    public codiceLotto!: string;

    public quantitaDisponibile!: number;

    public dataConsegna!: Date;

    public dataScadenza!: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export function initLottoVaccinoModel(
    sequelize: Sequelize.Sequelize
): typeof LottoVaccino {

    LottoVaccino.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            vaccinoId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            codiceLotto: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },

            quantitaDisponibile: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            dataConsegna: {
                type: DataTypes.DATE,
                allowNull: false,
            },

            dataScadenza: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'lotti_vaccino',
            timestamps: true,
        }
    );

    return LottoVaccino;
}
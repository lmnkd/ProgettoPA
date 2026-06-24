import * as Sequelize from 'sequelize';
import { DataTypes, Optional, Model } from 'sequelize';

export interface VaccinazioneAttributes {
    id: number;

    userCf: string;

    vaccinoId: number;

    lottoId: number;

    dataVaccinazione: Date;
}

export interface VaccinazioneCreationAttributes
    extends Optional<VaccinazioneAttributes, 'id'> {}

export class Vaccinazione
    extends Model<
        VaccinazioneAttributes,
        VaccinazioneCreationAttributes
    >
    implements VaccinazioneAttributes {

    public id!: number;

    public userCf!: string;

    public vaccinoId!: number;

    public lottoId!: number;

    public dataVaccinazione!: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export function initVaccinazioneModel(
    sequelize: Sequelize.Sequelize
): typeof Vaccinazione {

    Vaccinazione.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            userCf: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            vaccinoId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            lottoId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            dataVaccinazione: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'vaccinazioni',
            timestamps: true,
        }
    );

    return Vaccinazione;
}
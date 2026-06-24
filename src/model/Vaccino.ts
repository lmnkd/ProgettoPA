import * as Sequelize from 'sequelize';
import { DataTypes, Optional, Model } from 'sequelize';

export interface VaccinoAttributes {
    id: number;
    nome: string;
    durataCopertura: number;
}

export interface VaccinoCreationAttributes
    extends Optional<VaccinoAttributes, 'id'> {}

export class Vaccino
    extends Model<VaccinoAttributes, VaccinoCreationAttributes>
    implements VaccinoAttributes {

    public id!: number;
    public nome!: string;
    public durataCopertura!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export function initVaccinoModel(
    sequelize: Sequelize.Sequelize
): typeof Vaccino {

    Vaccino.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            nome: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },

            durataCopertura: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'vaccini',
            timestamps: true,
        }
    );

    return Vaccino;
}
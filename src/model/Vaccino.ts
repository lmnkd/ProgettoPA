import * as Sequelize from 'sequelize';
import { DataTypes, Optional, Model } from 'sequelize';

export interface VaccinoAttributes {
    id: number;
    nome: string;
    disponibilita: number;
    scadenza: Date;
}

export interface VaccinoCreationAttributes extends Optional<VaccinoAttributes, 'id'> { }

export class Vaccino extends Model<VaccinoAttributes, VaccinoCreationAttributes> implements VaccinoAttributes {
    public id!: number;
    public nome!: string;
    public disponibilita!: number;
    public scadenza!: Date;
}

export function initVaccinoModel(sequelize: Sequelize.Sequelize): typeof Vaccino {
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
            },  
            disponibilita: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            scadenza: {
                type: DataTypes.DATE,
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



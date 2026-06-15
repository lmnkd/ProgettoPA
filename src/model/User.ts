import * as Sequelize from 'sequelize';
import { DataTypes, Optional, Model } from 'sequelize';


export interface UserAttributes {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
}


/**
 * Interfaccia dato che id è incrementato naturalmente e così non mi dà errore
 */
export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public name!: string;
    public email!: string;
    public role!: 'admin' | 'user';

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}       

export function initUserModel(sequelize: Sequelize.Sequelize): typeof User {
    User.init(
        {   
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,   
                unique: true,
            },
            role: {
                type: DataTypes.ENUM('admin', 'user'),  
                allowNull: false,
            },  
        },
        {
            sequelize,      
            tableName: 'users',
            timestamps: true,
        }
    );
    return User;
}
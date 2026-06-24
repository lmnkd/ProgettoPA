import * as Sequelize from 'sequelize';
import { DataTypes, Optional, Model } from 'sequelize';

export interface UserAttributes {
    cf: string;
    name: string;
    email: string;
    passwordHash: string;
    role: 'user' | 'operator' | 'both';
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'cf'> { }

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public cf!: string;
    public name!: string;
    public email!: string;
    public passwordHash!: string;
    public role!: 'user' | 'operator' | 'both';

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export function initUserModel(sequelize: Sequelize.Sequelize): typeof User {
    User.init(
        {
            cf: {
                type: DataTypes.STRING,
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
            passwordHash: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role: {
                type: DataTypes.ENUM('user', 'operator', 'both'),
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
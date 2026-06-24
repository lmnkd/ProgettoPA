import { initUserModel,UserAttributes, UserCreationAttributes, User } from './User';
import { initVaccinoModel } from './Vaccino';
import Sequelize from 'sequelize';
 



export function initModels(sequelize: Sequelize.Sequelize) {

    const User = initUserModel(sequelize);
    const Vaccino = initVaccinoModel(sequelize);

    return {
        User,
        Vaccino,
    };
}
    
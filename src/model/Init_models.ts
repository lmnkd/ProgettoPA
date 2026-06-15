import { initUserModel,UserAttributes, UserCreationAttributes, User } from './User';
import Sequelize from 'sequelize';
 



export function initModels(sequelize: Sequelize.Sequelize) {

    const User = initUserModel(sequelize);

    return {
        User,
    };
}
    
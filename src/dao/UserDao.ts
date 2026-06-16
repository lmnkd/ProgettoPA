import {IDao} from "./IDao";
import {User, UserAttributes, UserCreationAttributes} from "../model/User";


export class UserDao implements IDao<User> {

    async create(item: UserCreationAttributes): Promise<User> {
        return await User.create(item);
    }

    async findById(id: number): Promise<User | null> {
        return await User.findByPk(id);
    }

    async findAll(): Promise<User[]> {
        return await User.findAll();
    }

    async update(item: Partial<UserAttributes>, updatedItem: Partial<UserAttributes>): Promise<User | null> {
        const user = await User.findByPk(item.id);
        if (user) {
            await user.update(updatedItem);
            return user;
        }   else {          
            return null;
        }
    }

    async delete(id: number): Promise<boolean> {
        const user = await User.findByPk(id);
        if (user) {
            await user.destroy();
            return true;
        } else {
            return false;
        }   
    }

    async read(item: UserAttributes): Promise<User | null> {
        return await User.findByPk(item.id);
    }

    async findByEmail(email: string): Promise<User | null> {
        return await User.findOne({ where: { email } });
    }
}


// Singleton
export const userDao = new UserDao();
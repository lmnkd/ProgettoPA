import {IDao} from "./IDao";
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
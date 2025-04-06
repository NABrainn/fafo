// deno-lint-ignore-file require-await
import { User } from "../models/User.ts";
import { BlogPost } from '../models/BlogPost.ts';
import { Comment } from '../models/Comment.ts';

export class UserRepository {

    async findById(id: number): Promise<User | null> {
        return User.findByPk(id, {
            include: [BlogPost, Comment],
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return User.findOne({ where: { email } });
    }

    async createUser(data: Partial<User>): Promise<User> {
        return User.create(data);
    }

    async updateUser(id: number, data: Partial<User>): Promise<[number, User[]]> {
        return User.update(data, {
            where: { id },
            returning: true,
        });
    }

    async deleteUser(id: number): Promise<number> {
        return User.destroy({ where: { id } });
    }

    async getAllUsers(): Promise<User[]> {
        return User.findAll({ include: [BlogPost, Comment] });
    }

    async verifyUser(id: number): Promise<[number, User[]]> {
        return this.updateUser(id, { verified: true });
    }
}
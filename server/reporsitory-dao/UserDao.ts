// deno-lint-ignore-file require-await

import { sequelize } from "../config/db-config.ts";
import { BlogPost } from "../models/BlogPost.ts";
import { Comment } from "../models/Comment.ts";
import { User } from "../models/User.ts";
import { CrudRepository } from "./CrudRepository.ts";

// export class UserRepository {

//     async findById(id: number): Promise<User | null> {
//         return User.findByPk(id, {
//             include: [BlogPost, Comment],
//         });
//     }

//     async findByEmail(email: string): Promise<User | null> {
//         return User.findOne({ where: { email } });
//     }

//     async createUser(data: Partial<User>): Promise<User> {
//         return User.create(data);
//     }

//     async updateUser(id: number, data: Partial<User>): Promise<[number, User[]]> {
//         return User.update(data, {
//             where: { id },
//             returning: true,
//         });
//     }

//     async deleteUser(id: number): Promise<number> {
//         return User.destroy({ where: { id } });
//     }

//     async getAllUsers(): Promise<User[]> {
//         return User.findAll({ include: [BlogPost, Comment] });
//     }

//     async verifyUser(id: number): Promise<[number, User[]]> {
//         return this.updateUser(id, { verified: true });
//     }
// }

interface UserRepository extends CrudRepository<User> {
    findByEmail(email: string): Promise<User | null>;
    verifyUser(id: number): Promise<[number, User[]]>
}

export const userRepository: UserRepository = {

    repository: sequelize.getRepository(User),

    findById: function (id: number): Promise<User | null> {
    return this.repository.findByPk(id, {
        include: [BlogPost, Comment],
    });
    },
    findAll: function (id?: number): Promise<User[]> {
    return this.repository.findAll({ include: [BlogPost, Comment] });
    },

    create: function (data: Partial<User>): Promise<User> {
    return this.repository.create(data);
    },

    update: function (id: number, data: Partial<User>): Promise<[affectedCount: number, affectedRows: User[]]> {
    return this.repository.update(data, {
            where: { id },
            returning: true,
        });
    },
    deleteOne: function (id: number): Promise<number> {
    return User.destroy({ where: { id } });
    },

    findByEmail: function(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
    },

    verifyUser(id: number): Promise<[number, User[]]> {
        return this.update(id, { verified: true });
    }  
}
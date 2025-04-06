import { BlogPost } from '../models/BlogPost.ts';
import { User } from '../models/User.ts';
import { Comment } from '../models/Comment.ts';
import { sequelize } from "../database/initializer.ts";
import { CrudRepository } from "./CrudRepository.ts";

// export class BlogPostRepository {
//     // Get a post by ID, including author and comments
//     async findById(id: number): Promise<BlogPost | null> {
//         return BlogPost.findByPk(id, {
//             include: [User, Comment],
//         });
//     }

//     // Get all posts, optionally filtered by author
//     async findAll(authorId?: number): Promise<BlogPost[]> {
//         const where = authorId ? { author_id: authorId } : undefined;
//         return BlogPost.findAll({
//             where,
//             include: [User],
//             order: [['date', 'DESC']],
//         });
//     }

//     // Create a new blog post
//     async create(postData: Partial<BlogPost>): Promise<BlogPost> {
//         return BlogPost.create(postData);
//     }

//     // Update a blog post
//     async update(id: number, updates: Partial<BlogPost>): Promise<[number, BlogPost[]]> {
//         return BlogPost.update(updates, {
//             where: { id },
//             returning: true,
//         });
//     }

//     // Delete a blog post
//     async delete(id: number): Promise<number> {
//         return BlogPost.destroy({
//             where: { id },
//         });
//     }
// }

// 

export const blogPostRepository: CrudRepository<BlogPost> = {
    repository: sequelize.getRepository(BlogPost),

    findById: function(id: number) {
        return this.repository.findByPk(id, {
            include: [User, Comment],
        });
    },

    findAll: function(authorId?: number) {
        const where = authorId ? { author_id: authorId } : undefined;
        return this.repository.findAll({
            where,
            include: [User],
            order: [['date', 'DESC']],
        });
    },

    create: function(data: Partial<BlogPost>) {
        return this.repository.create(data);
    },

    update: function(id: number, data: Partial<BlogPost>) {
        return this.repository.update(data, {
            where: { id },
            returning: true,
        });
    },

    deleteOne: function(id: number) {
        return this.repository.destroy({
            where: { id },
        });
    },
};
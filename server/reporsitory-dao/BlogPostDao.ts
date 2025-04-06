import { BlogPost } from '../models/BlogPost.ts';
import { User } from '../models/User.ts';
import { Comment } from '../models/Comment.ts';
import { sequelize } from "../config/db-config.ts";
import { CrudRepository } from "./CrudRepository.ts";

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

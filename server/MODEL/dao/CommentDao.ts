import { Comment } from '../models/Comment.ts';
import { User } from '../models/User.ts';
import { BlogPost } from '../models/BlogPost.ts';

export class CommentRepository {
    async findById(id: number): Promise<Comment | null> {
        return Comment.findByPk(id, {
            include: [User, BlogPost, { model: Comment, as: 'parentComment' }],
        });
    }

    async findByPostId(postId: number): Promise<Comment[]> {
        return Comment.findAll({
            where: { post_id: postId },
            include: [User, { model: Comment, as: 'parentComment' }],
            order: [['createdAt', 'ASC']],
        });
    }

    async createComment(data: {
        text: string;
        author_id: number;
        post_id: number;
        parent_comment_id?: number;
    }): Promise<Comment> {
        return Comment.create(data);
    }

    async deleteById(id: number): Promise<number> {
        return Comment.destroy({ where: { id } });
    }

    async updateComment(id: number, newText: string): Promise<[number, Comment[]]> {
        return Comment.update(
            { text: newText },
            {
                where: { id },
                returning: true,
            }
        );
    }
}

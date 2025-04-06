import { Comment } from '../models/Comment.ts';
import { User } from '../models/User.ts';
import { BlogPost } from '../models/BlogPost.ts';
import { CrudRepository } from "./CrudRepository.ts";
import { sequelize } from "../database/initializer.ts";

// export class CommentRepository {
//     async findById(id: number): Promise<Comment | null> {
//         return Comment.findByPk(id, {
//             include: [User, BlogPost, { model: Comment, as: 'parentComment' }],
//         });
//     }

//     async findByPostId(postId: number): Promise<Comment[]> {
//         return Comment.findAll({
//             where: { post_id: postId },
//             include: [User, { model: Comment, as: 'parentComment' }],
//             order: [['createdAt', 'ASC']],
//         });
//     }

//     async createComment(
    //----------------------------------------------------------------------------------------------------------------------------
    //to najlepiej wydobyć do osobnego typu, który potem można przypisać do obiektu zamiast definiować wewnątrz parametrów, np:
    //deklaracja typu: (według konwencji typy powinny być kolokowane w pliku w którym są używane np. na samej górze nad definicją klasy)
    //type CommentData = {
    //     text: string,
    //     author_id: number,
    //     post_id: number,
    //     parent_comment_id?: number,
    // }
    //przypisanie zadeklarowanego typu:
    //data: CommentData
    //----------------------------------------------------------------------------------------------------------------------------
//         data: {
//             text: string;
//             author_id: number;
//             post_id: number;
//             parent_comment_id?: number;
//         }
//     ): Promise<Comment> {
//         return Comment.create(data);
//     }

//     async deleteById(id: number): Promise<number> {
//         return Comment.destroy({ where: { id } });
//     }

//     async updateComment(id: number, newText: string): Promise<[number, Comment[]]> {
//         return Comment.update(
//             { text: newText },
//             {
//                 where: { id },
//                 returning: true,
//             }
//         );
//     }
// }

export const commentRepository: CrudRepository<Comment> = {
  repository: sequelize.getRepository(Comment),
  findById: function (id: number): Promise<Comment | null> {
    return this.repository.findByPk(id, {
        include: [User, BlogPost, { model: Comment, as: 'parentComment' }],
    });  },
  findAll: function (postId?: number): Promise<Comment[]> {
    return this.repository.findAll({
        where: { post_id: postId },
        include: [User, { model: Comment, as: 'parentComment' }],
        order: [['createdAt', 'ASC']],
    });
  },
  create: function (data: Partial<Comment>): Promise<Comment> {
    return this.repository.create(data);
  },
  update: function (id: number, data: Partial<Comment>): Promise<[affectedCount: number, affectedRows: Comment[]]> {
    return this.repository.update(
        data,
        {
            where: { id },
            returning: true,
        }
    );
  },
  deleteOne: function (id: number): Promise<number> {
    return this.repository.destroy({
        where: { id }
    })
  }
}


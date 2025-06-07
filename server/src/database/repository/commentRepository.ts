import { Connection } from "../database.ts";
import { Comment, comments } from "../schema/comments.ts";
import { desc, asc, eq } from "drizzle-orm/expressions";

export class CommentRepository {

    pool!: Connection

    constructor(pool: Connection) {
        this.pool = pool
    }

    async findById(id: number) {
        return await this.pool.query.comments.findFirst({
            where: eq(comments.id, id),
            with: {
                parentComment: true,
                author: {
                    columns: {
                        username: true
                    },
                },
                blogPost: true
            }
        })
    }
    async findAll() {
        return await this.pool.query.comments.findMany({
            with: {
                parentComment: true,
                author: {
                    columns: {
                        username: true
                    }
                },
                blogPost: true
            }
        })    
    }
    async findAllByAuthor(author: string) {
        return await this.pool.query.comments.findMany({
            where: eq(comments.author, author),
            with: {
                parentComment: true,
                author: {
                    columns: {
                        username: true
                    },
                },
                blogPost: true
            }
        })    
    }
    async findAllCommentsByBlogId(id: number) {
        return await this.pool.query.comments.findMany({
            where: eq(comments.blogPostId, id),
            with: {
                parentComment: true,
                author: {
                    columns: {
                        username: true
                    },
                },
                blogPost: true
            },
            orderBy: asc(comments.id)
        })
    }
    async create(data: Extract<Comment, typeof comments.$inferInsert>) {
        const created = await this.pool.insert(comments).values(data).returning();
        return created[0]
    }
    async updateById (id: number, data: Extract<Comment, typeof comments.$inferInsert>) {
        const updated = await this.pool.update(comments).set({
            content: data.content
        }).where(eq(comments.id, id)).returning();
        return updated[0]
    }
    async deleteById (id: number) {
        return await this.pool.delete(comments).where(eq(comments.id, id))
    }
}



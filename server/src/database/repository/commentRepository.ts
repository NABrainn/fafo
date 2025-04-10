import { Connection, db } from "../db.ts";
import { Comment, comments } from "../schema/comments.ts";
import { eq } from "drizzle-orm/expressions";

export class CommentRepository {

    private pool!: Connection

    constructor(pool: Connection) {
        this.pool = pool
    }

    async findById(id: number) {
        return await this.pool.query.comments.findFirst({
            where: eq(comments.id, id),
            with: {
                parentComment: true,
                author: true,
                blogPost: true
            }
        })
    }
    async findAll() {
        return await this.pool.query.comments.findMany({
            with: {
                parentComment: true,
                author: true,
                blogPost: true
            }
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



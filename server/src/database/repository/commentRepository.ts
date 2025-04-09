import { db } from "../db.ts";
import { Comment, comments } from "../schema/comments.ts";
import { eq } from "drizzle-orm/expressions";

export class CommentRepository {

    private pool!: typeof db

    constructor(pool: typeof db) {
        this.pool = pool
    }

    async findById(id: number) {
        const found = await this.pool.select().from(comments).where(eq(comments.id, id));
        return found[0]
    }
    async findAll() {
        return await db.select().from(comments)
    }
    async create(data: Comment) {
        const created = await this.pool.insert(comments).values({
        ...data,
        }).returning();
        return created[0]
    }
    async updateById (id: number, data: Comment) {
        const updated = await this.pool.update(comments).set({
        ...comments,
        content: data.content
        }).where(eq(comments.id, id)).returning();
        return updated[0]
    }
    async deleteById (id: number) {
        return await this.pool.delete(comments).where(eq(comments.id, id))
    }
}



import { Connection, db } from "../db.ts";
import { BlogPost, blogPosts } from "../schema/blogPosts.ts";
import { eq } from "drizzle-orm/expressions";

export class BlogPostRepository {

    private pool!: Connection

    constructor(pool: Connection) {
        this.pool = pool
    }
    async findById (id: number) {
        const found = await this.pool.query.blogPosts.findFirst({
            where: eq(blogPosts.id, id),
            with: {
                comments: true,
                author: true
            }
        })
        return found;
    }
    async findAll () {
        return await this.pool.query.blogPosts.findMany({
            with: {
                comments: true,
                author: true
            }
        })
    }
    async create (data: Extract<BlogPost, typeof blogPosts.$inferInsert>) {
        const inserted = await this.pool.insert(blogPosts).values(data).returning();
        return inserted[0]
    }
    async updateById (id: number, data: Extract<BlogPost, typeof blogPosts.$inferInsert>) {
        const updated = await this.pool.update(blogPosts).set({
           title: data.title,
           subtitle: data.subtitle,
           imgUrl: data.imgUrl
        }).where(eq(blogPosts.id, id)).returning();
        return updated[0]
    }
    async deleteById (id: number) {
        return await this.pool.delete(blogPosts).where(eq(blogPosts.id, id))
    }
}



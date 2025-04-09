import { db } from "../db.ts";
import { BlogPost, blogPosts } from "../schema/blogPosts.ts";
import { comments } from "../schema/comments.ts";
import { eq } from "drizzle-orm/expressions";

export class BlogPostRepository {

    private pool!: typeof db

    constructor(pool: typeof db) {
        this.pool = pool
    }
    async findById (id: number) {
        const selected = await this.pool.select().from(blogPosts).where(eq(blogPosts.id, id));
        return selected[0]
    }
    async findAll () {
        return await this.pool.select().from(blogPosts);
    }
    async create (data: Extract<BlogPost, typeof blogPosts.$inferInsert>) {
        const inserted = await this.pool.insert(blogPosts).values({
          ...data,
        }).returning();
        return inserted[0]
    }
    async updateById (id: number, data: BlogPost) {
         const updated = await this.pool.update(blogPosts).set({
           ...blogPosts,
           title: data.title,
           subtitle: data.subtitle,
           imgUrl: data.imgUrl
         }).where(eq(comments.id, id)).returning();
         return updated[0]
    }
    async deleteById (id: number) {
        return await this.pool.delete(blogPosts).where(eq(comments.id, id))
    }
}



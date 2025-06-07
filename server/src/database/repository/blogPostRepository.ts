import { Connection } from "../database.ts";
import { BlogPost, blogPosts } from "../schema/blogPosts.ts";
import { asc, desc, eq } from "drizzle-orm/expressions";
import { comments } from "../schema/comments.ts";
import {images} from "../schema/images.ts";


export class BlogPostRepository {

    pool!: Connection

    constructor(pool: Connection) {
        this.pool = pool
    }
    async findById (id: number) {
        const found = await this.pool.query.blogPosts.findFirst({
            where: eq(blogPosts.id, id),
            with: {
                author: true,
                comments: {
                    with: {
                        author: true
                    },
                    orderBy: asc(comments.id)
                },
                image: true
            },
        });
        return found;
    }
    async findAll () {
        return await this.pool.query.blogPosts.findMany({
            with: {
                comments: true,
                author: true,
            }
        })        
    }
    async create (data: Extract<BlogPost, typeof blogPosts.$inferInsert>) {
        if(!data.imageId) {
            const placeholderId = await this.pool.select({id: images.id}).from(images).where(eq(images.fileName, 'placeholder'));
            if(!placeholderId.length) throw new Error('Nie znaleziono placeholder obrazka');
            data.imageId = placeholderId[0].id;
        }
        const inserted = await this.pool.insert(blogPosts).values(data).returning();
        return inserted[0]
    }
    async updateById (id: number, data: Extract<BlogPost, typeof blogPosts.$inferInsert>) {
        const updated = await this.pool.update(blogPosts).set({
           title: data.title,
           subtitle: data.subtitle,
        }).where(eq(blogPosts.id, id)).returning();
        return updated[0]
    }
    async deleteById (id: number) {
        return await this.pool.delete(blogPosts).where(eq(blogPosts.id, id))
    }
}



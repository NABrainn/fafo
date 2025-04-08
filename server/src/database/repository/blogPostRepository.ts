import { db } from "../db.ts";
import { BlogPost, blogPosts } from "../schema/blogPosts.ts";
import { comments } from "../schema/comments.ts";
import { eq } from "drizzle-orm/expressions";
import { CrudRepository } from "./crudRepository.ts";
import { User } from "../schema/users.ts";

export const blogPostRepository: CrudRepository<BlogPost> = {
    findById: async (id: number) => {
        const selected = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
        return selected[0]
    },
    findAll: async () => {
        return await db.select().from(blogPosts);
    },
    create: async (data: BlogPost, author: User) => {
        const inserted = await db.insert(blogPosts).values({
          ...data,
          authorId: author.id
        }).returning();
        return inserted[0]
    },
    updateById: async (id: number, data: BlogPost) => {
         const updated = await db.update(blogPosts).set({
           ...blogPosts,
           title: data.title,
           subtitle: data.subtitle,
           imgUrl: data.imgUrl
         }).where(eq(comments.id, id)).returning();
         return updated[0]
    },
    deleteById: async (id: number) => {
        return await db.delete(blogPosts).where(eq(comments.id, id))
    }
}



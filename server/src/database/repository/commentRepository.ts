import { db } from "../db.ts";
import { Comment, comments } from "../schema/comments.ts";
import { eq } from "drizzle-orm/expressions";
import { CrudRepository } from "./crudRepository.ts";
import { BlogPost } from "../schema/blogPosts.ts";
import { User } from "../schema/users.ts";

export const commentRepository: CrudRepository<Comment> = {
    findById: async (id: number) => {
        const found = await db.select().from(comments).where(eq(comments.id, id));
        return found[0]
    },
    findAll: async () => {
        return await db.select().from(comments)
    },
    create: async (data: Comment, blogPost: BlogPost, author: User) => {
        const created = await db.insert(comments).values({
        ...data,
        blogPostId: blogPost.id,
        authorId: author.id
        }).returning();
        return created[0]
    },
    updateById: async (id: number, data: Comment) => {
        const updated = await db.update(comments).set({
        ...comments,
        content: data.content
        }).where(eq(comments.id, id)).returning();
        return updated[0]
    },
    deleteById: async (id: number) => {
        return await db.delete(comments).where(eq(comments.id, id))
    }
}



import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { blogPosts } from "./blogPosts.ts";
import { users } from "./users.ts";
import { relations } from "drizzle-orm/relations";

export type Comment = typeof comments.$inferSelect | typeof comments.$inferInsert

export const comments = pgTable('comments', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    content: varchar('content', {length: 50}).notNull(),

    authorId: integer('author_id').references(() => users.id, {onDelete: 'cascade'}).notNull(),
    blogPostId: integer('blog_post_id').references(() => blogPosts.id).notNull(),
    parentCommentId: integer('parent_comment_id')
})

export const commentsRelations = relations(comments, ({one}) => ({
    author: one(users, { 
        fields: [comments.authorId], 
        references: [users.id] 
    }),
    blogPost: one(blogPosts, { 
        fields: [comments.blogPostId], 
        references: [blogPosts.id] 
    }),
}))
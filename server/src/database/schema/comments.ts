import { date, integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { blogPosts } from "./blogPosts.ts";
import { users } from "./users.ts";
import { relations } from "drizzle-orm/relations";

export type Comment = typeof comments.$inferSelect | typeof comments.$inferInsert

export const comments = pgTable('comments', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    content: varchar('content', {length: 50}).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    
    author: varchar('username').references(() => users.username, {onDelete: 'cascade'}).notNull(),
    blogPostId: integer('blog_post_id').references(() => blogPosts.id, {onDelete: 'cascade'}).notNull(),
    parentCommentId: integer('parent_comment_id')
})

export const commentsRelations = relations(comments, ({one}) => ({
    author: one(users, { 
        fields: [comments.author], 
        references: [users.username] 
    }),
    blogPost: one(blogPosts, { 
        fields: [comments.blogPostId], 
        references: [blogPosts.id] 
    }),
    parentComment: one(comments, {
        fields: [comments.parentCommentId],
        references: [comments.id]
    })
}))
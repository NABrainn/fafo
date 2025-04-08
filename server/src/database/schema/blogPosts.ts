import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { comments } from "./comments.ts";
import { users } from "./users.ts";

export type BlogPost = typeof blogPosts.$inferSelect

export const blogPosts = pgTable('blog_posts', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    title: varchar('title', {length: 30}).notNull(),
    subtitle: varchar('subtitle', {length: 200}).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    imgUrl: varchar('img_url').notNull(),

    authorId: integer('author_id').references(() => users.id, {onDelete: 'cascade'}).notNull(),
})

export const blogPostRelations = relations(blogPosts, ({one, many}) => ({
    author: one(users, {
        fields: [blogPosts.authorId],
        references: [users.id]
    }),
    comments: many(comments)
}))
import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./users.ts";
import { relations } from "drizzle-orm/relations";
import { comments } from "./comments.ts";

export type BlogPost = typeof blogPosts.$inferSelect | typeof blogPosts.$inferInsert

export const blogPosts = pgTable('blog_posts', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    title: varchar('title', {length: 30}).notNull(),
    subtitle: varchar('subtitle', {length: 200}).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    imgUrl: varchar('img_url').notNull(),

    author: varchar('username').references(() => users.username, {onDelete: 'cascade'}).notNull(),
})

export const blogPostsRelations = relations(blogPosts, ({ one, many }) => ({
    author: one(users, { 
        fields: [blogPosts.author], 
        references: [users.username] 
    }),
    comments: many(comments)
}))
import { boolean, integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { comments } from "./comments.ts";
import { blogPosts } from "./blogPosts.ts";

export type User = typeof users.$inferSelect

export const users = pgTable('users', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    username: varchar('usermame', {length: 30}).unique().notNull(),
    email: varchar('email', {length: 50}).unique().notNull(),
    password: varchar('password').notNull(),
    verified: boolean('verified').default(false).notNull(),
})

export const usersRelations = relations(users, ({many}) => ({
    comments: many(comments),
    blogPosts: many(blogPosts)
}))
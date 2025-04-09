import { boolean, integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { comments } from "./comments.ts";
import { blogPosts } from "./blogPosts.ts";

export type User = typeof users.$inferSelect | typeof users.$inferInsert

export const users = pgTable('users', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    username: varchar('username', {length: 30}).unique().notNull(),
    email: varchar('email', {length: 50}).unique().notNull(),
    password: varchar('password').notNull(),
    verified: boolean('verified').default(false).notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
    blogPosts: many(blogPosts)
  }))
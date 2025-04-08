import { pgTable, foreignKey, integer, varchar, unique, boolean, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const comments = pgTable("comments", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "comments_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	content: varchar({ length: 50 }).notNull(),
	createdBy: integer(),
	authorId: integer("author_id").notNull(),
	blogPostId: integer("blog_post_id").notNull(),
	parentCommentId: integer("parent_comment_id"),
}, (table) => [
	foreignKey({
			columns: [table.authorId],
			foreignColumns: [users.id],
			name: "comments_author_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.blogPostId],
			foreignColumns: [blogPosts.id],
			name: "comments_blog_post_id_blog_posts_id_fk"
		}),
]);

export const users = pgTable("users", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "users_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	usermame: varchar({ length: 30 }).notNull(),
	email: varchar({ length: 50 }).notNull(),
	password: varchar().notNull(),
	verified: boolean().default(false).notNull(),
}, (table) => [
	unique("users_usermame_unique").on(table.usermame),
	unique("users_email_unique").on(table.email),
]);

export const blogPosts = pgTable("blog_posts", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "blog_posts_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	title: varchar({ length: 30 }).notNull(),
	subtitle: varchar({ length: 200 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	imgUrl: varchar("img_url").notNull(),
	authorId: integer("author_id"),
}, (table) => [
	foreignKey({
			columns: [table.authorId],
			foreignColumns: [users.id],
			name: "blog_posts_author_id_users_id_fk"
		}),
]);

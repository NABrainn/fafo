import { relations } from "drizzle-orm/relations";
import { users, comments, blogPosts } from "./schema";

export const commentsRelations = relations(comments, ({one}) => ({
	user: one(users, {
		fields: [comments.authorId],
		references: [users.id]
	}),
	blogPost: one(blogPosts, {
		fields: [comments.blogPostId],
		references: [blogPosts.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	comments: many(comments),
	blogPosts: many(blogPosts),
}));

export const blogPostsRelations = relations(blogPosts, ({one, many}) => ({
	comments: many(comments),
	user: one(users, {
		fields: [blogPosts.authorId],
		references: [users.id]
	}),
}));
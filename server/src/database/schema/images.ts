import {integer, pgTable, varchar} from "npm:drizzle-orm@0.41.0/pg-core";
import {relations} from "npm:drizzle-orm@0.41.0";
import {blogPosts} from "./blogPosts.ts";

export type  Image = typeof images.$inferSelect | typeof images.$inferInsert

export const images = pgTable('images', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    fileName: varchar('file_name', {length: 50}).notNull(),
    filePath: varchar('file_path', {length: 50}).notNull(),
    fileSize: integer('file_size').notNull(),
    contentType: varchar('content_type', {length: 50}).notNull(),
})

export const imagesRelations = relations(images, ({ many }) => ({
    blogPosts: many(blogPosts),
}));
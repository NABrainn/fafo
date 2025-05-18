import {integer, pgTable, varchar} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm/relations";
import {blogPosts} from "./blogPosts.ts";

export type  Image = typeof images.$inferSelect | typeof images.$inferInsert

export const images = pgTable('images', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    fileName: varchar('file_name', {length: 200}).notNull(),
    filePath: varchar('file_path', {length: 200}).notNull(),
    fileSize: integer('file_size').notNull(),
    contentType: varchar('content_type', {length: 50}).notNull(),
    ext: varchar('ext', {length: 5}).notNull(),
})

export const imagesRelations = relations(images, ({ many }) => ({
    blogPosts: many(blogPosts),
}));
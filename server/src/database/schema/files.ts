import {integer, pgTable, text, varchar} from "npm:drizzle-orm@0.41.0/pg-core";
import {relations} from "npm:drizzle-orm@0.41.0";
import {blogPosts} from "./blogPosts.ts";

export const files = pgTable('files', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    fileName: varchar('file_name', {length: 50}).notNull(),
    contentType: varchar('content_type', {length: 50}).notNull(),
    imageDate: text('image_date').notNull()
})
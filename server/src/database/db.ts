import { drizzle } from "drizzle-orm/node-postgres/driver";
import { comments } from "./schema/comments.ts";
import pg from "pg";
import { blogPosts } from "./schema/blogPosts.ts";
import { users } from "./schema/users.ts";
const { Pool } = pg

export const db = drizzle({ 
    client: new Pool({
        connectionString: Deno.env.get("DATABASE_URL") || "postgresql://postgres:postgres@localhost:5440/blog"
    }),
    schema: { comments, blogPosts, users } 
})

export const DB_TEST = drizzle({ 
    client: new Pool({
        connectionString: Deno.env.get("DATABASE_TEST_URL") || "postgresql://postgres:postgres@localhost:5450/blog"
    }),
    schema: { comments, blogPosts, users } 
})
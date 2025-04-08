import { drizzle } from "drizzle-orm/node-postgres/driver";
import { comments } from "./schema/comments.ts";
import pg from "pg";
import { blogPosts } from "./schema/blogPosts.ts";
import { users } from "./schema/users.ts";
const { Pool } = pg

export const db = drizzle({ 
    client: new Pool({
        host: Deno.env.get("PG_HOST") || "localhost",
        port: parseInt(Deno.env.get("PG_PORT") || "5432"),
        database: Deno.env.get("PG_DATABASE") || "blog",
        user: Deno.env.get("PG_USERNAME") || "postgres",
        password: Deno.env.get("PG_PASSWORD") || "postgres",
    }),
    schema: { comments, blogPosts, users } 
})
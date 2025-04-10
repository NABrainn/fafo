import { drizzle } from "drizzle-orm/node-postgres/driver";
import { comments } from "./schema/comments.ts";
import pg from "pg";
import { blogPosts } from "./schema/blogPosts.ts";
import { users } from "./schema/users.ts";
import schema from "./schema/exports/schema.ts";
const { Pool } = pg

export type Connection = typeof db;


//DEVELOPMENT DB
export const db = drizzle({ 
    client: new Pool({
        connectionString: Deno.env.get('DATABASE_DEV_URL')
    }),
    schema: {...schema}
})

//TESTING DB
export const dbTest = drizzle({
    client: new Pool({
        connectionString: Deno.env.get('DATABASE_TEST_URL')
    }),
    schema: {...schema}
})
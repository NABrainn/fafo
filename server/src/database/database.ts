import { drizzle } from "drizzle-orm/node-postgres/driver";
import pg from "pg";
import schema from "./schema/exports/schema.ts";
const { Pool } = pg

export type Connection = typeof db;

export const db = drizzle({
    client: new Pool({
        connectionString: Deno.env.get('DATABASE_URL')
    }),
    schema: {...schema}
})

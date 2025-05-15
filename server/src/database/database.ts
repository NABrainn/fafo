import pg from "pg";
import schema from "./schema/exports/schema.ts";
import { drizzle } from 'drizzle-orm/node-postgres';
const { Pool } = pg

export type Connection = typeof db;

const env = (Deno.env.get('DENO_ENV') || 'development') as keyof typeof dbConfig;

const dbConfig = {
    development: {
        client: new Pool({
            connectionString: Deno.env.get('DATABASE_DEV_URL'),
        }),
        schema: { ...schema },
    },
    test: {
        client: new Pool({
            connectionString: Deno.env.get('DATABASE_TEST_URL'),
        }),
        schema: { ...schema },
    },
    production: {
        client: new Pool({
            connectionString: Deno.env.get('DATABASE_URL'),
        }),
        schema: { ...schema },
    },
};

export const db = drizzle(dbConfig[env]);

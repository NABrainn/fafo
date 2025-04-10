import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: './src/database/schema',
    dialect: 'postgresql',
    dbCredentials: {
        url: Deno.env.get('DATABASE_TEST_URL') || 'postgresql://postgres:postgres@localhost:5450/blog'
    },
    extensionsFilters: ["postgis"],
    schemaFilter: ["public"],
    tablesFilter: ["*"],
})
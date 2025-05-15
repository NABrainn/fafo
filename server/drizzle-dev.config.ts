import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: './src/database/schema',
    dialect: 'postgresql',
    dbCredentials: {
        url: Deno.env.get('DATABASE_DEV_URL') || "postgresql://postgres:postgres@localhost:5440/blog",
    },
    extensionsFilters: ["postgis"],
    schemaFilter: ["public"],
    tablesFilter: ["*"],
})
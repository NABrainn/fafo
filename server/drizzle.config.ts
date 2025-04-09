import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export const env = Deno.env.get('DENO_ENV')
let url: string | undefined;
switch(env) {
    case('prod'):
        url = Deno.env.get('DATABASE_PROD_URL') || "postgresql://postgres:postgres@localhost:5460/blog"
        break;
    case('test'):
        url = Deno.env.get('DATABASE_TEST_URL') || "postgresql://postgres:postgres@localhost:5450/blog"
        break;
    default:
        url = Deno.env.get('DATABASE_DEV_URL') || "postgresql://postgres:postgres@localhost:5440/blog"
}

export default defineConfig({
    out: './drizzle',
    schema: './src/database/schema/*.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: url
    }
})
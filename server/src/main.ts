import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { blogPostController } from "./controller/blogPostController.ts";
import { commentController } from "./controller/commentController.ts";
import { userController } from "./controller/userController.ts";
import { jwt } from 'hono/jwt'
import type { JwtVariables } from 'hono/jwt'
import { authController } from "./controller/authController.ts";
import { except } from 'hono/combine';
import {stooqController} from "./controller/external/stooq/stooqController.ts";
import {chickenController} from "./controller/external/chickenFacts/chickenController.ts";
import { serveStatic } from 'hono/deno'
import { resolve, join } from "node:path";
import { compress } from 'hono/compress'
import {imageController} from "./controller/image/imageController.ts";
import {start} from "./controller/external/stooq/stooqService.ts";

type Variables = JwtVariables

const app = new Hono<{ Variables: Variables }>()

app.use('/*', cors({
    origin: 'http://localhost:4200',
    allowHeaders: ["Content-Type", "X-CSRF-Token"],
    allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
}))

app.use('/*', cors({
    origin: 'https://hotwings.deno.dev',
    allowHeaders: ['Origin', 'Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
    maxAge: 6000,
    credentials: true,
}))

app.use(compress())

const jwtSecret = Deno.env.get('JWT_SECRET');
if (!jwtSecret) {
    throw new Error(`JWT_SECRET environment variable is not set ${import.meta.url}`);
}

app.use('/api/*',
    except(
        [
            '/api/posts/public/*',
            '/api/comments/public/*',
            '/api/stooqapi/public/*',
            '/api/chicken/public/*',
            '/api/images/public/*'
        ],
        jwt({
            secret: jwtSecret,
            alg: 'HS256',
        })
    )
)

app.route('/api/images', imageController)
app.route('/api/posts', blogPostController);
app.route('/api/comments', commentController);
app.route('/api/users', userController);
app.route('/auth', authController);

app.route('/api/stooqapi', stooqController);
app.route('/api/chicken', chickenController);

await start()

const staticRoot = resolve(Deno.cwd(), '../dist/chicken-app/browser')
app.use('*', serveStatic({ root: staticRoot }));
app.get('*', serveStatic({ path: join(staticRoot, 'index.html') }))
Deno.serve(app.fetch)
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
import {startService, quotes, startStooqDataSync} from "./controller/external/stooq/stooqService.ts";
import { serveStatic } from 'hono/node-server/serve-static'

type Variables = JwtVariables

const app = new Hono<{ Variables: Variables }>()

app.use('/*', cors({
    origin: 'http://localhost:4200',
    allowHeaders: ['Origin', 'Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
    maxAge: 6000,
    credentials: true,
}))

const jwtSecret = Deno.env.get('JWT_SECRET');
if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is not set');
}

app.use('/api/*', 
    except(
        [
            '/api/posts/public/*',
            '/api/comments/public/*',
            '/api/stooqapi/public/*',
            '/api/chicken/public/*'
        ],
        jwt({
            secret: jwtSecret,
            alg: 'HS256',
        })
    )
)

app.use('*', serveStatic({ path: './out/chicken-app/browser/index.html' }))
app.route('/api/posts', blogPostController);
app.route('/api/comments', commentController);
app.route('/api/users', userController);
app.route('/auth', authController);

app.route('/api/stooqapi', stooqController);
app.route('/api/chicken', chickenController);

await startService()
Deno.serve(app.fetch)
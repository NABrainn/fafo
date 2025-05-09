import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { blogPostController } from "./controller/blogPostController.ts";
import { commentController } from "./controller/commentController.ts";
import { userController } from "./controller/userController.ts";
import { jwt } from 'hono/jwt'
import type { JwtVariables } from 'hono/jwt'
import { authController } from "./controller/authController.ts";

type Variables = JwtVariables

const app = new Hono<{ Variables: Variables }>()

app.use('/api/*', cors({
    origin: 'http://localhost:4200',
    allowHeaders: ['Origin', 'Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    maxAge: 6000,
    credentials: true,
}))

app.use('/auth/*', cors({
    origin: 'http://localhost:4200',
    allowHeaders: ['Origin', 'Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    maxAge: 6000,
    credentials: true,
}))

app.use('/api/*', jwt({
    secret: Deno.env.get('JWT_SECRET') || '',
    alg: 'HS256',
}))

app.route('/api/posts', blogPostController);
app.route('/api/comments', commentController);
app.route('/api/users', userController);
app.route('/auth', authController);

Deno.serve(app.fetch)
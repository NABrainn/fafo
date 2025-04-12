import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { blogPostController } from "./controller/blogPostController.ts";
import { commentController } from "./controller/commentController.ts";
import { userController } from "./controller/userController.ts";
const app = new Hono()

app.use('/api/*', cors({
    origin: 'http://localhost:4200',
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 6000,
    credentials: true,
}))

app.route('/api/posts', blogPostController),
app.route('/api/comments', commentController),
app.route('/api/users', userController)

Deno.serve(app.fetch)
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { blogPostController } from "./controller/blogPostController.ts";
import { commentController } from "./controller/commentController.ts";
import { userController } from "./controller/userController.ts";
import { jwt } from 'hono/jwt'
import type { JwtVariables } from 'hono/jwt'
import { authController } from "./controller/authController.ts";
import { except } from 'hono/combine';

type Variables = JwtVariables

const app = new Hono<{ Variables: Variables }>()

app.use('/*', cors({
    origin: 'http://localhost:4200',
    allowHeaders: ['Origin', 'Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
    maxAge: 6000,
    credentials: true,
}))

app.use('/api/*', 
    except(
        [
            '/api/posts/public/*',
            '/api/comments/public'
        ],
        jwt({
            secret: Deno.env.get('JWT_SECRET') || '',
            alg: 'HS256',
        })
    )
)

app.route('/api/posts', blogPostController);
app.route('/api/comments', commentController);
app.route('/api/users', userController);
app.route('/auth', authController);

Deno.serve(app.fetch)
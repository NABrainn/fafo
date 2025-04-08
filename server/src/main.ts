import { Hono } from 'hono'
import { blogPostController } from "./controller/blogPostController.ts";
import { commentController } from "./controller/commentController.ts";
import { userController } from "./controller/userController.ts";
const app = new Hono()

app.route('/posts', blogPostController),
app.route('/comments', commentController),
app.route('/users', userController)


Deno.serve(app.fetch)
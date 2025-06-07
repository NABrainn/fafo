import { Hono } from "hono";
import { BlogPost, blogPosts } from "../database/schema/blogPosts.ts";
import { BlogPostRepository } from "../database/repository/blogPostRepository.ts";
import { db } from "../database/database.ts";
import {Context} from "npm:hono@4.7.5";

interface JwtPayload {
    sub: string;
}

type Variables = {
    jwtPayload: JwtPayload;
};
export const blogPostController = new Hono<{ Variables: Variables }>();
export const getBlogPostHandler = (async (c: Context, blogPostRepository: BlogPostRepository) => {
    try {
        const id = c.req.param('id');

        if (isNaN(Number(id))) {
            return c.json({ error: 'Nieprawidłowy identyfikator posta' }, 400);
        }

        const blogPost = await blogPostRepository.findById(parseFloat(id))
        if(!blogPost) {
            return c.json({error: 'Nie znaleziono posta'}, 404)
        }
        return c.json(blogPost);
    } catch (err) {
        console.error("💥 Błąd podczas pobierania danych:", err);
        return c.json({ error: "Wystąpił błąd serwera" }, 500);
    }
})

export const getAllBlogPostHandler = (async (c: Context, blogPostRepository: BlogPostRepository) => {
    try {
        const blogPosts = await blogPostRepository.findAll()

        if(!blogPosts)
            return c.json({error: 'Nie znaleziono postów'}, 404)

        return c.json(blogPosts, 200);
    } catch (err) {
        console.error("💥 Błąd podczas pobierania danych:", err);
        return c.json({ error: "Wystąpił błąd serwera" }, 500);
    }
})

export const postBlogPostHandler = (async (c: Context, blogPostRepository: BlogPostRepository) => {
    try {
        const body = await c.req.json<Extract<BlogPost, typeof blogPosts.$inferInsert>>()

        if (!body.title || !body.content) {
            return c.json({ error: 'Brak wymaganych danych posta' }, 400);
        }

        const payload = c.get('jwtPayload')
        if(payload)
            body.author = payload.sub
        const blogPost = await blogPostRepository.create(body)
        if(!blogPost)
            return c.json({error: 'Nie udało się utworzyć posta'}, 400)
        return c.json(blogPost, 200);
    } catch (err) {
        console.error("💥 Błąd podczas pobierania danych:", err);
        return c.json({ error: "Wystąpił błąd serwera" }, 500);
    }
})

export const putBlogPostHandler = (async (c: Context, blogPostRepository: BlogPostRepository) => {
    try {
        const body = await c.req.json<Extract<BlogPost, typeof blogPosts.$inferSelect>>()
        const payload = c.get('jwtPayload')
        console.log(payload)

        if (!payload) {
            return c.json({ error: "Brak autoryzacji" }, 401);
        }

        body.author = payload.sub

        if (!body.id || !body.subtitle || !body.title || !body.content) {
            return c.json({ error: 'Brak wymaganych danych do aktualizacji' }, 400);
        }

        if (isNaN(Number(body.id))) {
            return c.json({ error: 'Nieprawidłowy identyfikator posta' }, 400);
        }

        const found = await blogPostRepository.findById(Number(body.id))

        if (payload.sub !== found?.author) {
            console.log(`sub: ${payload.sub}, found: ${found?.author}`)
            return c.json({ error: 'Brak wymaganych uprawnień do aktualizacji posta' }, 403);
        }

        const blogPost = await blogPostRepository.updateById(body.id, body)
        if(!blogPost)
            return c.json({error: 'Nie znaleziono posta'}, 404)
        return c.json(blogPost, 200);
    } catch (err) {
        console.error("💥 Błąd podczas pobierania danych:", err);
        return c.json({ error: "Wystąpił błąd serwera" }, 500);
    }
})

export const deleteBlogPostHandler = (async (c: Context, blogPostRepository: BlogPostRepository) => {
    try {
        const id = c.req.param('id');
        const payload = c.get('jwtPayload')

        if (isNaN(Number(id))) {
            return c.json({ error: 'Nieprawidłowy identyfikator posta' }, 400);
        }
        const found = await blogPostRepository.findById(Number(id))

        if (payload.sub !== found?.author) {
            return c.json({ error: 'Brak wymaganych uprawnień do usunięcia posta' }, 403);
        }

        const blogPost = await blogPostRepository.deleteById(Number(id))

        if(blogPost.rowCount === 0)
            return c.json({error: 'Nie znaleziono posta'}, 404)

        return c.json(blogPost, 200);
    } catch (err) {
        console.error("💥 Błąd podczas pobierania danych:", err);
        return c.json({ error: "Wystąpił błąd serwera" }, 500);
    }
})

blogPostController.get('/public/:id', (c) => getBlogPostHandler(c, new BlogPostRepository(db)))
blogPostController.get('/public/', (c) => getAllBlogPostHandler(c, new BlogPostRepository(db)))
blogPostController.post('/', (c) => postBlogPostHandler(c, new BlogPostRepository(db)))
blogPostController.put('/:id', (c) => putBlogPostHandler(c, new BlogPostRepository(db)))
blogPostController.delete('/:id', (c) => deleteBlogPostHandler(c, new BlogPostRepository(db)))


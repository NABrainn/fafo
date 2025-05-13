import { Hono } from "hono";
import { BlogPost, blogPosts } from "../database/schema/blogPosts.ts";
import { BlogPostRepository } from "../database/repository/blogPostRepository.ts";
import { db } from "../database/database.ts";

export const blogPostController = new Hono()
const blogPostRepository = new BlogPostRepository(db)

blogPostController.get('/public/:id', async (c) => {
    try {
        const id = c.req.param('id');
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

blogPostController.get('/public', async (c) => {
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

blogPostController.post('/', async (c) => {
    try {
        const body = await c.req.json<Extract<BlogPost, typeof blogPosts.$inferInsert>>()    
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

blogPostController.put('/:id', async (c) => {
    try {
        const body = await c.req.json<Extract<BlogPost, typeof blogPosts.$inferSelect>>()
        const payload = c.get('jwtPayload')
        if(payload)
            body.author = payload.sub
        const blogPost = await blogPostRepository.updateById(body.id, body)
        if(!blogPost) 
            return c.json({error: 'Nie znaleziono posta'}, 404)
        return c.json(blogPost, 200);
    } catch (err) {
        console.error("💥 Błąd podczas pobierania danych:", err);
        return c.json({ error: "Wystąpił błąd serwera" }, 500);
    }
})

blogPostController.delete('/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const blogPost = await blogPostRepository.deleteById(Number(id))
        if(blogPost.rowCount === 0) 
            return c.json({error: 'Nie znaleziono posta'}, 404)
        
        return c.json(blogPost, 200);
    } catch (err) {
        console.error("💥 Błąd podczas pobierania danych:", err);
        return c.json({ error: "Wystąpił błąd serwera" }, 500);
    }
})
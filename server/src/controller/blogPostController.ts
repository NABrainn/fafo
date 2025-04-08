import { Hono } from "hono";
import { blogPostRepository } from "../database/repository/blogPostRepository.ts";
import { BlogPost } from "../database/schema/blogPosts.ts";


export const blogPostController = new Hono()

blogPostController.get('/:id', async (c) => {
    const id = c.req.param('id');
    const blogPost = await blogPostRepository.findById(parseFloat(id))
    if(!blogPost) {
        return c.json({error: 'Nie znaleziono posta'}, 404)
    } 
    return c.json(blogPost);
})
blogPostController.get('/', async (c) => {
    const blogPosts = await blogPostRepository.findAll()
    if(!blogPosts) 
        return c.json({error: 'Nie znaleziono postów'}, 404)
    return c.json(blogPosts, 200);
})
blogPostController.post('/', async (c) => {
    const body = await c.req.json<BlogPost>()
    const blogPost = await blogPostRepository.create(body)
    if(!blogPost)
        return c.json({error: 'Nie znaleziono posta'}, 404)
    
    return c.json(blogPost, 200);
})
blogPostController.put('/:id', async (c) => {
    const body = await c.req.json<BlogPost>()
    const blogPost = await blogPostRepository.updateById(body.id, body)
    if(!blogPost) 
        return c.json({error: 'Nie znaleziono posta'}, 404)
    return c.json(blogPost, 200);
})
blogPostController.delete('/:id', async (c) => {
    const body = await c.req.json<BlogPost>()
    const blogPost = await blogPostRepository.deleteById(body.id)
    if(blogPost.rowCount === 0) 
        return c.json({error: 'Nie znaleziono posta'}, 404)
    
    return c.json(blogPost, 200);
})
import { Hono } from "hono";
import { Comment, comments } from "../database/schema/comments.ts";
import { CommentRepository } from "../database/repository/commentRepository.ts";
import { db } from "../database/database.ts";

export const commentController = new Hono()
const commentRepository = new CommentRepository(db)

commentController.get('/:id', async (c) => {
    const id = c.req.param('id');
    const comment = await commentRepository.findById(Number(id))
    if(!comment) {
        return c.json({error: 'Nie znaleziono komentarza'}, 404)
    } 
    return c.json(comment);
})
commentController.get('/public', async (c) => {
    const comments = await commentRepository.findAll()
    if(!comments) 
        return c.json({error: 'Nie znaleziono komentarzy'}, 404)
    return c.json(comments, 200);
})
commentController.get('/:author', async (c) => {
    const author = c.req.param('author')
    const comments = await commentRepository.findAllByAuthor(author)
    if(!comments) 
        return c.json({error: 'Nie znaleziono komentarzy'}, 404)
    return c.json(comments, 200);
})
commentController.get('/public/blogposts/:id', async (c) => {
    const id = c.req.param('id')
    const comments = await commentRepository.findAllCommentsByBlogId(Number(id))
    if(!comments) 
        return c.json({error: 'Nie znaleziono komentarzy'}, 404)
    return c.json(comments, 200);
})
commentController.post('/', async (c) => {
    const body = await c.req.json<Extract<Comment, typeof comments.$inferInsert>>()
    const payload = c.get('jwtPayload')
    console.log(payload)
    if(payload)
        body.author = payload.sub    
    const comment = await commentRepository.create(body)
    if(!comment) 
        return c.json({error: 'Nie udało się utworzyć komentarza'}, 404)
    
    return c.json(comment, 200);
})
commentController.put('/:id', async (c) => {
    const body = await c.req.json<Extract<Comment, typeof comments.$inferSelect>>()
    const comment = await commentRepository.updateById(body.id, body)
    if(!comment) 
        return c.json({error: 'Nie znaleziono komentarza'}, 404)
    return c.json(comment, 200);
})
commentController.delete('/:id', async (c) => {
    const id = c.req.param('id')
    const comment = await commentRepository.deleteById(Number(id))
    if(comment.rowCount === 0)
        return c.json({error: 'Nie znaleziono komentarza do usunięcia'}, 404)
    
    return c.json(comment, 200);
})
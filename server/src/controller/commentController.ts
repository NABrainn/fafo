import { Hono } from "hono";
import { Comment, comments } from "../database/schema/comments.ts";
import { CommentRepository } from "../database/repository/commentRepository.ts";
import { db } from "../database/database.ts";

export const commentController = new Hono()
const commentRepository = new CommentRepository(db)

commentController.get('/:id', async (c) => {
    const id = c.req.param('id');
    const comment = await commentRepository.findById(parseFloat(id))
    if(!comment) {
        return c.json({error: 'Nie znaleziono komentarza'}, 404)
    } 
    return c.json(comment);
})
commentController.get('/', async (c) => {
    const comments = await commentRepository.findAll()
    if(!comments) 
        return c.json({error: 'Nie znaleziono komentarzy'}, 404)
    return c.json(comments, 200);
})
commentController.post('/', async (c) => {
    const body = await c.req.json<Extract<Comment, typeof comments.$inferInsert>>()
    const comment = await commentRepository.create(body)
    if(!comment) 
        return c.json({error: 'Nie znaleziono komentarza'}, 404)
    
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
    const body = await c.req.json<Extract<Comment, typeof comments.$inferSelect>>()
    const comment = await commentRepository.deleteById(body.id)
    if(comment.rowCount === 0) 
        return c.json({error: 'Nie znaleziono komentarza'}, 404)
    
    return c.json(comment, 200);
})
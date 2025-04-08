import { Hono } from "hono";
import { Comment } from "../database/schema/comments.ts";
import { commentRepository } from "../database/repository/commentRepository.ts";

export const commentController = new Hono()

commentController.get('/:id', async (c) => {
    const id = c.req.param('id');
    try {
        const comment = await commentRepository.findById(parseFloat(id))
        if(!comment) {
            return c.json({error: 'Nie znaleziono komentarza'}, 404)
        } 
        return c.json(comment);
    }
    catch(e) {
        return c.json({error: 'Wystąpił nieznany problem'}, 500)
    }
})
commentController.get('/', async (c) => {
    try {
        const comments = await commentRepository.findAll()
        if(!comments) 
            return c.json({error: 'Nie znaleziono komentarzy'}, 404)
        return c.json(comments, 200);
    }
    catch(e) {
        return c.json({error: 'Wystąpił nieznany problem'}, 500)
    }
})
commentController.post('/', async (c) => {
    try {
        const body = await c.req.json<Comment>()
        const comment = await commentRepository.create(body)
        if(!comment) 
            return c.json({error: 'Nie znaleziono komentarza'}, 404)
        
        return c.json(comment, 200);
    }
    catch(e) {
        return c.json({error: 'Wystąpił nieznany problem'}, 500)
    }
})
commentController.put('/:id', async (c) => {
    try {
        const body = await c.req.json<Comment>()
        const comment = await commentRepository.updateById(body.id, body)
        if(!comment) 
            return c.json({error: 'Nie znaleziono komentarza'}, 404)
        return c.json(comment, 200);
    }
    catch(e) {
        return c.json({error: 'Wystąpił nieznany problem'}, 500)
    }
})
commentController.delete('/:id', async (c) => {
    try {
        const body = await c.req.json<Comment>()
        const comment = await commentRepository.deleteById(body.id)
        if(comment.rowCount === 0) 
            return c.json({error: 'Nie znaleziono komentarza'}, 404)
        
        return c.json(comment, 200);
    }
    catch(e) {
        return c.json({error: 'Wystąpił nieznany problem'}, 500)
    }
})
import { Hono } from "hono";
import { Comment, comments } from "../database/schema/comments.ts";
import { CommentRepository } from "../database/repository/commentRepository.ts";
import { db } from "../database/database.ts";
import {Context} from "npm:hono@4.7.5";

export const commentController = new Hono();

export const getCommentHandler = (async (c: Context, commentRepository: CommentRepository) => {
    try {
        const id = c.req.param('id');

        if (isNaN(Number(id))) {
            return c.json({ error: 'Nieprawidłowy identyfikator komentarza' }, 400);
        }

        const comment = await commentRepository.findById(Number(id))
        if (!comment) {
            return c.json({error: 'Nie znaleziono komentarza'}, 404)
        }
        return c.json(comment);
    } catch (err) {
        console.error("💥 Błąd podczas pobierania danych:", err);
        return c.json({error: "Wystąpił błąd serwera"}, 500);
    }
})
export const getAllCommentsHandler = (async (c: Context, commentRepository: CommentRepository) => {
    try {
        const comments = await commentRepository.findAll()
        return c.json(comments, 200);
    } catch (err) {
        console.error("💥 Błąd podczas pobierania danych:", err);
        return c.json({error: "Wystąpił błąd serwera"}, 500);
    }
})
export const getCommentByAuthorHandler = (async (c: Context, commentRepository: CommentRepository) => {
    try {
        const author = c.req.param('author')

        if (!author) {
            return c.json({ error: 'Nie podano autora' }, 400);
        }

        const comments = await commentRepository.findAllByAuthor(author)
        return c.json(comments, 200);
    } catch (err) {
        console.error("💥 Błąd podczas pobierania danych:", err);
        return c.json({error: "Wystąpił błąd serwera"}, 500);
    }
})
export const getBlogPostHandler = (async (c: Context, commentRepository: CommentRepository) => {
    try {
        const id = c.req.param('id')

        if (isNaN(Number(id))) {
            return c.json({ error: 'Nieprawidłowy identyfikator posta' }, 400);
        }

        const comments = await commentRepository.findAllCommentsByBlogId(Number(id))
        if (!comments)
            return c.json({error: 'Nie znaleziono komentarzy'}, 404)
        return c.json(comments, 200);
    } catch (err) {
        console.error("💥 Błąd podczas pobierania danych:", err);
        return c.json({error: "Wystąpił błąd serwera"}, 500);
    }
})
export const postCommentHandler = (async (c: Context, commentRepository: CommentRepository) => {
    try {
        const body = await c.req.json<Extract<Comment, typeof comments.$inferInsert>>()

        if (!body.content || !body.blogPostId) {
            return c.json({ error: 'Brakuje treści komentarza lub ID posta' }, 400);
        }

        const payload = c.get('jwtPayload')
        if (payload)
            body.author = payload.sub
        const comment = await commentRepository.create(body)
        if (!comment)
            return c.json({error: 'Nie udało się utworzyć komentarza'}, 404)

        return c.json(comment, 200);
    } catch (err) {
        console.error("💥 Błąd podczas pobierania danych:", err);
        return c.json({error: "Wystąpił błąd serwera"}, 500);
    }
})


export const putCommentHandler = async (c: Context, commentRepository: CommentRepository) => {
    try {
        const body = await c.req.json<Extract<Comment, typeof comments.$inferSelect>>()
        const payload = c.get('jwtPayload')

        if (!body.id || !body.content) {
            return c.json({ error: 'Brak ID lub treści komentarza' }, 400);
        }

        if (isNaN(Number(body.id))) {
            return c.json({ error: 'Nieprawidłowy identyfikator komentarza' }, 400);
        }

        const found = await commentRepository.findById(Number(body.id))
        if (!found) {
            return c.json({error: 'Nie znaleziono komentarza'}, 404)
        }

        if (payload.sub !== found.author) {
            return c.json({ error: 'Brak wymaganych uprawnień do edycji komentarza' }, 403);
        }

        const comment = await commentRepository.updateById(body.id, body)
        if (!comment)
            return c.json({error: 'Nie znaleziono komentarza'}, 404)
        return c.json(comment, 200);
    } catch (err) {
        console.error("Błąd podczas pobierania danych:", err);
        return c.json({error: "Wystąpił błąd serwera"}, 500);
    }
}


export const deleteCommentHandler = async (c: Context, commentRepository: CommentRepository) => {
    try {
        const id = c.req.param('id')
        const payload = c.get('jwtPayload')

        if (isNaN(Number(id))) {
            return c.json({ error: 'Nieprawidłowy identyfikator komentarza' }, 400);
        }

        const found = await commentRepository.findById(Number(id))

        // Fix: Compare payload.sub with found?.author (string), not found?.author.username
        if (found && payload.sub !== found.author) {
            return c.json({ error: 'Brak wymaganych uprawnień do usunięcia komentarza' }, 403);
        }

        const comment = await commentRepository.deleteById(Number(id))
        if (comment.rowCount === 0)
            return c.json({error: 'Nie znaleziono komentarza do usunięcia'}, 404)

        return c.json(comment, 200);
    } catch (err) {
        console.error("💥 Błąd podczas pobierania danych:", err);
        return c.json({error: "Wystąpił błąd serwera"}, 500);
    }
}

commentController.get('/:id', async (c) => getCommentHandler(c, new CommentRepository(db)))
commentController.get('/public', async (c) => getAllCommentsHandler(c, new CommentRepository(db)))
commentController.get('/:author', async (c) => getCommentByAuthorHandler(c, new CommentRepository(db)))
commentController.get('/public/blogposts/:id', async (c) => getBlogPostHandler(c, new CommentRepository(db)))
commentController.post('/', async (c) => postCommentHandler(c, new CommentRepository(db)))
commentController.put('/:id', async (c) => putCommentHandler(c, new CommentRepository(db)))
commentController.delete('/:id', async (c) => deleteCommentHandler(c, new CommentRepository(db)))
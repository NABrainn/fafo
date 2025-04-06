import { Request, Response } from 'express';
import { commentRepository } from '../reporsitory-dao/CommentDao.ts';

export const getAllComments = async (req: Request, res: Response) => {
    try {
        const postId = req.query.postId ? parseInt(req.query.postId as string) : undefined;
        const comments = await commentRepository.findAll(postId);
        res.json(comments);
    } catch (error) {
        console.error('Error getting all comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
};

export const getCommentById = async (req: Request, res: Response) => {
    try {
        const comment = await commentRepository.findById(parseInt(req.params.id));
        if (!comment) return res.status(404).json({ error: 'Comment not found' });
        res.json(comment);
    } catch (error) {
        console.error('Error getting comment by id:', error);
        res.status(500).json({ error: 'Failed to fetch the comment' });
    }
};

export const createComment = async (req: Request, res: Response) => {
    try {
        const newComment = await commentRepository.create(req.body);
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error ceating comment:', error);
        res.status(400).json({ error: 'Failed to create comment' });
    }
};

export const updateComment = async (req: Request, res: Response) => {
    try {
        const [count, [updatedComment]] = await commentRepository.update(
            parseInt(req.params.id),
            req.body
        );
        if (count === 0) return res.status(404).json({ error: 'Comment not found' });
        res.json(updatedComment);
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(400).json({ error: 'Failed to update comment' });
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    try {
        const deleted = await commentRepository.deleteOne(parseInt(req.params.id));
        if (deleted === 0) return res.status(404).json({ error: 'Comment not found' });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Failed to delete comment' });
    }
};

import express from 'express';
import {
    getAllComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment,
} from './commentController.ts';

const router = express.Router();

router.get('/comments', getAllComments);
router.get('/comments/:id', getCommentById);
router.post('/comments', createComment);
router.put('/comments/:id', updateComment);
router.delete('/comments/:id', deleteComment);

export default router;

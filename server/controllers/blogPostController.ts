import { Request, Response } from 'express';
import { blogPostRepository } from '../reporsitory-dao/BlogPostDao.ts';

// GET /posts?authorId=1 - Get all posts or by author
export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const authorId = req.query.authorId ? parseInt(req.query.authorId as string) : undefined;
        const posts = await blogPostRepository.findAll(authorId);
        res.json(posts);
    } catch (error) {
        console.error('Error getting all posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
};

// GET /posts/:id - Get single post by ID
export const getPostById = async (req: Request, res: Response) => {
    try {
        const post = await blogPostRepository.findById(parseInt(req.params.id));
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    } catch (error) {
        console.error('Error getting post by id:', error);
        res.status(500).json({ error: 'Failed to fetch the post' });
    }
};

// POST /posts - Create a new post
export const createPost = async (req: Request, res: Response) => {
    try {
        const newPost = await blogPostRepository.create(req.body);
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(400).json({ error: 'Failed to create post' });
    }
};

// PUT /posts/:id - Update a post
export const updatePost = async (req: Request, res: Response) => {
    try {
        const [count, [updatedPost]] = await blogPostRepository.update(
            parseInt(req.params.id),
            req.body
        );
        if (count === 0) return res.status(404).json({ error: 'Post not found' });
        res.json(updatedPost);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(400).json({ error: 'Failed to update post' });
    }
};

// DELETE /posts/:id - Delete a post
export const deletePost = async (req: Request, res: Response) => {
    try {
        const deleted = await blogPostRepository.deleteOne(parseInt(req.params.id));
        if (deleted === 0) return res.status(404).json({ error: 'Post not found' });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
};

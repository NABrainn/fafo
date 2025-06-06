import { Hono } from "hono";
import { BlogPost, blogPosts } from "../database/schema/blogPosts.ts";
import { BlogPostRepository } from "../database/repository/blogPostRepository.ts";
import { db } from "../database/database.ts";

type BlogPostRepoLike = {
  findById(id: number): Promise<BlogPost | null>;
  findAll(): Promise<BlogPost[]>;
  create(data: any): Promise<BlogPost | null>;
  updateById(id: number, data: any): Promise<BlogPost | null>;
  deleteById(id: number): Promise<{ rowCount: number | null }>;
};

export function createBlogPostController(blogPostRepository: BlogPostRepoLike) {
  const blogPostController = new Hono();

  blogPostController.get("/:id", async (c) => {
    const id = parseFloat(c.req.param("id"));
    const blogPost = await blogPostRepository.findById(id);
    if (!blogPost) {
      return c.json({ error: "Nie znaleziono posta" }, 404);
    }
    return c.json(blogPost);
  });

  blogPostController.get("/", async (c) => {
    const all = await blogPostRepository.findAll();
    if (!all.length) {
      return c.json({ error: "Nie znaleziono postów" }, 404);
    }
    return c.json(all, 200);
  });

  blogPostController.post("/", async (c) => {
    const body = await c.req.json<Extract<BlogPost, typeof blogPosts.$inferInsert>>();
    const blogPost = await blogPostRepository.create(body);
    if (!blogPost) {
      return c.json({ error: "Nie udało się utworzyć posta" }, 400);
    }
    return c.json(blogPost, 200);
  });

  blogPostController.put("/:id", async (c) => {
    const body = await c.req.json<Extract<BlogPost, typeof blogPosts.$inferSelect>>();
    const blogPost = await blogPostRepository.updateById(body.id, body);
    if (!blogPost) {
      return c.json({ error: "Nie znaleziono posta" }, 404);
    }
    return c.json(blogPost, 200);
  });

  blogPostController.delete("/:id", async (c) => {
    const body = await c.req.json<Extract<BlogPost, typeof blogPosts.$inferSelect>>();
    const result = await blogPostRepository.deleteById(body.id);
    if (!result.rowCount) {
      return c.json({ error: "Nie znaleziono posta" }, 404);
    }
    return c.json(result, 200);
  });

  return blogPostController;
}

const realRepo = new BlogPostRepository(db);
export const blogPostController = createBlogPostController(realRepo);

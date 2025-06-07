import { assertEquals } from "@std/assert/equals";
import {BlogPost, blogPosts} from "../../database/schema/blogPosts.ts";
import { sign } from 'hono/jwt'
import {
  deleteBlogPostHandler,
  getAllBlogPostHandler,
  getBlogPostHandler,
  postBlogPostHandler,
  putBlogPostHandler
} from "../blogPostController.ts";
import {createMockContext} from "./utils/mockContext.ts";


const db = new Map();

interface BlogPostRepository {
  pool: any;
  findById(id: number): Promise<any>;
  findAll(): Promise<any[]>;
  create(data: Extract<BlogPost, typeof blogPosts.$inferInsert>): Promise<any>;
  updateById(id: number, data: Extract<BlogPost, typeof blogPosts.$inferInsert>): Promise<any>;
  deleteById(id: number): Promise<any>;
}

const mockBlogPostRepository: BlogPostRepository = {
  pool: undefined,
  findById: async (id: number): Promise<any> => db.get(id),
  findAll: async (): Promise<any[]> => Array.from(db.values()),
  create: async (data: Extract<BlogPost, typeof blogPosts.$inferInsert>): Promise<any> => {
    const mockBlogPost = {
      id: 1,
      title: data.title,
      content: data.content,
      subtitle: data.subtitle,
      imageId: data.imageId || 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.set(mockBlogPost.id, mockBlogPost);
    return mockBlogPost;
  },
  updateById: async (id: number, data: Extract<BlogPost, typeof blogPosts.$inferInsert>): Promise<any> => ({
    id,
    title: data.title,
    subtitle: data.subtitle,
  }),
  deleteById: async (id: number): Promise<any> => ({}),
};
const mockKey = await sign({
  sub: 'username',
  exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24
}, '1234', 'HS256');

Deno.test("GET /:id - returns 404 if not found", async () => {
  db.clear()
  const c = createMockContext({ path: '/public/999', params: { id: '999'} });
  await mockBlogPostRepository.create({
    title: "example title",
    subtitle: "example subtitle",
    content: "example content",
    imageId: 0,
    author: "example author"
  })
  const res = await getBlogPostHandler(c, mockBlogPostRepository);
  assertEquals(await res.json(), { error: "Nie znaleziono posta" });
  assertEquals(res.status, 404);
});

Deno.test("GET /:id - returns blog post if found", async () => {
  db.clear()
  const c = createMockContext({ path: '/public/1', params: { id: '1'} });
  await mockBlogPostRepository.create({
    title: "example title",
    subtitle: "example subtitle",
    content: "example content",
    imageId: 0,
    author: "example author"
  })

  const res = await getBlogPostHandler(c, mockBlogPostRepository);
  const json = await res.json();
  assertEquals(res.status, 200);
  assertEquals(json.title, "example title");
});

Deno.test("GET / - returns all blog posts", async () => {
  db.clear()
  const c = createMockContext({ path: '/public/' });
  await mockBlogPostRepository.create({
    title: "example title",
    subtitle: "example subtitle",
    content: "example content",
    imageId: 0,
    author: "example author"
  })
  const res = await getAllBlogPostHandler(c, mockBlogPostRepository);
  const json = await res.json();
  assertEquals(Array.isArray(json), true);
  assertEquals(json.length, 1);
});

Deno.test("POST / - creates a blog post", async () => {
  db.clear()
  const c = createMockContext({
    path: '/public/',
    body: {
      title: "example title",
      subtitle: "example subtitle",
      content: "example content",
      imageId: 0,
      author: "example author"
    }
  });
  const mockBlogPost = await mockBlogPostRepository.create({
    title: "example title",
    subtitle: "example subtitle",
    content: "example content",
    imageId: 0,
    author: "example author"
  })
  const res = await postBlogPostHandler(c, mockBlogPostRepository)
  assertEquals(res.status, 200);

})
Deno.test("PUT /:id - returns 403 if user lacks permissions", async () => {
  db.clear();
  const c = createMockContext({
    jwtPayload: {
      sub: "different_user",
    },
    path: "/1",
    params: { id: "1" },
    body: {
      id: 1,
      title: "new title",
      subtitle: "new subtitle",
      content: "new content",
      imageId: 0,
      author: "author",
    },
  });

  await mockBlogPostRepository.create({
    title: "example title",
    subtitle: "example subtitle",
    content: "example content",
    imageId: 0,
    author: "author",
  });

  const res = await putBlogPostHandler(c, mockBlogPostRepository);
  const json = await res.json();

  assertEquals(res.status, 403);
  assertEquals(json, { error: "Brak wymaganych uprawnień do aktualizacji posta" });
});

Deno.test("DELETE /:id - deletes a blog post", async () => {
  const c = createMockContext({
    jwtPayload: {
      sub: "different_user",
    },
    path: "/1",
    params: { id: "1" },
  });
  await mockBlogPostRepository.create({
    title: "example title",
    subtitle: "example subtitle",
    content: "example content",
    imageId: 0,
    author: "author",
  });
  const res = await deleteBlogPostHandler(c, mockBlogPostRepository);
  const json = await res.json();
  assertEquals(res.status, 403);
});


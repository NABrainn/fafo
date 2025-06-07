import { assertEquals } from "@std/assert/equals";
import {
  deleteCommentHandler,
  getAllCommentsHandler, getBlogPostHandler,
  getCommentByAuthorHandler,
  getCommentHandler, postCommentHandler, putCommentHandler
} from "../commentController.ts";
import {CommentRepository} from "../../database/repository/commentRepository.ts";
import {Comment, comments} from "../../database/schema/comments.ts";
import {createMockContext} from "./utils/mockContext.ts";

const db = new Map();

const mockCommentRepository: CommentRepository = {
  pool: {} as any,
  findById: async (id: number): Promise<any> => db.get(id),
  findAll: async (): Promise<any> => Array.from(db.values()),
  findAllByAuthor: async (author: string): Promise<any> => Array.from(db.values()).filter((c) => c.author === author),
  findAllCommentsByBlogId: async (id: number): Promise<any> => Array.from(db.values()).filter((c) => c.blogPost.id === id),
  create: async (
      data: Extract<Comment, typeof comments.$inferInsert>
  ): Promise<any> => {
    const newId = Math.max(...Array.from(db.keys()), 0) + 1;
    const newComment: any = {
      id: newId,
      content: data.content,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: "user1",
      blogPostId: data.blogPostId,
      parentCommentId: data.parentCommentId || null,
      blogPost: { id: data.blogPostId },
      parentComment: data.parentCommentId
          ? db.get(data.parentCommentId) || null
          : null,
    };
    db.set(newId, newComment);
    return newComment;
  },
  updateById: async (
      id: number,
      data: Extract<Comment, typeof comments.$inferInsert>
  ): Promise<any> => {
    const comment = db.get(id);
    if (!comment) return undefined;
    comment.content = data.content;
    comment.updatedAt = new Date();
    db.set(id, comment);
    return comment;
  },
  deleteById: async (id: number): Promise<any> => {
    if (db.has(id)) {
      db.delete(id);
      return { rowCount: 1 };
    }
    return { rowCount: 0 };
  },
};

Deno.test("getCommentHandler", async (t) => {
  await t.step("returns comment when ID is valid", async () => {
    db.clear();
    mockCommentRepository.create({
      id: 1,
      content: "Test comment",
      createdAt: new Date(),
      author: "user1",
      blogPostId: 1,
      parentCommentId: null,
    })
    const mockContext = createMockContext({ params: { id: "1" } });
    const result = await getCommentHandler(mockContext, mockCommentRepository);
    const json = await result.json();
    assertEquals(result.status, 200);
    assertEquals(json.id, 1);
    assertEquals(json.content, "Test comment");
    assertEquals(json.author, "user1");
  });

  await t.step("returns 400 when ID is not a number", async () => {
    db.clear();
    const mockContext = createMockContext({ params: { id: "abc" } });
    const result = await getCommentHandler(mockContext, mockCommentRepository);
    const json = await result.json();
    assertEquals(result.status, 400);
    assertEquals(json.error, "Nieprawidłowy identyfikator komentarza");
  });

  await t.step("returns 404 when comment is not found", async () => {
    db.clear();
    const mockContext = createMockContext({ params: { id: "999" } });
    const result = await getCommentHandler(mockContext, mockCommentRepository);
    const json = await result.json();
    assertEquals(result.status, 404);
    assertEquals(json.error, "Nie znaleziono komentarza");
  });
});

Deno.test("getAllCommentsHandler", async (t) => {
  await t.step("returns all comments when available", async () => {
    db.clear();
    mockCommentRepository.create({
      id: 1,
      content: "Test comment",
      createdAt: new Date(),
      author: "user1",
      blogPostId: 1,
      parentCommentId: null,
    })
    const mockContext = createMockContext();
    const result = await getAllCommentsHandler(mockContext, mockCommentRepository);
    const json = await result.json();
    assertEquals(result.status, 200);
    assertEquals(json.length, 1);
    assertEquals(json[0].id, 1);
    assertEquals(json[0].content, "Test comment");
  });
});

Deno.test("getCommentByAuthorHandler", async (t) => {
  await t.step("returns comments by author", async () => {
    db.clear();
    mockCommentRepository.create({
      id: 1,
      content: "Test comment",
      createdAt: new Date(),
      author: "user1",
      blogPostId: 1,
      parentCommentId: null,
    })
    const mockContext = createMockContext({ params: { author: "user1" } });
    const result = await getCommentByAuthorHandler(mockContext, mockCommentRepository);
    const json = await result.json();
    assertEquals(result.status, 200);
    assertEquals(json.length, 1);
    assertEquals(json[0].author, "user1");
  });

  await t.step("returns 400 when author is not provided", async () => {
    db.clear();
    const mockContext = createMockContext({ params: {} });
    const result = await getCommentByAuthorHandler(mockContext, mockCommentRepository);
    const json = await result.json();
    assertEquals(result.status, 400);
    assertEquals(json.error, "Nie podano autora");
  });
});

Deno.test("getBlogPostHandler", async (t) => {
  await t.step("returns comments for blog post", async () => {
    db.clear();
    mockCommentRepository.create({
      id: 1,
      content: "Test comment",
      createdAt: new Date(),
      author: "user1",
      blogPostId: 1,
      parentCommentId: null,
    })
    const mockContext = createMockContext({ params: { id: "1" } });
    const result = await getBlogPostHandler(mockContext, mockCommentRepository);
    const json = await result.json();
    assertEquals(result.status, 200);
    assertEquals(json.length, 1);
    assertEquals(json[0].blogPost.id, 1);
  });

  await t.step("returns 400 when ID is not a number", async () => {
    db.clear();
    const mockContext = createMockContext({ params: { id: "abc" } });
    const result = await getBlogPostHandler(mockContext, mockCommentRepository);
    const json = await result.json();
    assertEquals(result.status, 400);
    assertEquals(json.error, "Nieprawidłowy identyfikator posta");
  });
});

Deno.test("postCommentHandler", async (t) => {
  await t.step("creates comment with valid data and JWT", async () => {
    db.clear();
    const mockContext = createMockContext({
      method: "POST",
      body: { content: "New comment", blogPostId: 1 },
      jwtPayload: { sub: "user1" },
    });
    const result = await postCommentHandler(mockContext, mockCommentRepository);
    const json = await result.json();
    assertEquals(result.status, 200);
    assertEquals(json.content, "New comment");
    assertEquals(json.author, "user1");
    assertEquals(json.blogPost.id, 1);
    assertEquals(db.size, 1);
  });

  await t.step("returns 400 when content is missing", async () => {
    db.clear();
    const mockContext = createMockContext({
      method: "POST",
      body: { blogPostId: 1 },
      jwtPayload: { sub: "user1" },
    });
    const result = await postCommentHandler(mockContext, mockCommentRepository);
    const json = await result.json();
    assertEquals(result.status, 400);
    assertEquals(json.error, "Brakuje treści komentarza lub ID posta");
  });
});

Deno.test("putCommentHandler", async (t) => {
  await t.step("returns 403 if user is not author", async () => {
    db.clear();
    mockCommentRepository.create({
      id: 1,
      content: "Test comment",
      createdAt: new Date(),
      author: "user1",
      blogPostId: 1,
      parentCommentId: null,
    })
    const mockContext = createMockContext({
      method: "PUT",
      body: { id: 1, content: "Updated comment" },
      jwtPayload: { sub: "user2" },
    });
    const result = await putCommentHandler(mockContext, mockCommentRepository);
    const json = await result.json();
    assertEquals(result.status, 403);
    assertEquals(json.error, "Brak wymaganych uprawnień do edycji komentarza");
  });

  await t.step("returns 400 when ID is missing", async () => {
    db.clear();
    const mockContext = createMockContext({
      method: "PUT",
      body: { content: "Updated comment" },
      jwtPayload: { sub: "user1" },
    });
    const result = await putCommentHandler(mockContext, mockCommentRepository);
    const json = await result.json();
    assertEquals(result.status, 400);
    assertEquals(json.error, "Brak ID lub treści komentarza");
  });

  await t.step("returns 404 when comment not found", async () => {
    db.clear();
    mockCommentRepository.create({
      id: 1,
      content: "Test comment",
      createdAt: new Date(),
      author: "user1",
      blogPostId: 1,
      parentCommentId: null,
    })
    const mockContext = createMockContext({
      method: "PUT",
      body: { id: 999, content: "Updated comment" },
      jwtPayload: { sub: "user1" },
    });
    const result = await putCommentHandler(mockContext, mockCommentRepository);
    const json = await result.json();
    assertEquals(result.status, 404);
    assertEquals(json.error, "Nie znaleziono komentarza");
  });
});

Deno.test("deleteCommentHandler", async (t) => {
  await t.step("returns 403 if user is not author", async () => {
    db.clear();
    mockCommentRepository.create({
      id: 1,
      content: "Test comment",
      createdAt: new Date(),
      author: "user1",
      blogPostId: 1,
      parentCommentId: null,
    })
    const mockContext = createMockContext({
      params: { id: "1" },
      jwtPayload: { sub: "user2" },
    });
    const result = await deleteCommentHandler(mockContext, mockCommentRepository);
    const json = await result.json();
    assertEquals(result.status, 403);
    assertEquals(json.error, "Brak wymaganych uprawnień do usunięcia komentarza");
  });

  await t.step("returns 400 when ID is not a number", async () => {
    db.clear();
    const mockContext = createMockContext({
      params: { id: "abc" },
      jwtPayload: { sub: "user1" },
    });
    const result = await deleteCommentHandler(mockContext, mockCommentRepository);
    const json = await result.json();
    assertEquals(result.status, 400);
    assertEquals(json.error, "Nieprawidłowy identyfikator komentarza");
  });

  await t.step("returns 404 when comment not found", async () => {
    db.clear();
    mockCommentRepository.create({
      id: 1,
      content: "Test comment",
      createdAt: new Date(),
      author: "user1",
      blogPostId: 1,
      parentCommentId: null,
    })
    const mockContext = createMockContext({
      params: { id: "999" },
      jwtPayload: { sub: "user1" },
    });
    const result = await deleteCommentHandler(mockContext, mockCommentRepository);
    const json = await result.json();
    assertEquals(result.status, 404);
    assertEquals(json.error, "Nie znaleziono komentarza do usunięcia");
  });
});
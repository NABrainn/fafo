// commentControllerTest.ts
import { assertEquals } from "https://deno.land/std@0.204.0/assert/mod.ts";
import { Hono } from "hono";
import { createCommentController } from "../commentController.ts";

// Minimalny interfejs bez typu CommentRepository
const mockRepo = {
  findById: async (id: number) => id === 1 ? {
    id: 1,
    content: "Test Comment",
    createdAt: new Date(),
    author: "Tester"
  } : null,
  findAll: async () => [{
    id: 1,
    content: "Test Comment",
    createdAt: new Date(),
    author: "Tester"
  }],
  create: async (data: any) => ({
    id: 2,
    ...data,
    createdAt: new Date(),
    author: data.author ?? "Tester"
  }),
  updateById: async (id: number, data: any) => ({
    id,
    ...data,
    createdAt: new Date(),
    author: data.author ?? "Updated"
  }),
  deleteById: async (id: number) => ({ rowCount: id === 1 ? 1 : 0 }),
};

// Typ "as any" pozwala pominąć niezgodność typów z CommentRepository
const app = new Hono().route("/comments", createCommentController(mockRepo as any));

Deno.test("GET /:id - returns 404 if not found", async () => {
  const res = await app.request("/comments/999");
  assertEquals(res.status, 404);
});

Deno.test("GET /:id - returns comment if found", async () => {
  const res = await app.request("/comments/1");
  const json = await res.json();
  assertEquals(res.status, 200);
  assertEquals(json.content, "Test Comment");
});

Deno.test("GET / - returns all comments", async () => {
  const res = await app.request("/comments");
  const json = await res.json();
  assertEquals(Array.isArray(json), true);
  assertEquals(json.length, 1);
});

Deno.test("POST / - creates a comment", async () => {
  const res = await app.request("/comments", {
    method: "POST",
    body: JSON.stringify({ content: "Nowy Komentarz" }),
  });
  const json = await res.json();
  assertEquals(res.status, 200);
  assertEquals(json.content, "Nowy Komentarz");
});

Deno.test("PUT /:id - updates a comment", async () => {
  const res = await app.request("/comments/1", {
    method: "PUT",
    body: JSON.stringify({ id: 1, content: "Zmieniony Komentarz" }),
  });
  const json = await res.json();
  assertEquals(res.status, 200);
  assertEquals(json.content, "Zmieniony Komentarz");
});

Deno.test("DELETE /:id - deletes a comment", async () => {
  const res = await app.request("/comments/1", {
    method: "DELETE",
    body: JSON.stringify({ id: 1 }),
  });
  const json = await res.json();
  assertEquals(res.status, 200);
  assertEquals(json.rowCount, 1);
});

export {};
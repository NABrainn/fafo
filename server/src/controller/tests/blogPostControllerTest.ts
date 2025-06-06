import { assertEquals } from "https://deno.land/std@0.204.0/assert/mod.ts";
import { Hono } from "hono";
import { createBlogPostController } from "../blogPostController.ts";

const mockRepo = {
  findById: async (id: number) => id === 1 ? {
    id: 1,
    title: "Test Post",
    subtitle: "Sub",
    createdAt: new Date(),
    imgUrl: "http://img",
    author: "Author"
  } : null,
  findAll: async () => [{
    id: 1,
    title: "Test Post",
    subtitle: "Sub",
    createdAt: new Date(),
    imgUrl: "http://img",
    author: "Author"
  }],
  create: async (data: any) => ({
    id: 2,
    ...data,
    subtitle: data.subtitle ?? "Sub",
    createdAt: new Date(),
    imgUrl: data.imgUrl ?? "http://img",
    author: data.author ?? "Author"
  }),
  updateById: async (id: number, data: any) => ({
    id,
    ...data,
    subtitle: data.subtitle ?? "Updated Sub",
    createdAt: new Date(),
    imgUrl: data.imgUrl ?? "http://updated-img",
    author: data.author ?? "Updated Author"
  }),
  deleteById: async (id: number) => ({ rowCount: id === 1 ? 1 : 0 }),
};

const app = new Hono().route("/posts", createBlogPostController(mockRepo));

Deno.test("GET /:id - returns 404 if not found", async () => {
  const res = await app.request("/posts/999");
  assertEquals(res.status, 404);
});

Deno.test("GET /:id - returns blog post if found", async () => {
  const res = await app.request("/posts/1");
  const json = await res.json();
  console.log("JSON response:", json);
  assertEquals(res.status, 200);
  assertEquals(json.title, "Test Post");
});

Deno.test("GET / - returns all blog posts", async () => {
  const res = await app.request("/posts");
  const json = await res.json();
  assertEquals(Array.isArray(json), true);
  assertEquals(json.length, 1);
});

Deno.test("POST / - creates a blog post", async () => {
  const res = await app.request("/posts", {
    method: "POST",
    body: JSON.stringify({ title: "Nowy Post" }),
  });
  const json = await res.json();
  assertEquals(res.status, 200);
  assertEquals(json.title, "Nowy Post");
});

Deno.test("PUT /:id - updates a blog post", async () => {
  const res = await app.request("/posts/1", {
    method: "PUT",
    body: JSON.stringify({ id: 1, title: "Zmieniony" }),
  });
  const json = await res.json();
  assertEquals(res.status, 200);
  assertEquals(json.title, "Zmieniony");
});

Deno.test("DELETE /:id - deletes a blog post", async () => {
  const res = await app.request("/posts/1", {
    method: "DELETE",
    body: JSON.stringify({ id: 1 }),
  });
  const json = await res.json();
  assertEquals(res.status, 200);
  assertEquals(json.rowCount, 1);
});

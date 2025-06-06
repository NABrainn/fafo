import { assertEquals } from "@std/assert/equals";
import {blogPostController} from "../blogPostController.ts";

Deno.test("GET /:id - returns 404 if not found", async () => {
  const res = await blogPostController.request("/posts/999");
  assertEquals(res.status, 404);
});

Deno.test("GET /:id - returns blog post if found", async () => {
  const res = await blogPostController.request("/posts/1");
  const json = await res.json();
  console.log("JSON response:", json);
  assertEquals(res.status, 200);
  assertEquals(json.title, "Test Post");
});

Deno.test("GET / - returns all blog posts", async () => {
  const res = await blogPostController.request("/posts");
  const json = await res.json();
  assertEquals(Array.isArray(json), true);
  assertEquals(json.length, 1);
});

Deno.test("POST / - creates a blog post", async () => {
  const res = await blogPostController.request("/posts", {
    method: "POST",
    body: JSON.stringify({ title: "Nowy Post" }),
  });
  const json = await res.json();
  assertEquals(res.status, 200);
  assertEquals(json.title, "Nowy Post");
});

Deno.test("PUT /:id - updates a blog post", async () => {
  const res = await blogPostController.request("/posts/1", {
    method: "PUT",
    body: JSON.stringify({ id: 1, title: "Zmieniony" }),
  });
  const json = await res.json();
  assertEquals(res.status, 200);
  assertEquals(json.title, "Zmieniony");
});

Deno.test("DELETE /:id - deletes a blog post", async () => {
  const res = await blogPostController.request("/posts/1", {
    method: "DELETE",
    body: JSON.stringify({ id: 1 }),
  });
  const json = await res.json();
  assertEquals(res.status, 200);
  assertEquals(json.rowCount, 1);
});

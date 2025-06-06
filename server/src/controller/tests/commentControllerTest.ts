import { assertEquals } from "@std/assert/equals";
import {commentController} from "../commentController.ts";

Deno.test("GET /:id - returns 404 if not found", async () => {
  const res = await commentController.request("/comments/999");
  assertEquals(res.status, 404);
});

Deno.test("GET /:id - returns comment if found", async () => {
  const res = await commentController.request("/comments/1");
  const json = await res.json();
  assertEquals(res.status, 200);
  assertEquals(json.content, "Test Comment");
});

Deno.test("GET / - returns all comments", async () => {
  const res = await commentController.request("/comments");
  const json = await res.json();
  assertEquals(Array.isArray(json), true);
  assertEquals(json.length, 1);
});

Deno.test("POST / - creates a comment", async () => {
  const res = await commentController.request("/comments", {
    method: "POST",
    body: JSON.stringify({ content: "Nowy Komentarz" }),
  });
  const json = await res.json();
  assertEquals(res.status, 200);
  assertEquals(json.content, "Nowy Komentarz");
});

Deno.test("PUT /:id - updates a comment", async () => {
  const res = await commentController.request("/comments/1", {
    method: "PUT",
    body: JSON.stringify({ id: 1, content: "Zmieniony Komentarz" }),
  });
  const json = await res.json();
  assertEquals(res.status, 200);
  assertEquals(json.content, "Zmieniony Komentarz");
});

Deno.test("DELETE /:id - deletes a comment", async () => {
  const res = await commentController.request("/comments/1", {
    method: "DELETE",
    body: JSON.stringify({ id: 1 }),
  });
  const json = await res.json();
  assertEquals(res.status, 200);
  assertEquals(json.rowCount, 1);
});
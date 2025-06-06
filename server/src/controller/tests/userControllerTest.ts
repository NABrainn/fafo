import { assertEquals } from "@std/assert";
import { Hono } from "hono";

const mockRepo = {
  findById: async (id: number) => id === 1 ? {
    id: 1,
    username: "tester",
    email: "tester@example.com",
    createdAt: new Date()
  } : null,
  findAll: async () => [{
    id: 1,
    username: "tester",
    email: "tester@example.com",
    createdAt: new Date()
  }],
  create: async (data: any) => ({
    id: 2,
    ...data,
    createdAt: new Date()
  }),
  updateById: async (id: number, data: any) => ({
    id,
    ...data,
    createdAt: new Date()
  }),
  deleteById: async (id: number) => ({ rowCount: id === 1 ? 1 : 0 }),
};

const testApp = new Hono();

testApp.get("/users/:id", async (c) => {
  const id = c.req.param('id');
  const user = await mockRepo.findById(parseFloat(id));
  return user ? c.json(user) : c.json({ error: "Nie znaleziono użytkownika" }, 404);
});
testApp.get("/users", async (c) => {
  const users = await mockRepo.findAll();
  return users ? c.json(users, 200) : c.json({ error: "Nie znaleziono użytkownika" }, 404);
});
testApp.post("/users", async (c) => {
  const body = await c.req.json();
  const user = await mockRepo.create(body);
  return user ? c.json(user, 200) : c.json({ error: "Nie udało się utworzyć użytkownika" }, 404);
});
testApp.put("/users/:id", async (c) => {
  const body = await c.req.json();
  const user = await mockRepo.updateById(body.id, body);
  return user ? c.json(user, 200) : c.json({ error: "Nie znaleziono użytkownika" }, 404);
});
testApp.delete("/users/:id", async (c) => {
  const body = await c.req.json();
  const result = await mockRepo.deleteById(body.id);
  return result.rowCount > 0 ? c.json(result, 200) : c.json({ error: "Nie znaleziono użytkownika" }, 404);
});

Deno.test("GET /users/:id - not found", async () => {
  const res = await testApp.request("/users/999");
  assertEquals(res.status, 404);
});

Deno.test("GET /users/:id - found", async () => {
  const res = await testApp.request("/users/1");
  const json = await res.json();
  assertEquals(res.status, 200);
  assertEquals(json.username, "tester");
});

Deno.test("GET /users - all users", async () => {
  const res = await testApp.request("/users");
  const json = await res.json();
  assertEquals(res.status, 200);
  assertEquals(Array.isArray(json), true);
});

Deno.test("POST /users - create user", async () => {
  const res = await testApp.request("/users", {
    method: "POST",
    body: JSON.stringify({ username: "nowy", email: "nowy@example.com" }),
  });
  const json = await res.json();
  assertEquals(res.status, 200);
  assertEquals(json.username, "nowy");
});

Deno.test("PUT /users/:id - update user", async () => {
  const res = await testApp.request("/users/1", {
    method: "PUT",
    body: JSON.stringify({ id: 1, username: "zmieniony" }),
  });
  const json = await res.json();
  assertEquals(res.status, 200);
  assertEquals(json.username, "zmieniony");
});

Deno.test("DELETE /users/:id - delete user", async () => {
  const res = await testApp.request("/users/1", {
    method: "DELETE",
    body: JSON.stringify({ id: 1 }),
  });
  const json = await res.json();
  assertEquals(res.status, 200);
  assertEquals(json.rowCount, 1);
});

export {};

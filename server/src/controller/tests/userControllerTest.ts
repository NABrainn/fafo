import { assertEquals } from "@std/assert";
import {userController} from "../userController.ts";

Deno.test("GET /users/:id - not found", async () => {
  const res = await userController.request("/users/999");
  assertEquals(res.status, 404);
});

Deno.test("GET /users/:id - found", async () => {
  const res = await userController.request("/users/1");
  const json = await res.json();
  assertEquals(res.status, 200);
  assertEquals(json.username, "tester");
});

Deno.test("GET /users - all users", async () => {
  const res = await userController.request("/users");
  const json = await res.json();
  assertEquals(res.status, 200);
  assertEquals(Array.isArray(json), true);
});

Deno.test("POST /users - create user", async () => {
  const res = await userController.request("/users", {
    method: "POST",
    body: JSON.stringify({ username: "nowy", email: "nowy@example.com" }),
  });
  const json = await res.json();
  assertEquals(res.status, 200);
  assertEquals(json.username, "nowy");
});

Deno.test("PUT /users/:id - update user", async () => {
  const res = await userController.request("/users/1", {
    method: "PUT",
    body: JSON.stringify({ id: 1, username: "zmieniony" }),
  });
  const json = await res.json();
  assertEquals(res.status, 200);
  assertEquals(json.username, "zmieniony");
});

Deno.test("DELETE /users/:id - delete user", async () => {
  const res = await userController.request("/users/1", {
    method: "DELETE",
    body: JSON.stringify({ id: 1 }),
  });
  const json = await res.json();
  assertEquals(res.status, 200);
  assertEquals(json.rowCount, 1);
});
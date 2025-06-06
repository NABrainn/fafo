import { assertEquals } from "@std/assert/equals";
import {authController} from "../authController.ts";

Deno.test("register – duplikat username", async () => {
  const req = new Request("http://localhost:8000/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "existingUser",
      email: "new@example.com",
      password: "password123",
    }),
  });

  const res = await authController.request(req);
  assertEquals(res.status, 409);
  assertEquals(await res.text(), '"Wprowadź inną nazwę użytkownika"');
});

Deno.test("register – duplikat email", async () => {
  const req = new Request("http://localhost:8000/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "newUser",
      email: "used@example.com",
      password: "password123",
    }),
  });

  const res = await authController.request(req);
  assertEquals(res.status, 409);
  assertEquals(await res.text(), '"Wprowadź inny email"');
});

Deno.test("register – sukces", async () => {
  const req = new Request("http://localhost:8000/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "newUser",
      email: "new@example.com",
      password: "password123",
    }),
  });

  const res = await authController.request(req);
  const json = await res.json();
  assertEquals(res.status, 201);
  assertEquals(json.username, "newUser");
});

Deno.test("login – nieistniejący user", async () => {
  const req = new Request("http://localhost:8000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "unknownUser",
      password: "password123",
    }),
  });

  const res = await authController.request(req);
  assertEquals(res.status, 401);
  assertEquals(await res.text(), '"Niepoprawny email/hasło"');
});

Deno.test("login – zły password", async () => {
  const req = new Request("http://localhost:8000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "existingUser",
      password: "wrongPassword",
    }),
  });

  const res = await authController.request(req);
  assertEquals(res.status, 401);
  assertEquals(await res.text(), '"Niepoprawny email/hasło"');
});

Deno.test("login – sukces", async () => {
  const req = new Request("http://localhost:8000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "existingUser",
      password: "password123",
    }),
  });

  const res = await authController.request(req);
  const json = await res.json();
  assertEquals(res.status, 200);
});

Deno.test("verify – brak tokenu", async () => {
  const req = new Request("http://localhost:8000/verify", {
    method: "POST",
  });

  const res = await authController.request(req);
  assertEquals(res.status, 401);
  assertEquals(await res.text(), '"Brak tokenu"');
});

Deno.test("verify – niepoprawny token", async () => {
  const req = new Request("http://localhost:8000/verify", {
    method: "POST",
    headers: { Authorization: "Bearer wrong.token" },
  });

  const res = await authController.request(req);
  assertEquals(res.status, 401);
  assertEquals(await res.text(), '"Niepoprawny token"');
});


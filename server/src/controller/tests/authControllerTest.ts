import { assertEquals } from "https://deno.land/std@0.204.0/testing/asserts.ts";
import { Hono } from "hono";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

const fakeToken = "fake.jwt.token";

const fakeUserRepo = {
  findByUsername: async (username: string) => {
    if (username === "existingUser") {
      return {
        username,
        email: "test@example.com",
        password: await bcrypt.hash("password123"),
      };
    }
    return null;
  },
  findByEmail: async (email: string) => {
    if (email === "used@example.com") {
      return { email };
    }
    return null;
  },
  create: async (data: any) => ({ id: 1, ...data }),
};

const generateJWT = async () => fakeToken;
const verifyJWT = async (token: string) =>
  token === fakeToken ? { username: "X", email: "test@example.com" } : null;

const authController = new Hono();

authController.post("/register", async (c) => {
  const body = await c.req.json();
  const { username, email, password } = body;
  const existingUsername = await fakeUserRepo.findByUsername(username);
  if (existingUsername) {
    return c.json("Wprowadź inną nazwę użytkownika", 409);
  }

  const existingEmail = await fakeUserRepo.findByEmail(email);
  if (existingEmail) {
    return c.json("Wprowadź inny email", 409);
  }

  const newUser = await fakeUserRepo.create({ username, email, password });
  return c.json(newUser, 201);
});

authController.post("/login", async (c) => {
  const body = await c.req.json();
  const { username, password } = body;

  const user = await fakeUserRepo.findByUsername(username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return c.json("Niepoprawny email/hasło", 401);
  }

  const token = await generateJWT();
  return c.json({ token }, 200);
});

authController.post("/verify", async (c) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) return c.json("Brak tokenu", 401);
  const token = authHeader.split(" ")[1];
  const payload = await verifyJWT(token);
  if (!payload) return c.json("Niepoprawny token", 401);
  return c.json(200);
});

const app = new Hono();
app.route("/", authController);


Deno.test("register – duplikat username", async () => {
  const req = new Request("http://localhost/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "existingUser",
      email: "new@example.com",
      password: "password123",
    }),
  });

  const res = await app.fetch(req);
  assertEquals(res.status, 409);
  assertEquals(await res.text(), '"Wprowadź inną nazwę użytkownika"');
});

Deno.test("register – duplikat email", async () => {
  const req = new Request("http://localhost/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "newUser",
      email: "used@example.com",
      password: "password123",
    }),
  });

  const res = await app.fetch(req);
  assertEquals(res.status, 409);
  assertEquals(await res.text(), '"Wprowadź inny email"');
});

Deno.test("register – sukces", async () => {
  const req = new Request("http://localhost/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "newUser",
      email: "new@example.com",
      password: "password123",
    }),
  });

  const res = await app.fetch(req);
  const json = await res.json();
  assertEquals(res.status, 201);
  assertEquals(json.username, "newUser");
});

Deno.test("login – nieistniejący user", async () => {
  const req = new Request("http://localhost/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "unknownUser",
      password: "password123",
    }),
  });

  const res = await app.fetch(req);
  assertEquals(res.status, 401);
  assertEquals(await res.text(), '"Niepoprawny email/hasło"');
});

Deno.test("login – zły password", async () => {
  const req = new Request("http://localhost/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "existingUser",
      password: "wrongPassword",
    }),
  });

  const res = await app.fetch(req);
  assertEquals(res.status, 401);
  assertEquals(await res.text(), '"Niepoprawny email/hasło"');
});

Deno.test("login – sukces", async () => {
  const req = new Request("http://localhost/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "existingUser",
      password: "password123",
    }),
  });

  const res = await app.fetch(req);
  const json = await res.json();
  assertEquals(res.status, 200);
  assertEquals(json.token, fakeToken);
});

Deno.test("verify – brak tokenu", async () => {
  const req = new Request("http://localhost/verify", {
    method: "POST",
  });

  const res = await app.fetch(req);
  assertEquals(res.status, 401);
  assertEquals(await res.text(), '"Brak tokenu"');
});

Deno.test("verify – niepoprawny token", async () => {
  const req = new Request("http://localhost/verify", {
    method: "POST",
    headers: { Authorization: "Bearer wrong.token" },
  });

  const res = await app.fetch(req);
  assertEquals(res.status, 401);
  assertEquals(await res.text(), '"Niepoprawny token"');
});

Deno.test("verify – sukces", async () => {
  const req = new Request("http://localhost/verify", {
    method: "POST",
    headers: { Authorization: `Bearer ${fakeToken}` },
  });

  const res = await app.fetch(req);
  const json = await res.json();
  assertEquals(res.status, 200);
  assertEquals(json, 200);
});

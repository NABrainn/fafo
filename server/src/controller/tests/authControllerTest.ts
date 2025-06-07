import { assertEquals } from "@std/assert/equals";
import {createAuthController} from "../authController.ts";
import {User} from "../../database/schema/users.ts";
import {hashPassword} from "../../util/cryptoUtil.ts";

const db = new Map();
const mockUserRepository = {
  pool: {} as any,
  findById: async (id: number): Promise<any> => undefined,
  findByUsername: async (username: string): Promise<any> => db.get(username),
  findByEmail: async (email: string): Promise<any> => db.get(email),
  findAll: async (): Promise<any[]> => [],
  create: async (data: { username: string; email: string; password: string }): Promise<any> => {
    const hashedPassword = await hashPassword(data.password);
    const user =  {
      id: 1,
      username: data.username,
      email: data.email,
      password: hashedPassword,
      verified: false,
      comments: [],
      blogPosts: [],
    } as User;
    db.set(user.username, user)
    db.set(user.email, user)
  },
  updateById: async (id: number, data: any): Promise<any> => ({} as User),
  deleteById: async (id: number): Promise<any> => {},
  verifyUser: async (id: number): Promise<any> => ({} as User),
};


Deno.test("register – duplikat username", async () => {
  const authController = createAuthController(mockUserRepository);
  await mockUserRepository.create({
    username: "existingUser",
    email: "example@email.com",
    password: "password123",
  });
  const req = new Request("http://localhost:8000/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "existingUser",
      email: "new@example.com",
      password: "password123",
    }),
  });

  const res = await authController.fetch(req);
  assertEquals(res.status, 409);
  assertEquals(await res.json(), "Wprowadź inną nazwę użytkownika");
  db.clear()
});

Deno.test("register – duplikat email", async () => {
  const authController = createAuthController(mockUserRepository);
  await mockUserRepository.create({
    username: "existingUser",
    email: "example@email.com",
    password: "password123",
  });
  const req = new Request("http://localhost:8000/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "newUser",
      email: "example@email.com",
      password: "password123",
    }),
  });

  const res = await authController.fetch(req);
  assertEquals(res.status, 409);
  assertEquals(await res.json(), "Wprowadź inny adres email");
  db.clear()
});


Deno.test("register – sukces", async () => {
  const authController = createAuthController(mockUserRepository);
  const req = new Request("http://localhost:8000/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "newUser",
      email: "new@example.com",
      password: "password123",
    }),
  });

  const res = await authController.fetch(req);
  assertEquals(res.status, 201);
  db.clear()
});

Deno.test("login – nieistniejący user", async () => {
  const authController = createAuthController(mockUserRepository);

  const req = new Request("http://localhost:8000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "unknownUser",
      password: "password123",
    }),
  });

  const res = await authController.fetch(req);
  assertEquals(res.status, 404);
  db.clear()
});

Deno.test("login – zły password", async () => {
  const authController = createAuthController(mockUserRepository);

  const reqBody = {
    username: "existingUser",
    password: "password123"
  }
  await mockUserRepository.create({
    username: "existingUser",
    email: "example@email.com",
    password: "1234",
  });
  const req = new Request("http://localhost:8000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reqBody)
  });

  const res = await authController.fetch(req);
  assertEquals(res.status, 401);
  assertEquals(await res.json(), 'Niepoprawny email/hasło');
  db.clear()
});

Deno.test("login – sukces", async () => {
  const authController = createAuthController(mockUserRepository);
  const reqBody = {
    username: "existingUser",
    password: "password123"
  }
  const req = new Request("http://localhost:8000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reqBody)
  });

  await mockUserRepository.create({...reqBody, email: "example@email.com"})

  const res = await authController.request(req);

  assertEquals(res.status, 200);
  db.clear()
});

Deno.test("verify – brak tokenu", async () => {
  const authController = createAuthController(mockUserRepository);

  const req = new Request("http://localhost:8000/verify", {
    method: "POST",
  });

  const res = await authController.request(req);
  assertEquals(res.status, 401);
  assertEquals(await res.json(), "Brak tokenu");
  db.clear()
});

Deno.test("verify – niepoprawny token", async () => {
  const authController = createAuthController(mockUserRepository);

  const req = new Request("http://localhost:8000/verify", {
    method: "POST",
    headers: {
        "Cookie": "jwt=hyhyhy"
    }
  });

  const res = await authController.request(req);
  assertEquals(res.status, 401);
  assertEquals(await res.json(), "Niepoprawny token");
  db.clear()
});


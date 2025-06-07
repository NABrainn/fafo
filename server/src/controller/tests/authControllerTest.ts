import { assertEquals } from "@std/assert/equals";
import {User} from "../../database/schema/users.ts";
import {hashPassword, verifyPassword} from "../../util/cryptoUtil.ts";
import {loginHandler, registerHandler, verifyHandler} from "../authController.ts";
import {createMockContext} from "./utils/mockContext.ts";
import {generateJWT} from "../../util/jwtUtil.ts";
import {UserRepository} from "../../database/repository/userRepository.ts";

const db = new Map();

let mockJwtToken = "";
const mockJwtPayload = { sub: "" };
const mockGenerateJWT = async (username: string) => {
  mockJwtToken = `jwt-${username}`;
  mockJwtPayload.sub = username;
  return mockJwtToken;
};
const mockVerifyJWT = async (token: string) => {
  if (token === mockJwtToken) return mockJwtPayload;
  throw new Error("Invalid token");
};
const mockVerifyPassword = async (password: string, hashedPassword: string) => {
  return password === "correctPassword"; // Simulate password check
};

const mockUserRepository: UserRepository = {
  pool: {} as any,
  findById: async (_id: number): Promise<any> => undefined,
  findByUsername: async (username: string): Promise<any> => db.get(username),
  findByEmail: async (email: string): Promise<any> => db.get(email),
  findAll: async (): Promise<any[]> => [],
  create: async (data: { username: string; email: string; password: string }): Promise<any> => {
    const hashedPassword = await hashPassword(data.password);
    const user = {
      id: Math.max(...Array.from(db.values(), (u: any) => u.id || 0), 0) + 1,
      username: data.username,
      email: data.email,
      password: hashedPassword,
      verified: false,
      comments: [],
      blogPosts: [],
    } as User;
    db.set(user.username, user);
    db.set(user.email, user);
    return user;
  },
  updateById: async (_id: number, _data: any): Promise<any> => ({} as User),
  deleteById: async (_id: number): Promise<any> => ({}),
  verifyUser: async (_id: number): Promise<any> => ({} as User),
};

Deno.test("authController", async (t) => {
  await t.step("registerHandler - fails with missing data", async () => {
    db.clear();
    const mockContext = createMockContext({
      method: "POST",
      body: { username: "newUser", email: "new@example.com" }, // Missing password
    });
    const result = await registerHandler(mockContext, mockUserRepository);
    const json = await result.json();
    assertEquals(result.status, 400);
    assertEquals(json.error, "Brak wymaganych danych");
  });

  await t.step("registerHandler - fails with duplicate username", async () => {
    db.clear();
    await mockUserRepository.create({
      username: "existingUser",
      email: "example@email.com",
      password: "password123",
    });
    const mockContext = createMockContext({
      method: "POST",
      body: {
        username: "existingUser",
        email: "new@example.com",
        password: "password123",
      },
    });
    const result = await registerHandler(mockContext, mockUserRepository);
    const json = await result.json();
    assertEquals(result.status, 409);
    assertEquals(json, "Wprowadź inną nazwę użytkownika");
  });

  await t.step("registerHandler - fails with duplicate email", async () => {
    db.clear();
    await mockUserRepository.create({
      username: "existingUser",
      email: "example@email.com",
      password: "password123",
    });
    const mockContext = createMockContext({
      method: "POST",
      body: {
        username: "newUser",
        email: "example@email.com",
        password: "password123",
      },
    });
    const result = await registerHandler(mockContext, mockUserRepository);
    const json = await result.json();
    assertEquals(result.status, 409);
    assertEquals(json, "Wprowadź inny adres email");
  });

  await t.step("registerHandler - succeeds with valid data", async () => {
    db.clear();
    const mockContext = createMockContext({
      method: "POST",
      body: {
        username: "newUser",
        email: "new@example.com",
        password: "password123",
      },
    });
    const result = await registerHandler(mockContext, mockUserRepository);
    const json = await result.json();
    assertEquals(result.status, 201);
    assertEquals(json.username, "newUser");
    assertEquals(json.email, "new@example.com");
    assertEquals(db.get("newUser").username, "newUser");
    assertEquals(db.get("new@example.com").email, "new@example.com");
  });

  await t.step("loginHandler - fails with missing username or password", async () => {
    db.clear();
    const mockContext = createMockContext({
      method: "POST",
      body: { username: "existingUser" }, // Missing password
    });
    const result = await loginHandler(mockContext, mockUserRepository);
    const json = await result.json();
    assertEquals(result.status, 400);
    assertEquals(json.error, "Brak loginu lub hasła");
  });

  await t.step("loginHandler - fails with non-existing user", async () => {
    db.clear();
    const mockContext = createMockContext({
      method: "POST",
      body: {
        username: "unknownUser",
        password: "password123",
      },
    });
    const result = await loginHandler(mockContext, mockUserRepository);
    const json = await result.json();
    assertEquals(result.status, 404);
    assertEquals(json, "Podany login nie istnieje");
  });

  await t.step("loginHandler - fails with incorrect password", async () => {
    db.clear();
    await mockUserRepository.create({
      username: "existingUser",
      email: "example@email.com",
      password: "correctPassword",
    });
    const mockContext = createMockContext({
      method: "POST",
      body: {
        username: "existingUser",
        password: "wrongPassword",
      },
    });
    const result = await loginHandler(mockContext, mockUserRepository);
    const json = await result.json();
    assertEquals(result.status, 401);
    assertEquals(json, "Niepoprawny email/hasło");
  });

  await t.step("verifyHandler - fails with missing token", async () => {
    db.clear();
    const mockContext = createMockContext({
      method: "POST",
    });
    const result = await verifyHandler(mockContext);
    const json = await result.json();
    assertEquals(result.status, 401);
    assertEquals(json, "Brak tokenu");
  });

  await t.step("verifyHandler - fails with invalid token", async () => {
    db.clear();
    const mockContext = createMockContext({
      method: "POST",
      cookies: { jwt: "invalidToken" },
    });
    const result = await verifyHandler(mockContext);
    const json = await result.json();
    assertEquals(result.status, 401);
    assertEquals(json, "Niepoprawny token");
  });

  await t.step("verifyHandler - succeeds with valid token", async () => {
    db.clear();
    await mockUserRepository.create({
      username: "existingUser",
      email: "example@email.com",
      password: "password123",
    });
    const token = await generateJWT("existingUser");
    const mockContext = createMockContext({
      method: "POST",
      cookies: { jwt: token },
    });
    const result = await verifyHandler(mockContext);
    const json = await result.json();
    assertEquals(result.status, 200);
    assertEquals(json.user, "existingUser");
    assertEquals((result as any).__cookies["jwt"], token);
  });
});

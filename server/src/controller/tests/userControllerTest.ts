import { assertEquals } from "@std/assert";
import {UserRepository} from "../../database/repository/userRepository.ts";
import {hashPassword} from "../../util/cryptoUtil.ts";
import {
  deleteUserHandler,
  getAllUsersHandler,
  getUserHandler,
  postUserHandler,
  putUserHandler
} from "../userController.ts";
import {createMockContext} from "./utils/mockContext.ts";

const db = new Map();

const mockUserRepository: UserRepository = {
  pool: {} as any,
  findById: async (id: number): Promise<any> => db.get(id),
  findByUsername: async (username: string): Promise<any> => {
    for (const user of db.values()) {
      if (user.username === username) return user;
    }
    return undefined;
  },
  findByEmail: async (email: string): Promise<any> => {
    for (const user of db.values()) {
      if (user.email === email) return user;
    }
    return undefined;
  },
  findAll: async (): Promise<any[]> => Array.from(db.values()),
  create: async (data: { username: string; email: string; password: string }): Promise<any> => {
    const id = Math.max(...Array.from(db.keys(), Number), 0) + 1;
    const hashedPassword = await hashPassword(data.password);
    const user = {
      id,
      username: data.username,
      email: data.email,
      password: hashedPassword,
      verified: false,
      comments: [],
      blogPosts: [],
    };
    db.set(id, user);
    return user;
  },
  updateById: async (id: number, data: any): Promise<any> => {
    const user = db.get(id);
    if (!user) return undefined;
    Object.assign(user, { ...data, id });
    db.set(id, user);
    return user;
  },
  deleteById: async (id: number): Promise<any> => {
    if (db.has(id)) {
      db.delete(id);
      return { rowCount: 1 };
    }
    return { rowCount: 0 };
  },
  verifyUser: async (_id: number): Promise<any> => ({}),
};

Deno.test("User Controller Handlers", async (t) => {
  // Tests for getUserHandler
  await t.step("getUserHandler", async (t) => {
    await t.step("returns 400 when ID is not a number", async () => {
      db.clear();
      const mockContext = createMockContext({ params: { id: "abc" } });
      const result = await getUserHandler(mockContext, mockUserRepository);
      const json = await result.json();
      assertEquals(result.status, 400);
      assertEquals(json.error, "Nieprawidłowy identyfikator użytkownika");
    });

    await t.step("returns 404 when user is not found", async () => {
      db.clear();
      const mockContext = createMockContext({ params: { id: "999" } });
      const result = await getUserHandler(mockContext, mockUserRepository);
      const json = await result.json();
      assertEquals(result.status, 404);
      assertEquals(json.error, "Nie znaleziono użytkownika");
    });

    await t.step("returns user when ID is valid", async () => {
      db.clear();
      const user = await mockUserRepository.create({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });
      const mockContext = createMockContext({ params: { id: user.id.toString() } });
      const result = await getUserHandler(mockContext, mockUserRepository);
      const json = await result.json();
      assertEquals(result.status, 200);
      assertEquals(json.id, user.id);
      assertEquals(json.username, "testuser");
      assertEquals(json.email, "test@example.com");
    });
  });

  // Tests for getAllUsersHandler
  await t.step("getAllUsersHandler", async (t) => {
    await t.step("returns 404 when no users exist", async () => {
      db.clear();
      const mockContext = createMockContext();
      const result = await getAllUsersHandler(mockContext, mockUserRepository);
      const json = await result.json();
      assertEquals(result.status, 404);
      assertEquals(json.error, "Nie znaleziono użytkownika");
    });

    await t.step("returns all users when available", async () => {
      db.clear();
      await mockUserRepository.create({
        username: "user1",
        email: "user1@example.com",
        password: "password1",
      });
      await mockUserRepository.create({
        username: "user2",
        email: "user2@example.com",
        password: "password2",
      });
      const mockContext = createMockContext();
      const result = await getAllUsersHandler(mockContext, mockUserRepository);
      const json = await result.json();
      assertEquals(result.status, 200);
      assertEquals(json.length, 2);
      assertEquals(json[0].username, "user1");
      assertEquals(json[1].username, "user2");
    });
  });

  await t.step("postUserHandler", async (t) => {
    await t.step("returns 400 when required fields are missing", async () => {
      db.clear();
      const mockContext = createMockContext({
        method: "POST",
        body: { username: "newuser" }, // Missing email and password
      });
      const result = await postUserHandler(mockContext, mockUserRepository);
      const json = await result.json();
      assertEquals(result.status, 400);
      assertEquals(json.error, "Brakuje wymaganych pól: username, email, password");
    });

    await t.step("creates user with valid data", async () => {
      db.clear();
      const mockContext = createMockContext({
        method: "POST",
        body: {
          username: "newuser",
          email: "newuser@example.com",
          password: "newpassword",
        },
      });
      const result = await postUserHandler(mockContext, mockUserRepository);
      const json = await result.json();
      assertEquals(result.status, 200);
      assertEquals(json.username, "newuser");
      assertEquals(json.email, "newuser@example.com");
      assertEquals(json.password !== "newpassword", true); // Password should be hashed
      assertEquals(db.size, 1);
    });
  });

  // Tests for putUserHandler
  await t.step("putUserHandler", async (t) => {
    await t.step("returns 400 when required fields are missing", async () => {
      db.clear();
      const mockContext = createMockContext({
        method: "PUT",
        body: { id: 1 }, // Missing username and email
      });
      const result = await putUserHandler(mockContext, mockUserRepository);
      const json = await result.json();
      assertEquals(result.status, 400);
      assertEquals(json.error, "Brakuje wymaganych danych do aktualizacji");
    });

    await t.step("returns 404 when user is not found", async () => {
      db.clear();
      const mockContext = createMockContext({
        method: "PUT",
        body: { id: 999, username: "updated", email: "updated@example.com" },
      });
      const result = await putUserHandler(mockContext, mockUserRepository);
      const json = await result.json();
      assertEquals(result.status, 404);
      assertEquals(json.error, "Nie znaleziono użytkownika");
    });

    await t.step("updates user with valid data", async () => {
      db.clear();
      const user = await mockUserRepository.create({
        username: "olduser",
        email: "old@example.com",
        password: "oldpassword",
      });
      const mockContext = createMockContext({
        method: "PUT",
        body: {
          id: user.id,
          username: "updateduser",
          email: "updated@example.com",
        },
      });
      const result = await putUserHandler(mockContext, mockUserRepository);
      const json = await result.json();
      assertEquals(result.status, 200);
      assertEquals(json.username, "updateduser");
      assertEquals(json.email, "updated@example.com");
      const updatedUser = db.get(user.id);
      assertEquals(updatedUser.username, "updateduser");
    });
  });

  // Tests for deleteUserHandler
  await t.step("deleteUserHandler", async (t) => {
    await t.step("returns 400 when ID is not a number", async () => {
      db.clear();
      const mockContext = createMockContext({
        method: "DELETE",
        body: { id: "abc" },
      });
      const result = await deleteUserHandler(mockContext, mockUserRepository);
      const json = await result.json();
      assertEquals(result.status, 400);
      assertEquals(json.error, "Nieprawidłowy identyfikator użytkownika");
    });

    await t.step("returns 404 when user is not found", async () => {
      db.clear();
      const mockContext = createMockContext({
        method: "DELETE",
        body: { id: 999 },
      });
      const result = await deleteUserHandler(mockContext, mockUserRepository);
      const json = await result.json();
      assertEquals(result.status, 404);
      assertEquals(json.error, "Nie znaleziono użytkownika");
    });

    await t.step("deletes user when ID is valid", async () => {
      db.clear();
      const user = await mockUserRepository.create({
        username: "todelete",
        email: "todelete@example.com",
        password: "password",
      });
      const mockContext = createMockContext({
        method: "DELETE",
        body: { id: user.id },
      });
      const result = await deleteUserHandler(mockContext, mockUserRepository);
      const json = await result.json();
      assertEquals(result.status, 200);
      assertEquals(json.rowCount, 1);
      assertEquals(db.size, 0);
    });
  });
});
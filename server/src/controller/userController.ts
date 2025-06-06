import { Hono } from "hono";
import { UserRepository } from "../database/repository/userRepository.ts";
import { User, users } from "../database/schema/users.ts";
import { db } from "../database/database.ts";

export const userController = new Hono();
const userRepository = new UserRepository(db);

userController.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");

    if (isNaN(Number(id))) {
      return c.json({ error: "Nieprawidłowy identyfikator użytkownika" }, 400);
    }

    const user = await userRepository.findById(parseFloat(id));
    if (!user) {
      return c.json({ error: "Nie znaleziono użytkownika" }, 404);
    }
    return c.json(user);
  } catch (err) {
    console.error("💥 Błąd podczas pobierania danych:", err);
    return c.json({ error: "Wystąpił błąd serwera" }, 500);
  }
});
userController.get("/", async (c) => {
  try {
    const users = await userRepository.findAll();
    if (!users || users.length === 0 ) {
      return c.json({ error: "Nie znaleziono użytkownika" }, 404);
    }
    return c.json(users, 200);
  } catch (err) {
    console.error("💥 Błąd podczas pobierania danych:", err);
    return c.json({ error: "Wystąpił błąd serwera" }, 500);
  }
});
userController.post("/", async (c) => {
  try {
    const body = await c.req.json<Extract<User, typeof users.$inferInsert>>();

    if (!body.username || !body.email || !body.password) {
      return c.json({ error: "Brakuje wymaganych pól: username, email, password" }, 400);
    }

    const user = await userRepository.create(body);
    if (!user) {
      return c.json({ error: "Nie udało się utworzyć użytkownika" }, 404);
    }

    return c.json(user, 200);
  } catch (err) {
    console.error("💥 Błąd podczas pobierania danych:", err);
    return c.json({ error: "Wystąpił błąd serwera" }, 500);
  }
});
userController.put("/:id", async (c) => {
  try {
    const body = await c.req.json<Extract<User, typeof users.$inferSelect>>();

    if (!body.id || !body.username || !body.email) {
      return c.json({ error: "Brakuje wymaganych danych do aktualizacji" }, 400);
    }

    const user = await userRepository.updateById(body.id, body);
    if (!user) {
      return c.json({ error: "Nie znaleziono użytkownika" }, 404);
    }
    return c.json(user, 200);
  } catch (err) {
    console.error("💥 Błąd podczas pobierania danych:", err);
    return c.json({ error: "Wystąpił błąd serwera" }, 500);
  }
});
userController.delete("/:id", async (c) => {
  try {
    const body = await c.req.json<Extract<User, typeof users.$inferSelect>>();

    if (isNaN(Number(body.id))) {
      return c.json({ error: "Nieprawidłowy identyfikator użytkownika" }, 400);
    }

    const user = await userRepository.deleteById(body.id);
    if (user.rowCount === 0) {
      return c.json({ error: "Nie znaleziono użytkownika" }, 404);
    }

    return c.json(user, 200);
  } catch (err) {
    console.error("💥 Błąd podczas pobierania danych:", err);
    return c.json({ error: "Wystąpił błąd serwera" }, 500);
  }
});

import { Hono } from "hono";
import { UserRepository } from "../database/repository/userRepository.ts";
import { db } from "../database/database.ts";
import { generateJWT, verifyJWT } from "../util/jwtUtil.ts";
import {verifyPassword} from "../util/cryptoUtil.ts";


export const authController = new Hono();
export const userRepository = new UserRepository(db);

authController.post("/register", async (c) => {
    try {
        const body = await c.req.json();
        const { username, email, password } = body;
        const existingUsername = await userRepository.findByUsername(username);
        if(existingUsername) {
            return c.json('Wprowadź inną nazwę użytkownika', 409);
        }

        const existingEmail = await userRepository.findByEmail(email);
        if (existingEmail) {
            return c.json('Wprowadź inny email', 409);
        }

        const newUser = await userRepository.create({
            username,
            email,
            password,
        });

        return c.json(newUser, 201);
    }
    catch (err) {
        console.error("💥 Błąd podczas pobierania danych:", err);
        return c.json({ error: "Wystąpił błąd serwera" }, 500);
    }
});
authController.post("/login", async (c) => {
    try {
        const body = await c.req.json();
        const username = body.username;
        const password = body.password;

        const user = await userRepository.findByUsername(username);
        if (!user) {
            return c.json('Niepoprawny email/hasło', 401);
        }

        if (!await verifyPassword(password, user.password)) {
            return c.json('Niepoprawny email/hasło', 401);
        }

        const token = await generateJWT(user.username);

        return c.json({ token }, 200);
    }
    catch (err) {
        console.error("💥 Błąd podczas pobierania danych:", err);
        return c.json({ error: "Wystąpił błąd serwera" }, 500);
    }
});

authController.post('/verify', async (c) => {
    try {
        const authHeader = c.req.header('Authorization')
        if (!authHeader) {
            return c.json('Brak tokenu', 401);
        }
        const token = authHeader.split(' ')[1]
        if (!token) {
            return c.json('Brak tokenu', 401);
        }
        const payload = await verifyJWT(token)
        if (!payload) {
            return c.json('Niepoprawny token', 401);
        }

        return c.json(payload.sub, 200);
    }
    catch(err) {
        console.error("💥 Błąd podczas pobierania danych:", err);
        return c.json({ error: "Wystąpił błąd serwera" }, 500);
    }
});
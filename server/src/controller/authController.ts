import { Hono } from "hono";
import { UserRepository } from "../database/repository/userRepository.ts";
import {generateJWT, verifyJWT} from "../util/jwtUtil.ts";
import {verifyPassword} from "../util/cryptoUtil.ts";
import {setCookie, getCookie, deleteCookie} from 'hono/cookie';
import { randomBytes } from "node:crypto";
import {Context} from "npm:hono@4.7.5";
import {db} from "../database/database.ts";

export const authController = new Hono();

function generateCsrfToken() {
    return randomBytes(32).toString("hex");
}

export const registerHandler = (async (c: Context, userRepository: UserRepository) => {
    try {
        const body = await c.req.json();
        const { username, email, password } = body;

        if (!username || !email || !password) {
            return c.json({ error: "Brak wymaganych danych" }, 400);
        }

        const existingUsername = await userRepository.findByUsername(username);
        if(existingUsername) {
            return c.json("Wprowadź inną nazwę użytkownika", 409);
        }

        const existingEmail = await userRepository.findByEmail(email);
        if (existingEmail) {
            return c.json("Wprowadź inny adres email", 409);
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
export const loginHandler = (async (c: Context, userRepository: UserRepository) => {
    try {
        const body = await c.req.json();
        const username = body.username;
        const password = body.password;

        if (!username || !password) {
            return c.json({ error: "Brak loginu lub hasła" }, 400);
        }
        const user = await userRepository.findByUsername(username);
        if (!user) {
            return c.json('Podany login nie istnieje', 404);
        }

        if (!await verifyPassword(password, user.password)) {
            return c.json('Niepoprawny email/hasło', 401);
        }

        const token = await generateJWT(user.username);
        const csrfToken = generateCsrfToken();

        setCookie(c, 'jwt', token, {
            secure: true,
            httpOnly: true,
            maxAge: 60 * 60 * 24,
            sameSite: 'Strict',
            path: '/'
        })

        setCookie(c, "csrfToken", csrfToken, {
            sameSite: "Strict",
            path: "/",
        });
        return c.json({user: user.username}, 200);
    }
    catch (err) {
        console.error("💥 Błąd podczas pobierania danych:", err);
        return c.json({ error: "Wystąpił błąd serwera" }, 500);
    }
});
export const verifyHandler = (async (c: Context) => {
    try {
        const token = getCookie(c, 'jwt');
        if (!token) {
            return c.json('Brak tokenu', 401);
        }
        const payload = await verifyJWT(token)

        if (!payload) {
            return c.json('Niepoprawny token', 401);
        }
        const username = payload.sub
        setCookie(c, 'jwt', token, {
            secure: true,
            httpOnly: true,
            maxAge: 60 * 60 * 24,
            sameSite: 'Strict',
            path: '/'
        })
        return c.json({user: username},200);
    }
    catch(err) {
        console.error("💥 Błąd podczas pobierania danych:", err);
        return c.json({ error: "Wystąpił błąd serwera" }, 500);
    }
});

authController.post("/register", async (c) => registerHandler(c, new UserRepository(db)));
authController.post('/login', async (c) => loginHandler(c, new UserRepository(db)));
authController.post("/verify", async (c) => verifyHandler(c));
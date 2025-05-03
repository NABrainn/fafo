import { Hono } from "hono";
import { UserRepository } from "../database/repository/userRepository.ts";
import { db } from "../database/database.ts";
import { generateJWT, verifyJWT } from "../util/jwtUtil.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { jwtVerify } from "jose";


export const authController = new Hono();
export const userRepository = new UserRepository(db);

authController.post("/register", async (c) => {
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
});
authController.post("/login", async (c) => {
    const body = await c.req.json();
    const username = body.username;
    const password = body.password;
    

    const user = await userRepository.findByUsername(username);
    if (!user) {
      return c.json('Niepoprawny email/hasło', 401);
    }

    if (!await bcrypt.compare(password, user.password)) {                  
      return c.json('Niepoprawny email/hasło', 401);
    }

    const token = await generateJWT(user.username, user.email);
    
    return c.json({ token }, 200);
});

authController.post('/verify', async (c) => {
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
  return c.json(200);
});
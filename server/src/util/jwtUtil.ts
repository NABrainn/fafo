import { decode, sign, verify } from 'hono/jwt'
import {JWTPayload} from "npm:jose@6.0.10";
const secret = Deno.env.get("JWT_SECRET") || ''

const alg = 'HS256'

export const generateJWT = async (username: string) => {
  const payload = {
    sub: username,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24
  }
  const token = await sign(payload, secret, alg);
  return token
}

export const verifyJWT = async (jwt: string): Promise<JWTPayload | null> => {
  try {
    const payload = await verify(jwt, secret, alg);
    return payload;
  } catch (_error) {
    return null;
  }
};
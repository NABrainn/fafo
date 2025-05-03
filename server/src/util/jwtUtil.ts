import { SignJWT } from "jose";

const secret = new TextEncoder().encode(
    Deno.env.get("JWT_SECRET")
)
const alg = 'HS256'

export const generateJWT = async (username: string, email: string) => {
  return await new SignJWT()
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer('blog-post-api-iss')
    .setAudience('blog-post-api-aud')
    .setSubject(username)
    .setSubject(email)
    .setExpirationTime('24h')
    .sign(secret)
}
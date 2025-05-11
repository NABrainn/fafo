import { jwtVerify, SignJWT } from "jose";

const secret = new TextEncoder().encode(
    Deno.env.get("JWT_SECRET")
)
const alg = 'HS256'

export const generateJWT = async (username: string) => {
  return await new SignJWT()
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer('blog-post-api-iss')
    .setAudience('blog-post-api-aud')
    .setSubject(username)
    .setExpirationTime('24h')
    .sign(secret)
}

export const verifyJWT = async (jwt: string) => {
  try {
    const { payload } = await jwtVerify(jwt, secret);
    return payload;
  } catch (_error) {
    return null;
}
};
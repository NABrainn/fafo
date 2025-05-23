import { decode, sign, verify } from 'hono/jwt'
const secret = Deno.env.get("JWT_SECRET") || ''

const alg = 'HS256'

export const generateJWT = async (username: string) => {
  const payload = {
    sub: username,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24
  }
  const token = await sign(payload, secret, alg);
  console.log('generated: ',token)
  return token
}

export const verifyJWT = async (jwt: string) => {
  console.log('passed: ',jwt)

  try {
    const payload = await verify(jwt, secret, alg);
    console.log('verified: ', payload)

    return payload;
  } catch (_error) {
    return null;
}
};
const { SignJWT, jwtVerify } = require('jose')
const secret = new TextEncoder().encode('WEBBENCH-SECRET')

async function generateToken(payload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(secret)
  return token
}

async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (err) {
    return null
  }
}

module.exports = {
  generateToken,
  verifyToken,
}

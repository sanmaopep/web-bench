import { db } from '~/libs/db'
import { SignJWT } from 'jose'

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event)
  
  return new Promise((resolve, reject) => {
    db.get('SELECT username, role FROM users WHERE username = ? AND password = ?', [username, password], async (err, row) => {
      if (err || !row) {
        return reject(createError({
          statusCode: 401,
          message: 'Invalid credentials'
        }))
      }
      
      const secret = new TextEncoder().encode('WEBBENCH-SECRET')
      const token = await new SignJWT({ username: row.username, role: row.role })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1h')
        .sign(secret)
      
      setCookie(event, 'TOKEN', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60 // 1 hour
      })
      
      resolve({ success: true })
    })
  })
})
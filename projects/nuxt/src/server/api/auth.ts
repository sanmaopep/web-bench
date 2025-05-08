import { db } from '~/libs/db'
import { jwtVerify } from 'jose'

export default defineEventHandler(async (event) => {
  const cookie = getCookie(event, 'TOKEN')
  
  if (!cookie) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }
  
  try {
    const secret = new TextEncoder().encode('WEBBENCH-SECRET')
    const { payload } = await jwtVerify(cookie, secret)
    
    return new Promise((resolve, reject) => {
      db.get('SELECT username, role, coin FROM users WHERE username = ?', [payload.username], (err, row) => {
        if (err || !row) {
          reject(createError({
            statusCode: 401,
            message: 'User not found'
          }))
          return
        }
        
        resolve({
          username: row.username,
          role: row.role,
          coin: row.coin
        })
      })
    })
  } catch (err) {
    throw createError({
      statusCode: 401,
      message: 'Invalid token'
    })
  }
})
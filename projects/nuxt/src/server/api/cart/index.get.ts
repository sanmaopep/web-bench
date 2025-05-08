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
      const query = `
        SELECT p.*, c.quantity 
        FROM products p
        JOIN cart c ON p.id = c.product_id
        WHERE c.username = ?
      `
      
      db.all(query, [payload.username], (err, rows) => {
        if (err) {
          reject(createError({
            statusCode: 500,
            message: 'Failed to fetch cart'
          }))
          return
        }
        
        resolve({ items: rows })
      })
    })
  } catch (err) {
    throw createError({
      statusCode: 401,
      message: 'Invalid token'
    })
  }
})
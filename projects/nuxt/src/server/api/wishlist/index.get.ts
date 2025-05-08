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
        SELECT p.* 
        FROM products p
        JOIN wishlist w ON p.id = w.product_id
        WHERE w.username = ?
      `
      
      db.all(query, [payload.username], (err, rows) => {
        if (err) {
          reject(createError({
            statusCode: 500,
            message: 'Failed to fetch wishlist'
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
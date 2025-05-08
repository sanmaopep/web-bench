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
    const { productId } = await readBody(event)
    
    if (!productId) {
      throw createError({
        statusCode: 400,
        message: 'Product ID is required'
      })
    }
    
    return new Promise((resolve, reject) => {
      // First check if the product exists
      db.get('SELECT id FROM products WHERE id = ?', [productId], (err, product) => {
        if (err || !product) {
          reject(createError({
            statusCode: 404,
            message: 'Product not found'
          }))
          return
        }
        
        // Then add to wishlist
        db.run(
          'INSERT OR IGNORE INTO wishlist (username, product_id) VALUES (?, ?)',
          [payload.username, productId],
          function(err) {
            if (err) {
              reject(createError({
                statusCode: 500,
                message: 'Failed to add to wishlist'
              }))
              return
            }
            
            resolve({ success: true })
          }
        )
      })
    })
  } catch (err) {
    throw createError({
      statusCode: 401,
      message: 'Invalid token'
    })
  }
})
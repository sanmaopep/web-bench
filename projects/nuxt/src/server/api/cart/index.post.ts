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
    const { productId, quantity } = await readBody(event)
    
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
        
        // Check if product is already in cart
        db.get(
          'SELECT quantity FROM cart WHERE username = ? AND product_id = ?',
          [payload.username, productId],
          (err, existingItem) => {
            if (err) {
              reject(createError({
                statusCode: 500,
                message: 'Database error'
              }))
              return
            }
            
            if (existingItem) {
              // Update quantity if already in cart
              db.run(
                'UPDATE cart SET quantity = quantity + ? WHERE username = ? AND product_id = ?',
                [quantity || 1, payload.username, productId],
                function(err) {
                  if (err) {
                    reject(createError({
                      statusCode: 500,
                      message: 'Failed to update cart'
                    }))
                    return
                  }
                  
                  resolve({ success: true })
                }
              )
            } else {
              // Add new item to cart
              db.run(
                'INSERT INTO cart (username, product_id, quantity) VALUES (?, ?, ?)',
                [payload.username, productId, quantity || 1],
                function(err) {
                  if (err) {
                    reject(createError({
                      statusCode: 500,
                      message: 'Failed to add to cart'
                    }))
                    return
                  }
                  
                  resolve({ success: true })
                }
              )
            }
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
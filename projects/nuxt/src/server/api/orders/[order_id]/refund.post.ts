import { db } from '~/libs/db'
import { jwtVerify } from 'jose'

export default defineEventHandler(async (event) => {
  const cookie = getCookie(event, 'TOKEN')
  const orderId = event.context.params?.order_id
  
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
      // First get the order
      db.get(
        'SELECT id, username, status FROM orders WHERE id = ?',
        [orderId],
        (err, order) => {
          if (err) {
            reject(createError({
              statusCode: 500,
              message: 'Failed to fetch order'
            }))
            return
          }
          
          if (!order) {
            reject(createError({
              statusCode: 404,
              message: 'Order not found'
            }))
            return
          }
          
          // Check if the order belongs to the user
          if (order.username !== payload.username) {
            reject(createError({
              statusCode: 403,
              message: 'You do not have permission to refund this order'
            }))
            return
          }
          
          // Check if the order is in the correct status
          if (order.status !== 'Finished') {
            reject(createError({
              statusCode: 400,
              message: 'This order cannot be refunded'
            }))
            return
          }
          
          // Update order status to 'Refund Reviewing'
          db.run(
            'UPDATE orders SET status = ? WHERE id = ?',
            ['Refund Reviewing', orderId],
            function(err) {
              if (err) {
                reject(createError({
                  statusCode: 500,
                  message: 'Failed to update order status'
                }))
                return
              }
              
              resolve({ success: true })
            }
          )
        }
      )
    })
  } catch (err) {
    throw createError({
      statusCode: 401,
      message: 'Invalid token'
    })
  }
})
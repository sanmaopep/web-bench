import { db, runTransaction } from '~/libs/db'
import { jwtVerify } from 'jose'

interface Product {
  id: number
  price: number
}

interface OrderItem {
  productId: number
  quantity: number
}

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
    const { items } = await readBody(event) as { items: OrderItem[] }
    
    if (!items || !items.length) {
      throw createError({
        statusCode: 400,
        message: 'No items provided'
      })
    }

    // First verify all products exist and calculate total price
    const productIds = items.map(item => item.productId)
    const placeholders = productIds.map(() => '?').join(',')
    
    const products = await new Promise<Product[]>((resolve, reject) => {
      db.all(
        `SELECT id, price FROM products WHERE id IN (${placeholders})`,
        productIds,
        (err, rows) => {
          if (err) reject(err)
          else resolve(rows as Product[])
        }
      )
    })
    
    // Check if all products exist
    if (products.length !== productIds.length) {
      throw createError({
        statusCode: 400,
        message: 'One or more products do not exist'
      })
    }
    
    // Create a map of product id to price for easy lookup
    const productPriceMap: Record<number, number> = {}
    products.forEach(product => {
      productPriceMap[product.id] = product.price
    })
    
    // Calculate total price
    let totalPrice = 0
    items.forEach(item => {
      totalPrice += productPriceMap[item.productId] * item.quantity
    })

    let orderId: number = -1

    // Prepare transaction operations
    await runTransaction([
      {
        sql: 'INSERT INTO orders (username, status, created_at, total_price) VALUES (?, ?, datetime("now"), ?)',
        deps: [payload.username, 'Pending payment', totalPrice],
        afterCb: (lastID: number) => {
          // Store the order ID
          orderId = lastID
        }
      },
      ...items.map(item => () => ({
        sql: 'INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)',
        deps: [orderId, item.productId, item.quantity]
      }))
    ])
    
    return {
      success: true,
      orderId
    }
  } catch (err) {
    if (err instanceof Error) {
      throw createError({
        statusCode: 500,
        message: err.message
      })
    }
    throw createError({
      statusCode: 401,
      message: 'Invalid token or invalid request'
    })
  }
})
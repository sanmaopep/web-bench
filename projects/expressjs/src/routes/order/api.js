// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const express = require('express')
const router = express.Router()
const db = require('../../libs/db')
const { verifyToken } = require('../../libs/auth')
const { runTransaction } = require('../../libs/db-utils')

// Create a new order from cart items
router.post('/api/placeOrder', async (req, res) => {
  try {
    const user = await verifyToken(req.cookies.TOKEN)

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const username = user.username

    // 1. Get cart items
    const cartItems = await new Promise((resolve, reject) => {
      db.all(
        `SELECT c.*, p.price, p.name, p.image 
         FROM cart c 
         JOIN products p ON c.product_id = p.id 
         WHERE c.username = ?`,
        [username],
        (err, rows) => {
          if (err) reject(err)
          else resolve(rows)
        }
      )
    })

    if (!cartItems.length) {
      return res.status(400).json({ error: 'Cart is empty' })
    }

    // 2. Calculate total price
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    let orderId = -1

    await runTransaction([
      {
        // 3. Create order
        deps: [username, 'Pending payment', totalPrice],
        sql: 'INSERT INTO orders (username, status, total_price) VALUES (?, ?, ?)',
        deps: [username, 'Pending payment', totalPrice],
        afterCb: (lastID) => {
          orderId = lastID
        },
      },
      // 4. Create order items
      ...cartItems.map((item) => () => ({
        sql: 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?,?,?,?)',
        deps: [orderId, item.product_id, item.quantity, item.price],
      })),
      // 5. Clear cart
      {
        sql: 'DELETE FROM cart WHERE username =?',
        deps: [username],
      },
    ])

    res.json({ orderId })
  } catch (error) {
    return res.status(500).json({ error })
  }
})

// Get user's orders
router.get('/my-orders', async (req, res) => {
  const user = await verifyToken(req.cookies.TOKEN)

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const username = user.username

  db.all(
    'SELECT * FROM orders WHERE username = ? ORDER BY created_at DESC',
    [username],
    (err, orders) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch orders' })
      res.render('orders', { orders })
    }
  )
})

// Get specific order details
router.get('/order/:id', async (req, res) => {
  const orderId = req.params.id
  const user = await verifyToken(req.cookies.TOKEN)

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const username = user.username

  db.get(
    'SELECT * FROM orders WHERE id = ? AND username = ?',
    [orderId, username],
    (err, order) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch order' })
      if (!order) return res.status(404).json({ error: 'Order not found' })

      db.all(
        `SELECT oi.*, p.name, p.image, p.price
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [orderId],
        (err, items) => {
          if (err) return res.status(500).json({ error: 'Failed to fetch order items' })

          order.items = items.map((item) => ({
            quantity: item.quantity,
            price: item.price,
            product: {
              id: item.product_id,
              name: item.name,
              image: item.image,
              price: item.price,
            },
          }))

          res.render('order', { order })
        }
      )
    }
  )
})

module.exports = router

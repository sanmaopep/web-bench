const express = require('express')
const db = require('../../libs/db')
const { verifyToken } = require('../../libs/auth')
const { runTransaction } = require('../../libs/db-utils')
const { creditReferrerForFirstPayment } = require('../auth/referer')

const router = express.Router()

router.post('/api/orders/:order_id/pay', async (req, res) => {
  const currentUser = await verifyToken(req.cookies.TOKEN)

  if (!currentUser) {
    return res.status(401).json({ success: false, error: 'Unauthorized' })
  }

  const { order_id } = req.params

  try {
    // Check order exists and user has enough coins
    const orderAndUser = await new Promise((resolve, reject) => {
      db.get(
        'SELECT orders.total_price, users.coin FROM orders JOIN users ON orders.username = users.username WHERE orders.id = ? AND orders.username = ? AND orders.status = ?',
        [order_id, currentUser.username, 'Pending payment'],
        (err, row) => {
          if (err) reject(err)
          else resolve(row)
        }
      )
    })

    if (!orderAndUser) {
      return res.status(404).json({ success: false, error: 'Order not found or already paid' })
    }

    if (orderAndUser.coin < orderAndUser.total_price) {
      await new Promise((resolve, reject) => {
        db.run('UPDATE orders SET status = ? WHERE id = ?', ['Failed', order_id], (err) => {
          if (err) reject(err)
          else resolve()
        })
      })
      return res.status(400).json({ success: false, error: 'Insufficient funds' })
    }

    // Check product quantities
    const items = await new Promise((resolve, reject) => {
      db.all(
        `SELECT p.id as product_id, p.quantity as available_quantity, oi.quantity as order_quantity 
         FROM order_items oi 
         JOIN products p ON oi.product_id = p.id 
         WHERE oi.order_id = ?`,
        [order_id],
        (err, rows) => {
          if (err) reject(err)
          else resolve(rows)
        }
      )
    })

    const insufficientProducts = items.filter(
      (item) => item.available_quantity < item.order_quantity
    )

    if (insufficientProducts.length > 0) {
      await new Promise((resolve, reject) => {
        db.run('UPDATE orders SET status = ? WHERE id = ?', ['Failed', order_id], (err) => {
          if (err) reject(err)
          else resolve()
        })
      })
      return res.status(400).json({ success: false, error: 'Some products are out of stock' })
    }

    // Use runTransaction for the transaction operations
    await runTransaction([
      // Update user's coins
      {
        sql: 'UPDATE users SET coin = coin -? WHERE username =?',
        deps: [orderAndUser.total_price, currentUser.username],
      },
      // Update product quantities
      ...items.map((item) => ({
        sql: 'UPDATE products SET quantity = quantity -? WHERE id =?',
        deps: [item.order_quantity, item.product_id],
      })),
      // Update order status
      {
        sql: 'UPDATE orders SET status =? WHERE id =?',
        deps: ['Finished', order_id],
      },
    ])

    await creditReferrerForFirstPayment(currentUser.username)

    return res.json({ success: true })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
})

module.exports = router

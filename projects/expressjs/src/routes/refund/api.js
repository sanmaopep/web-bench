const express = require('express')
const db = require('../../libs/db')
const { runTransaction } = require('../../libs/db-utils')
const { verifyToken } = require('../../libs/auth')

const router = express.Router()

router.post('/api/orders/:order_id/refund/approve', async (req, res) => {
  const currentUser = await verifyToken(req.cookies.TOKEN)

  if (!currentUser || currentUser.role !== 'admin') {
    return res.status(401).json({ success: false, error: 'Unauthorized' })
  }

  const { order_id } = req.params

  const orderInfo = await new Promise((resolve, reject) => {
    db.get(
      'SELECT username, total_price FROM orders WHERE id = ? AND status = ?',
      [order_id, 'Refund Reviewing'],
      (err, row) => {
        if (err) reject(err)
        else if (!row) reject(new Error('Order not found or not eligible for refund'))
        else resolve(row)
      }
    )
  })

  try {
    await runTransaction([
      {
        sql: 'UPDATE users SET coin = coin + ? WHERE username = ?',
        deps: [orderInfo.total_price, orderInfo.username],
      },
      {
        sql: 'UPDATE orders SET status = ? WHERE id = ?',
        deps: ['Refund Passed', order_id],
      },
    ])

    return res.json({ success: true, order_id, orderInfo })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
})

router.post('/api/orders/:order_id/refund/request', async (req, res) => {
  const currentUser = await verifyToken(req.cookies.TOKEN)

  if (!currentUser) {
    return res.status(401).json({ success: false, error: 'Unauthorized' })
  }

  const { order_id } = req.params

  db.run(
    'UPDATE orders SET status = ? WHERE id = ? AND username = ? AND status = ?',
    ['Refund Reviewing', order_id, currentUser.username, 'Finished'],
    function (err) {
      if (err) {
        return res.status(500).json({ success: false, error: err.message })
      } else if (this.changes > 0) {
        return res.json({ success: true })
      } else {
        return res
          .status(404)
          .json({ success: false, error: 'Order not found or not eligible for refund' })
      }
    }
  )
})

module.exports = router

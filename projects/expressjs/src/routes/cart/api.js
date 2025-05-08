const express = require('express')
const router = express.Router()
const db = require('../../libs/db')
const { verifyToken } = require('../../libs/auth')

// Get cart items for current user
router.get('/api/cart', async (req, res) => {
  const { username } = (await verifyToken(req.cookies.TOKEN)) || {}

  if (!username) {
    return res.status(401).json({ success: false, message: 'Please login first' })
  }

  db.all(
    `
    SELECT c.*, p.name, p.price, p.image 
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.username = ?
  `,
    [username],
    (err, cartItems) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Failed to fetch cart' })
      }

      const items = cartItems.map((item) => ({
        productId: item.product_id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
      }))

      res.json({ success: true, items })
    }
  )
})

// Add item to cart
router.post('/api/cart/add', async (req, res) => {
  const { username } = (await verifyToken(req.cookies.TOKEN)) || {}
  const { productId, quantity } = req.body

  if (!username) {
    return res.status(401).json({ success: false, message: 'Please login first' })
  }

  db.run(
    `
    INSERT INTO cart (username, product_id, quantity) 
    VALUES (?, ?, ?)
    ON CONFLICT(username, product_id) 
    DO UPDATE SET quantity = quantity + ?
  `,
    [username, productId, quantity, quantity],
    (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Failed to add item to cart' })
      }
      res.json({ success: true })
    }
  )
})

// Remove item from cart
router.delete('/api/cart/remove', async (req, res) => {
  const { username } = (await verifyToken(req.cookies.TOKEN)) || {}
  const { productId } = req.body

  if (!username) {
    return res.status(401).json({ success: false, message: 'Please login first' })
  }

  db.run(
    `
    DELETE FROM cart 
    WHERE username = ? AND product_id = ?
  `,
    [username, productId],
    (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Failed to remove item from cart' })
      }
      res.json({ success: true })
    }
  )
})

module.exports = router

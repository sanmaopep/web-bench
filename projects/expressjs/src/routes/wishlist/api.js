const express = require('express')
const router = express.Router()
const db = require('../../libs/db')
const { verifyToken } = require('../../libs/auth')

// Get wishlist page with items
router.get('/wishlist', async (req, res) => {
  const { username } = (await verifyToken(req.cookies.TOKEN)) || {}

  if (!username) {
    return res.redirect('/login')
  }

  db.all(
    `
    SELECT products.* FROM wishlist 
    JOIN products ON wishlist.product_id = products.id 
    WHERE wishlist.username = ?`,
    [username],
    (err, wishlistItems) => {
      if (err) {
        res.status(500).render('error', { message: 'Failed to fetch wishlist' })
      } else {
        res.render('wishlist', { wishlistItems })
      }
    }
  )
})

// Add item to wishlist
router.post('/api/wishlist/add', async (req, res) => {
  const { username } = (await verifyToken(req.cookies.TOKEN)) || {}
  const { productId } = req.body

  if (!username) {
    return res.status(401).json({ success: false, message: 'Unauthorized' })
  }

  db.run(
    `
    INSERT INTO wishlist (username, product_id) 
    VALUES (?, ?)`,
    [username, productId],
    function (err) {
      if (err) {
        res.status(500).json({ success: false, error: err.message })
        return
      }
      res.json({ success: true, data: { id: this.lastID } })
    }
  )
})

// Remove item from wishlist
router.delete('/api/wishlist/remove', async (req, res) => {
  const { username } = (await verifyToken(req.cookies.TOKEN)) || {}
  const { productId } = req.body

  if (!username) {
    return res.status(401).json({ success: false, message: 'Unauthorized' })
  }

  db.run(
    `
    DELETE FROM wishlist 
    WHERE username = ? AND product_id = ?`,
    [username, productId],
    function (err) {
      if (err) {
        res.status(500).json({ success: false, error: err.message })
        return
      }
      res.json({ success: true, data: { changes: this.changes } })
    }
  )
})

module.exports = router

const express = require('express')
const router = express.Router()
const db = require('../../libs/db')
const { verifyToken } = require('../../libs/auth')
const { getHasPurchased, getHasCommented } = require('../comment/utils')

router.post('/api/products', (req, res) => {
  const { name, price, image, description, quantity } = req.body

  db.run(
    'INSERT INTO products (name, price, image, description, quantity) VALUES (?, ?, ?, ?, ?)',
    [name, price, image, description, quantity],
    function (err) {
      if (err) {
        res.status(500).json({ success: false, error: err.message })
        return
      }
      res.json({ success: true, data: { id: this.lastID } })
    }
  )
})

router.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', (err, products) => {
    if (err) {
      res.status(500).json({ success: false, error: err.message })
      return
    }
    res.json({ success: true, products })
  })
})

router.get('/products', (req, res) => {
  db.all('SELECT * FROM products', (err, products) => {
    if (err) {
      res.status(500).render('error', { message: 'Failed to fetch products' })
    } else {
      res.render('products', { products })
    }
  })
})

router.get('/products/:product_id', async (req, res) => {
  const user = (await verifyToken(req.cookies.TOKEN)) || {}
  const productId = req.params.product_id

  try {
    const product = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM products WHERE id =?', [productId], (err, product) => {
        if (err) reject(err)
        else resolve(product)
      })
    })

    if (!product) {
      return res.render('product-detail', {})
    }

    const [comments, hasPurchased, hasCommented] = await Promise.all([
      new Promise((resolve, reject) => {
        db.all(
          'SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.product_id = ?',
          [productId],
          (err, comments) => {
            if (err) reject(err)
            else resolve(comments || [])
          }
        )
      }),
      ...(user.username
        ? [getHasPurchased(user.username, productId), getHasCommented(user.username, productId)]
        : []),
    ])

    const averageRating =
      comments.length > 0
        ? comments.reduce((sum, comment) => sum + comment.rating, 0) / comments.length
        : 0

    return res.render('product-detail', {
      product,
      user,
      comments,
      averageRating,
      canComment: user && hasPurchased && !hasCommented,
    })
  } catch (error) {
    return res.status(500).render('error', { message: 'Failed to fetch product' })
  }
})

module.exports = router

const express = require('express')
const router = express.Router()
const db = require('../../libs/db')
const { verifyToken } = require('../../libs/auth')

// Middleware to check admin privileges
const checkAdminPrivilege = async (req, res, next) => {
  const token = req.cookies.TOKEN
  if (!token) {
    return res.redirect('/login')
  }

  const payload = await verifyToken(token)
  if (!payload || payload.role !== 'admin') {
    return res.redirect('/login')
  }

  req.user = payload
  next()
}

// Apply privilege check to all admin routes
router.use(checkAdminPrivilege)

// Get all products for admin portal
router.get('/products', (req, res) => {
  db.all(
    'SELECT id, image, name, price, quantity, description FROM products',
    [],
    (err, products) => {
      if (err) {
        res.status(500).json({ success: false, error: err.message })
        return
      }

      res.render('admin/products', {
        products,
        hasPrivilege: true,
      })
    }
  )
})

// Get all users for admin portal
router.get('/users', (req, res) => {
  db.all('SELECT username, role, coin FROM users', [], (err, users) => {
    if (err) {
      res.status(500).json({ success: false, error: err.message })
      return
    }

    res.render('admin/users', {
      users,
      hasPrivilege: true,
    })
  })
})

// Get all orders for admin portal
router.get('/orders', (req, res) => {
  db.all('SELECT * FROM orders ORDER BY created_at DESC', [], (err, orders) => {
    if (err) {
      res.status(500).json({ success: false, error: err.message })
      return
    }

    res.render('admin/orders', {
      orders,
      hasPrivilege: true,
    })
  })
})

module.exports = router

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

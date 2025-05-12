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

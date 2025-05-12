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
const db = require('../../libs/db')
const { verifyToken } = require('../../libs/auth')
const { runTransaction } = require('../../libs/db-utils')
const { getHasPurchased, getHasCommented } = require('./utils')

const router = express.Router()

router.post('/api/comment', async (req, res) => {
  const currentUser = await verifyToken(req.cookies.TOKEN)

  if (!currentUser) {
    return res.status(401).json({ success: false, error: 'Unauthorized' })
  }

  const { productId, rating, text } = req.body

  try {
    const [hasPurchased, hasCommented] = await Promise.all([
      getHasPurchased(currentUser.username, productId),
      getHasCommented(currentUser.username, productId),
    ])

    if (!hasPurchased) {
      return res
        .status(403)
        .json({ success: false, error: 'You must purchase the product before commenting' })
    }

    if (hasCommented) {
      return res.status(403).json({ success: false, error: 'You have commented this product' })
    }

    db.run(
      'INSERT INTO comments (user_id, product_id, rating, text) VALUES ((SELECT id FROM users WHERE username = ?), ?, ?, ?)',
      [currentUser.username, productId, rating, text],
      function (err) {
        if (err) {
          return res.status(500).json({ success: false, error: err.message })
        } else {
          return res.json({ success: true })
        }
      }
    )
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
})

module.exports = router

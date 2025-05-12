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

const db = require('../../libs/db')

function getHasPurchased(username, product_id) {
  return new Promise((resolve) => {
    db.get(
      'SELECT 1 FROM orders o JOIN order_items oi ON o.id = oi.order_id WHERE o.username = ? AND oi.product_id = ? AND o.status = "Finished" LIMIT 1',
      [username, product_id],
      (err, row) => {
        if (err) {
          resolve(false)
        } else {
          resolve(Boolean(row))
        }
      }
    )
  })
}

function getHasCommented(username, product_id) {
  return new Promise((resolve) => {
    db.get(
      'SELECT 1 FROM comments WHERE user_id = (SELECT id FROM users WHERE username =?) AND product_id =? LIMIT 1',
      [username, product_id],
      (err, row) => {
        if (err) {
          resolve(false)
        } else {
          resolve(Boolean(row))
        }
      }
    )
  })
}

module.exports = {
  getHasPurchased,
  getHasCommented,
}

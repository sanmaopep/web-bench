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

import { db } from '~/libs/db'

export default defineEventHandler(async (event) => {
  const productId = event.context.params?.product_id
  
  if (!productId) {
    throw createError({
      statusCode: 400,
      message: 'Product ID is required'
    })
  }
  
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT c.id, c.username, c.rating, c.comment, c.created_at
       FROM comments c
       WHERE c.product_id = ?
       ORDER BY c.created_at DESC`,
      [productId],
      (err, rows) => {
        if (err) {
          reject(createError({
            statusCode: 500,
            message: 'Failed to fetch comments'
          }))
          return
        }
        
        resolve({ comments: rows })
      }
    )
  })
})
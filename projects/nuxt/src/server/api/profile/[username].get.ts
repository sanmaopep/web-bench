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
  const username = event.context.params?.username
  
  if (!username) {
    throw createError({
      statusCode: 400,
      message: 'Username is required'
    })
  }

  return new Promise((resolve, reject) => {
    db.get('SELECT username, coin FROM users WHERE username = ?', [username], (err, row) => {
      if (err) {
        reject(err)
      } else if (!row) {
        reject(createError({
          statusCode: 404,
          message: 'User not found'
        }))
      } else {
        resolve(row)
      }
    })
  })
}) 
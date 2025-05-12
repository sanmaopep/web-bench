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

const defaultData: DatabaseData = {
  users: [
    {
      username: 'admin',
      password: '123456',
      role: 'admin',
      coin: 0,
    },
    {
      username: 'user',
      password: '123456',
      role: 'user',
      coin: 1000,
    },
  ],
  products: [],
  wishlist: [],
  orders: [],
  cart: [],
  comments: [],
  referrals: [],
}

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { JSONFilePreset } = await import('lowdb/node')
    global.db = await JSONFilePreset(
      process.env.DB_PATH!,
      defaultData
    )
  }
}
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

'use server'

import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode('WEBBENCH-SECRET')

export async function getCurrentUser() {
  try {
    const token = (await cookies()).get('TOKEN')?.value

    if (!token) {
      return null
    }

    const { payload } = await jwtVerify(token, SECRET)
    
    const user = global.db.data.users.find(u => u.username === payload.username)
    
    if (!user) {
      return null
    }
    
    return {
      username: user.username,
      role: user.role,
      coin: user.coin
    }
  } catch (error) {
    return null
  }
}
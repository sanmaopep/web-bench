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

import { getCurrentUser } from './auth'

export async function rechargeCoin() {
  try {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' }
    }
    
    const userIndex = global.db.data.users.findIndex(u => u.username === currentUser.username)
    
    if (userIndex === -1) {
      return { success: false, error: 'User not found' }
    }
    
    // Add 1000 coins to the user's account
    global.db.data.users[userIndex].coin += 1000
    await global.db.write()
    
    return { success: true, coin: global.db.data.users[userIndex].coin }
  } catch (error) {
    return { success: false, error: 'Failed to recharge' }
  }
}
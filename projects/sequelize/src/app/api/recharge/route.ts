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

import { NextResponse } from 'next/server'
import { getLoggedInUser } from '@/actions/auth'
import { User } from '@/model'
import { sequelize } from '@/libs/db'

export async function POST(request: Request) {
  try {
    const currentUser = await getLoggedInUser()
    
    // Check if user is authenticated
    if (!currentUser) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 })
    }
    
    const { username } = await request.json()
    
    // Check if user is trying to recharge their own account
    if (currentUser.username !== username) {
      return NextResponse.json({ 
        success: false, 
        error: 'You can only recharge your own account' 
      }, { status: 403 })
    }
    
    try {
      // Recharge 1000 coins
       await User.update(
        { coin: sequelize.literal('coin + 1000') },
        { where: { username } }
      )
      
      return NextResponse.json({ 
        success: true,
        message: 'Successfully recharged 1000 coins'
      })
    } catch (error) {
      throw error
    }
  } catch (error) {
    console.error('Recharge error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to recharge' 
    }, { status: 500 })
  }
}
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
import User from '@/model/user'

export async function POST(request: Request) {
  const { username, password, role, coin, referralCode } = await request.json()
  await User.create({ username, password, role, coin })

  if (referralCode) {
    const referrer = await User.findOne({ referralCode })
    if (referrer) {
      // Immediately give the registration bonus
      await User.findOneAndUpdate(
        { username: referrer.username },
        { 
          $inc: { coin: 888 },
          $push: { referralPending: username }
        }
      )
    }
  }

  return NextResponse.json({ success: true })
}
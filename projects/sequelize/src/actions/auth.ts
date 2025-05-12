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

export async function getLoggedInUser() {
  try {
    const tokenCookie = (await cookies()).get('TOKEN')
    
    if (!tokenCookie) {
      return null
    }
    
    const secret = new TextEncoder().encode('WEBBENCH-SECRET')
    const { payload } = await jwtVerify(tokenCookie.value, secret)
    
    return {
      username: payload.username as string,
      role: payload.role as string
    }
  } catch (error) {
    return null
  }
}
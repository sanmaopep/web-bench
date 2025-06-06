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

import { NextResponse } from 'next/server';
import { User } from '@/model';

export async function GET() {
  try {
    const users = await User.findAll({
      attributes: ['username']
    });
    
    const usernames = users.map(user => user.username);
    
    return NextResponse.json(usernames);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch usernames' }, { status: 500 });
  }
}
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

import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
  coin: Number,
  referralCode: String,
  referralPending: [String]
})

userSchema.index({ username: 1 }, { unique: true })
userSchema.index({ referralCode: 1 }, { unique: true, sparse: true })

const User: mongoose.Model<{
  username?: string
  password?: string
  role?: string
  coin?: number
  referralCode?: string
  referralPending?: string[]
}> = mongoose.models.User || mongoose.model('User', userSchema)

export const initUsers = async () => {
  if (!(await User.findOne())) {
    await User.create([
      { username: 'admin', password: '123456', role: 'admin', coin: 0 },
      { username: 'user', password: '123456', role: 'user', coin: 1000 },
    ])
  }
}

export default User
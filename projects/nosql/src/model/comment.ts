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

const commentSchema = new mongoose.Schema({
  username: String,
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  text: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

commentSchema.index({ username: 1, productId: 1 }, { unique: true })

const Comment: mongoose.Model<{
  username?: string
  productId?: string
  rating?: number
  text?: string
  createdAt?: Date
}> = mongoose.models.Comment || mongoose.model('Comment', commentSchema)

export default Comment
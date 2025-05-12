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

const orderSchema = new mongoose.Schema({
  username: String,
  status: {
    type: String,
    enum: ['Pending payment', 'Finished', 'Failed', 'Refund Reviewing', 'Refund Passed'],
    default: 'Pending payment',
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      name: String,
      price: Number,
      image: String,
      quantity: Number,
    },
  ],
  totalPrice: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Order: mongoose.Model<{
  username?: string
  status?: string
  items?: Array<{
    productId: mongoose.Types.ObjectId
    name: string
    price: number
    image: string
    quantity: number
  }>
  totalPrice?: number
  createdAt?: Date
}> = mongoose.models.Order || mongoose.model('Order', orderSchema)

export default Order
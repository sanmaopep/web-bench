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

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  quantity: Number,
})

const Product: mongoose.Model<{
  name?: string
  price?: number
  image?: string
  description?: string
  quantity?: number
}> = mongoose.models.Product || mongoose.model('Product', productSchema)

export default Product
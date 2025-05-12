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

import { Low } from 'lowdb'

declare global {
  interface User {
    username: string
    password: string
    role: 'admin' | 'user'
    coin: number
  }
  
  interface Product {
    id: string
    name: string
    price: number
    image: string
    description: string
    quantity: number
  }
  
  interface WishlistItem {
    username: string
    productId: string
  }
  
  interface CartItem {
    username: string
    productId: string
    quantity: number
  }

  interface OrderItem {
    productId?: string
    name?: string
    price?: number
    image?: string
    quantity?: number
  }

  interface Order {
    id: string
    username: string
    items: OrderItem[]
    totalPrice: number
    status: string
    createdAt: string
  }
  
  interface Comment {
    id: string
    username: string
    productId: string
    rating: number
    text: string
    createdAt: string
  }
  
  interface Referral {
    referrerUsername: string
    newUserUsername: string
    initialRewardPaid: boolean
    orderRewardPaid: boolean
  }
  
  interface DatabaseData {
    users: User[]
    products: Product[]
    wishlist: WishlistItem[]
    cart: CartItem[]
    orders: Order[]
    comments: Comment[]
    referrals: Referral[]
  }

  var db: Low<DatabaseData>
}
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

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/actions/auth'
import Order from '@/model/order'
import './style.css'

export default async function OrdersPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect('/login')
  }

  const orders = await Order.find({ username: currentUser.username }).sort({ createdAt: -1 })

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      <div className="orders-list">
        {orders.map((order) => (
          <Link href={`/order/${String(order._id)}`} key={String(String(order._id))}>
            <div className="order-card" id={`my_order_${String(order._id)}`}>
              <div className="order-card-header">
                <span className="order-id">Order ID: {String(order._id)}</span>
                <span className="order-status">{order.status}</span>
              </div>
              <div className="order-total">Total: ${order.totalPrice}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

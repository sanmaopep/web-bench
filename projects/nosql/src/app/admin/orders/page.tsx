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
import { getCurrentUser } from '@/actions/auth'
import Order from '@/model/order'
import PassRefundButton from './PassRefundButton'
import './style.css'

export default async function AdminOrdersPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.role !== 'admin') {
    redirect('/login')
  }

  const orders = await Order.find().sort({ createdAt: -1 })

  return (
    <div className="admin-orders">
      <h1>Order Management</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Username</th>
            <th>Items</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={String(order._id)} id={`admin_order_${order._id}`}>
              <td>{String(order._id)}</td>
              <td>{order.username}</td>
              <td>
                {order.items?.map((item) => (
                  <div key={String(item.productId)} className="order-item">
                    {item.name} x {item.quantity}
                  </div>
                ))}
              </td>
              <td>${order.totalPrice}</td>
              <td>{order.status}</td>
              <td>
                {order.status === 'Refund Reviewing' && (
                  <PassRefundButton orderId={String(order._id)} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
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
import PayOrderButton from './PayOrderButton'
import RefundButton from './RefundButton'
import './style.css'

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect('/login')
  }

  const order = await Order.findById((await params).id)

  if (!order || (currentUser.role !== 'admin' && order.username !== currentUser.username)) {
    redirect('/orders')
  }

  return (
    <div className="order-detail">
      <h1>Order Detail</h1>
      <div className="order-info">
        <div className="order-header">
          <div className="order-id">Order ID: {String(order._id)}</div>
          <div className="order-status">Status: {order.status}</div>
        </div>
        <table className="order-items">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item) => (
              <tr key={item.productId} id={`product_in_order_${item.productId}`}>
                <td>
                  <div className="product-info">
                    <img src={item.image} alt={item.name} />
                    <span>{item.name}</span>
                  </div>
                </td>
                <td>${item.price}</td>
                <td>{item.quantity}</td>
                <td>${item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="order-total">Total: ${order.totalPrice}</div>
        {order.status === 'Pending payment' && order.username === currentUser.username && (
          <PayOrderButton orderId={String(order._id)} />
        )}
        {order.status === 'Finished' && order.username === currentUser.username && (
          <RefundButton orderId={String(order._id)} />
        )}
      </div>
    </div>
  )
}
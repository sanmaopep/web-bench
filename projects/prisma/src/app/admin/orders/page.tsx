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

import { prisma } from '@/libs/db'
import Link from 'next/link'
import RefundReviewButton from './RefundReviewButton'
import '../admin.css'
import './orders.css'

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          username: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Finished':
        return 'status-finished'
      case 'Failed':
        return 'status-failed'
      case 'Refund Reviewing':
        return 'status-reviewing'
      case 'Refund Passed':
        return 'status-refunded'
      default:
        return 'status-pending'
    }
  }

  return (
    <div className="admin-orders-container">
      <h2 className="admin-section-title">Orders Management</h2>
      
      {orders.length === 0 ? (
        <p className="admin-no-items">No orders found</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Total</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} id={`admin_order_${order.id}`}>
                <td>#{order.id}</td>
                <td>{order.username}</td>
                <td>
                  <span className={`order-status-badge ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td>${order.totalPrice}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>
                  <Link href={`/order/${order.id}`} className="order-details-button">
                    Details
                  </Link>
                  
                  {order.status === 'Refund Reviewing' && (
                    <RefundReviewButton orderId={order.id} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
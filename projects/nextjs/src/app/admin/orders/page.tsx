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

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import '../admin.css'

interface Order {
  id: number
  username: string
  status: string
  total_price: number
  created_at: string
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth')
      .then((response) => response.json())
      .then((data) => {
        if (data.success === false || data.role !== 'admin') {
          router.push('/login')
        } else {
          fetchOrders()
        }
      })
  }, [router])

  const fetchOrders = () => {
    fetch('/api/admin/orders')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.orders)
        }
      })
  }

  const handlePassRefund = async (orderId: number) => {
    const response = await fetch(`/api/admin/orders/${orderId}/refund`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await response.json()
    if (data.success) {
      fetchOrders()
    }
  }

  return (
    <div className="admin-container">
      <h1>Admin Order Portal</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Status</th>
            <th>Total Price</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} id={`admin_order_${order.id}`}>
              <td>{order.id}</td>
              <td>{order.username}</td>
              <td>{order.status}</td>
              <td>${order.total_price.toFixed(2)}</td>
              <td>{new Date(order.created_at).toLocaleString()}</td>
              <td>
                {order.status === 'Refund Reviewing' && (
                  <button
                    className="pass-refund-review-button"
                    onClick={() => handlePassRefund(order.id)}
                  >
                    Pass Refund
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

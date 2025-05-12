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
import './orders.css'

interface Order {
  id: number
  status: string
  total_price: number
  created_at: string
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    const response = await fetch('/api/orders')
    const data = await response.json()
    if (data.success) {
      setOrders(data.orders)
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="orders-container">
      <h1>My Orders</h1>
      {orders.map((order) => (
        <div
          key={order.id}
          id={`my_order_${order.id}`}
          className="order-item"
          onClick={() => router.push(`/order/${order.id}`)}
        >
          <div className="order-id">Order #{order.id}</div>
          <div className="order-status">{order.status}</div>
          <div className="order-total-price">${order.total_price.toFixed(2)}</div>
          <div className="order-date">{new Date(order.created_at).toLocaleString()}</div>
        </div>
      ))}
    </div>
  )
}

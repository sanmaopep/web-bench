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
import Link from 'next/link'
import { useAuth } from '@/context/auth'
import './orders.css'

interface Order {
  id: number
  username: string
  status: string
  totalPrice: number
  createdAt: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { auth } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!auth?.username) {
      router.push('/login')
      return
    }

    async function fetchOrders() {
      try {
        const response = await fetch('/api/orders')
        const data = await response.json()
        
        if (data.success) {
          setOrders(data.orders)
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching orders:', error)
        setLoading(false)
      }
    }

    fetchOrders()
  }, [auth, router])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Finished':
        return 'completed'
      case 'Cancelled':
      case 'Failed':
        return 'cancelled'
      case 'Refund Reviewing':
      case 'Refund Passed':
        return 'refund'
      default:
        return 'pending'
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="orders-container">
      <h1 className="orders-title">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="empty-orders">
          <p>You haven't placed any orders yet.</p>
          <Link href="/products" className="shop-now-button">
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div 
              key={order.id} 
              id={`my_order_${order.id}`}
              className="order-card"
              onClick={() => router.push(`/order/${order.id}`)}
            >
              <div className="order-header">
                <div className="order-id">Order #{order.id}</div>
                <div className="order-date">{formatDate(order.createdAt)}</div>
              </div>
              <div className="order-info">
                <div className={`order-status ${getStatusClass(order.status)}`}>
                  {order.status}
                </div>
                <div className="order-total">${order.totalPrice}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
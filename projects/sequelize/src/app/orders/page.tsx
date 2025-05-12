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
  username: string
  totalPrice: number
  status: string
  createdAt: string
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function checkUser() {
      try {
        const response = await fetch('/api/auth')
        if (!response.ok) {
          router.push('/login')
          return
        }
        fetchOrders()
      } catch (error) {
        router.push('/login')
      }
    }

    async function fetchOrders() {
      try {
        setLoading(true)
        const response = await fetch('/api/orders')
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login')
            return
          }
          throw new Error('Failed to fetch orders')
        }
        
        const data = await response.json()
        if (data.success) {
          setOrders(data.orders || [])
        } else {
          setError('Failed to load orders')
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
        setError('Failed to load orders')
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [router])

  const handleOrderClick = (orderId: number) => {
    router.push(`/order/${orderId}`)
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Pending payment':
        return 'pending'
      case 'Paid':
        return 'paid'
      case 'Finished':
        return 'finished'
      case 'Cancelled':
        return 'cancelled'
      case 'Failed':
        return 'failed'
      default:
        return ''
    }
  }

  if (loading) return <div className="orders-loading">Loading...</div>
  if (error) return <div className="orders-error">{error}</div>

  return (
    <div className="orders-container">
      <h1>My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="orders-empty">
          <p>You don't have any orders yet</p>
          <button onClick={() => router.push('/products')}>
            Browse Products
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div 
              className="order-card" 
              id={`my_order_${order.id}`}
              key={order.id}
              onClick={() => handleOrderClick(order.id)}
            >
              <div className="order-header">
                <span className="order-id">Order #{order.id}</span>
                <span className="order-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="order-details">
                <span className="order-price">${order.totalPrice.toFixed(2)}</span>
                <span className={`order-status ${getStatusClass(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
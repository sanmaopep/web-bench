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
import { getOrderById } from '@/actions/order'
import './order-detail.css'
import PaymentButton from './payment-button'
import RefundButton from './refund-button'

interface OrderItem {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
}

interface Order {
  id: string
  username: string
  items: OrderItem[]
  totalPrice: number
  status: string
  createdAt: string
}

export default function OrderDetail({ params }: { params: { orderId: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const { auth } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!auth?.username) {
      router.push('/login')
      return
    }
    
    fetchOrder()
  }, [auth, router, params.orderId])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const result = await getOrderById(params.orderId)
      if (result.success) {
        setOrder(result.order)
      } else {
        alert(result.error || 'Failed to load order')
        router.push('/orders')
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      router.push('/orders')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (loading) {
    return <div className="order-loading">Loading order details...</div>
  }

  if (!order) {
    return <div className="order-not-found">Order not found</div>
  }

  return (
    <div className="order-detail-container">
      <div className="order-detail-header">
        <div>
          <h1 className="order-id">Order #{order.id.substring(0, 8)}</h1>
          <div className="order-meta">
            <div className="order-date">Placed on {formatDate(order.createdAt)}</div>
          </div>
        </div>
        <span className={`order-status status-${order.status.replace(/\s+/g, '-').toLowerCase()}`}>
          {order.status}
        </span>
      </div>
      
      <div className="order-products">
        <h2>Order Items</h2>
        <table className="order-products-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map(item => (
              <tr key={item.productId} id={`product_in_order_${item.productId}`}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img className="product-image" src={item.image} alt={item.name} />
                    <span className="product-name">{item.name}</span>
                  </div>
                </td>
                <td className="product-price">${item.price.toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td className="product-price">${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="order-summary">
        <h3 className="order-summary-title">Order Summary</h3>
        <div className="order-summary-row">
          <span>Items ({order.items.reduce((sum, item) => sum + item.quantity, 0)}):</span>
          <span>${order.totalPrice.toFixed(2)}</span>
        </div>
        <div className="order-total">
          <span>Order Total:</span>
          <span>${order.totalPrice.toFixed(2)}</span>
        </div>
      </div>
      
      {order.status === 'Pending payment' && (
        <PaymentButton orderId={order.id} onSuccess={fetchOrder} />
      )}
      
      {order.status === 'Finished' && (
        <RefundButton orderId={order.id} onSuccess={fetchOrder} />
      )}
      
      <Link href="/orders" className="back-to-orders">
        Back to My Orders
      </Link>
    </div>
  )
}
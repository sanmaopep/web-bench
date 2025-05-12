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
import './order-detail.css'
import PayOrderButton from './PayOrderButton'
import RefundButton from './RefundButton'

interface OrderItem {
  id: number
  orderId: number
  productId: number
  quantity: number
  price: number
  product: {
    id: number
    name: string
    price: number
    image: string
  }
}

interface Order {
  id: number
  username: string
  status: string
  totalPrice: number
  createdAt: string
  orderItems: OrderItem[]
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`)
      const data = await response.json()

      if (data.success) {
        setOrder(data.order)
      } else {
        router.push('/login')
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching order:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrder()
  }, [params.id, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!order) {
    return <div>Order not found</div>
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
        return 'refunded'
      default:
        return 'pending'
    }
  }

  return (
    <div className="order-detail-container">
      <div className="order-detail-header">
        <h1 className="order-id">Order #{order.id}</h1>
        <div className={`order-status ${getStatusClass(order.status)}`}>{order.status}</div>
      </div>

      <table className="order-items-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.orderItems.map((item) => (
            <tr key={item.id} id={`product_in_order_${item.product.id}`}>
              <td>
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="product-image-in-order"
                />
              </td>
              <td className="product-name-in-order">{item.product.name}</td>
              <td className="product-price-in-order">${item.price}</td>
              <td className="product-quantity-in-order">{item.quantity}</td>
              <td className="product-total-in-order">${item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="order-summary">
        <div className="order-total">Order Total:</div>
        <div className="order-total-amount">${order.totalPrice}</div>
      </div>

      {order.status === 'Pending payment' && (
        <PayOrderButton
          orderId={order.id}
          totalPrice={order.totalPrice}
          onRefresh={() => {
            fetchOrder()
          }}
        />
      )}

      {order.status === 'Finished' && (
        <RefundButton
          orderId={order.id}
          onRefresh={() => {
            fetchOrder()
          }}
        />
      )}

      <Link href="/orders" className="back-to-orders">
        Back to My Orders
      </Link>
    </div>
  )
}
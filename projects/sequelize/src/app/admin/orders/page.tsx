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
import './orders-admin.css'

interface OrderItem {
  id: number
  orderId: number
  productId: number
  quantity: number
  price: number
  product: {
    id: number
    name: string
  }
}

interface Order {
  id: number
  username: string
  totalPrice: number
  status: string
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processingRefund, setProcessingRefund] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function checkUser() {
      try {
        const response = await fetch('/api/auth')
        if (response.ok) {
          const userData = await response.json()
          if (userData.role !== 'admin') {
            router.push('/login')
          } else {
            fetchOrders()
          }
        } else {
          router.push('/login')
        }
      } catch (error) {
        router.push('/login')
      }
    }

    async function fetchOrders() {
      try {
        const response = await fetch('/api/admin/orders')
        const data = await response.json()
        if (data.success) {
          setOrders(data.orders)
        } else {
          setError('Failed to load orders')
        }
      } catch (error) {
        setError('Failed to load orders')
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [router])

  const handleApproveRefund = async (orderId: number) => {
    setProcessingRefund(orderId)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/approve-refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Update the order in state
        setOrders(prev => 
          prev.map(order => 
            order.id === orderId 
              ? { ...order, status: 'Refund Passed' }
              : order
          )
        )
      } else {
        alert(data.error || 'Failed to approve refund')
      }
    } catch (error) {
      console.error('Error approving refund:', error)
      alert('An error occurred while approving the refund')
    } finally {
      setProcessingRefund(null)
    }
  }

  if (loading) return <div className="admin-loading">Loading...</div>
  if (error) return <div className="admin-error">{error}</div>

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Pending payment':
        return 'status-pending'
      case 'Finished':
        return 'status-finished'
      case 'Failed':
        return 'status-failed'
      case 'Refund Reviewing':
        return 'status-refund-reviewing'
      case 'Refund Passed':
        return 'status-refund-passed'
      default:
        return ''
    }
  }

  return (
    <div className="admin-orders-container">
      <h1>Admin Order Management</h1>
      
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Total</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} id={`admin_order_${order.id}`}>
                <td>{order.id}</td>
                <td>{order.username}</td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td className={getStatusClass(order.status)}>{order.status}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>
                  {order.status === 'Refund Reviewing' && (
                    <button 
                      className="pass-refund-review-button"
                      onClick={() => handleApproveRefund(order.id)}
                      disabled={processingRefund === order.id}
                    >
                      {processingRefund === order.id ? 'Processing...' : 'Approve Refund'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
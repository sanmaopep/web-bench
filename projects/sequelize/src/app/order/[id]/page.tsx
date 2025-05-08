'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import './order-detail.css'

interface Product {
  id: number
  name: string
  price: number
  image: string
}

interface OrderItem {
  id: number
  orderId: number
  productId: number
  quantity: number
  price: number
  product: Product
}

interface Order {
  id: number
  username: string
  totalPrice: number
  status: string
  createdAt: string
  items: OrderItem[]
}

export default function OrderDetail() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [paymentSuccess, setPaymentSuccess] = useState('')
  const [refundLoading, setRefundLoading] = useState(false)
  const [refundError, setRefundError] = useState('')
  const [refundSuccess, setRefundSuccess] = useState('')

  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        setLoading(true)
        const response = await fetch(`/api/orders/${params.id}`)
        
        if (!response.ok) {
          const errorData = await response.json()
          if (response.status === 401) {
            router.push('/login')
            return
          }
          throw new Error(errorData.error || 'Failed to fetch order')
        }
        
        const data = await response.json()
        if (data.success) {
          setOrder(data.order)
        } else {
          setError('Failed to load order details')
        }
      } catch (error) {
        console.error('Error fetching order details:', error)
        setError('Failed to load order details')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchOrderDetails()
    }
  }, [params.id, router])

  const handlePayOrder = async () => {
    if (!order || paymentLoading) return
    
    setPaymentLoading(true)
    setPaymentError('')
    setPaymentSuccess('')
    
    try {
      const response = await fetch(`/api/orders/${order.id}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setPaymentSuccess('Payment successful!')
        setOrder(prev => prev ? {...prev, status: 'Finished'} : null)
      } else {
        setPaymentError(data.error || 'Payment failed')
        // Refresh order to get updated status
        const orderResponse = await fetch(`/api/orders/${params.id}`)
        const orderData = await orderResponse.json()
        if (orderData.success) {
          setOrder(orderData.order)
        }
      }
    } catch (error) {
      console.error('Payment error:', error)
      setPaymentError('An unexpected error occurred')
    } finally {
      setPaymentLoading(false)
    }
  }

  const handleRefundRequest = async () => {
    if (!order || refundLoading) return
    
    setRefundLoading(true)
    setRefundError('')
    setRefundSuccess('')
    
    try {
      const response = await fetch(`/api/orders/${order.id}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setRefundSuccess('Refund request submitted!')
        setOrder(prev => prev ? {...prev, status: 'Refund Reviewing'} : null)
      } else {
        setRefundError(data.error || 'Refund request failed')
        // Refresh order to get updated status
        const orderResponse = await fetch(`/api/orders/${params.id}`)
        const orderData = await orderResponse.json()
        if (orderData.success) {
          setOrder(orderData.order)
        }
      }
    } catch (error) {
      console.error('Refund request error:', error)
      setRefundError('An unexpected error occurred')
    } finally {
      setRefundLoading(false)
    }
  }

  if (loading) {
    return <div className="order-loading">Loading order details...</div>
  }

  if (error || !order) {
    return (
      <div className="order-empty">
        <h2>{error || 'Order not found'}</h2>
        <Link href="/orders" className="back-to-orders">
          Back to My Orders
        </Link>
      </div>
    )
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
      case 'Refund Reviewing':
        return 'refund-reviewing'
      case 'Refund Passed':
        return 'refund-passed'
      default:
        return ''
    }
  }

  return (
    <div className="order-detail-container">
      <div className="order-detail-header">
        <h1>Order #{order.id}</h1>
        <div className={`order-status ${getStatusClass(order.status)}`}>
          {order.status}
        </div>
      </div>

      <table className="order-products-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id} id={`product_in_order_${item.productId}`}>
              <td>
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="order-product-image"
                />
              </td>
              <td>{item.product.name}</td>
              <td>${item.price}</td>
              <td>{item.quantity}</td>
              <td>${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="order-summary">
        <div className="order-summary-item">
          <span>Order Date:</span>
          <span>{new Date(order.createdAt).toLocaleString()}</span>
        </div>
        <div className="order-summary-item">
          <span>Order Status:</span>
          <span>{order.status}</span>
        </div>
        <div className="order-summary-item">
          <span>Total:</span>
          <span>${order.totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {order.status === 'Pending payment' && (
        <div className="payment-controls">
          <button 
            className="pay-my-order"
            onClick={handlePayOrder}
            disabled={paymentLoading}
          >
            {paymentLoading ? 'Processing...' : 'Pay My Order'}
          </button>
        </div>
      )}

      {(order.status === 'Finished') && (
        <div className="payment-controls">
          <button 
            className="refund-button"
            onClick={handleRefundRequest}
            disabled={refundLoading}
          >
            {refundLoading ? 'Processing...' : 'Request Refund'}
          </button>
        </div>
      )}

      {paymentError && <div className="payment-error">{paymentError}</div>}
      {paymentSuccess && <div className="payment-success">{paymentSuccess}</div>}
      {refundError && <div className="payment-error">{refundError}</div>}
      {refundSuccess && <div className="payment-success">{refundSuccess}</div>}

      <Link href="/orders" className="back-to-orders">
        Back to My Orders
      </Link>
    </div>
  )
}
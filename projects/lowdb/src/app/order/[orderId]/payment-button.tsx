'use client'

import { useState } from 'react'
import './payment-button.css'

interface PaymentButtonProps {
  orderId: string
  onSuccess: () => void
}

export default function PaymentButton({ orderId, onSuccess }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/orders/${orderId}/pay`, {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('Payment successful!')
        onSuccess()
      } else {
        alert(`Payment failed: ${data.error}`)
        onSuccess() // Refresh to see updated status
      }
    } catch (error) {
      alert('An error occurred during payment')
      console.error('Payment error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      className="pay-my-order" 
      onClick={handlePayment}
      disabled={loading}
    >
      {loading ? 'Processing...' : 'Pay Now'}
    </button>
  )
}
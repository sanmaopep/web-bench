'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import './orders.css'

export default function RefundReviewButton({ orderId }: { orderId: number }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const handlePassRefund = async () => {
    setIsProcessing(true)

    try {
      const response = await fetch(`/api/orders/${orderId}/refund/approve`, {
        method: 'POST',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Failed to approve refund')
      }
    } catch (error) {
      console.error('Error approving refund:', error)
      alert('Failed to approve refund')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <button
      className="pass-refund-review-button"
      onClick={handlePassRefund}
      disabled={isProcessing}
    >
      {isProcessing ? 'Processing...' : 'Approve Refund'}
    </button>
  )
}

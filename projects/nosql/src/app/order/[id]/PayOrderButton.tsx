'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PayOrderButton({ orderId }: { orderId: string }) {
  const [isPaying, setIsPaying] = useState(false)
  const router = useRouter()

  const handlePay = async () => {
    setIsPaying(true)
    try {
      await fetch(`/api/orders/${orderId}/pay`, {
        method: 'POST',
      })
    } catch (error) {
      console.error('Payment failed:', error)
    } finally {
      router.refresh()
    }

    setIsPaying(false)
  }

  return (
    <button className="pay-my-order" onClick={handlePay} disabled={isPaying}>
      {isPaying ? 'Processing...' : 'Pay Now'}
    </button>
  )
}

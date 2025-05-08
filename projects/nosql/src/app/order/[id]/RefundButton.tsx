'use client'

import { useRouter } from 'next/navigation'

export default function RefundButton({ orderId }: { orderId: string }) {
  const router = useRouter()

  const handleRefund = async () => {
    const response = await fetch(`/api/orders/${orderId}/refund`, {
      method: 'POST'
    })

    if (response.ok) {
      router.refresh()
    }
  }

  return (
    <button className="refund-button" onClick={handleRefund}>
      Request Refund
    </button>
  )
}
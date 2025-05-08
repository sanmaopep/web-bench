'use client'

import { useRouter } from 'next/navigation'

export default function PassRefundButton({ orderId }: { orderId: string }) {
  const router = useRouter()

  const handlePass = async () => {
    const response = await fetch(`/api/orders/${orderId}/refund/pass`, {
      method: 'POST'
    })

    if (response.ok) {
      router.refresh()
    }
  }

  return (
    <button className="pass-refund-review-button" onClick={handlePass}>
      Pass Refund
    </button>
  )
}
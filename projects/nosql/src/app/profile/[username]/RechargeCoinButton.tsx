'use client'

import { useRouter } from 'next/navigation'

export default function RechargeCoinButton() {
  const router = useRouter()

  const handleRecharge = async () => {
    const response = await fetch('/api/users/recharge', {
      method: 'POST'
    })
    if (response.ok) {
      router.refresh()
    }
  }

  return (
    <button className="recharge-button" onClick={handleRecharge}>
      Recharge 1000 Coins
    </button>
  )
}
'use client'

import { useState } from 'react'
import { rechargeCoin } from '@/actions/recharge'
import { useRouter } from 'next/navigation'

export default function RechargeButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRecharge = async () => {
    setLoading(true)
    try {
      const result = await rechargeCoin()
      if (result.success) {
        router.refresh()
      } else {
        alert('Failed to recharge: ' + result.error)
      }
    } catch (error) {
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      className="recharge-button" 
      onClick={handleRecharge}
      disabled={loading}
    >
      {loading ? 'Processing...' : 'Recharge 1000 Coins'}
    </button>
  )
}
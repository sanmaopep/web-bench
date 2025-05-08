'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import './recharge-button.css'

export default function RechargeButton({ username }: { username: string }) {
  const [isRecharging, setIsRecharging] = useState(false)
  const router = useRouter()

  const handleRecharge = async () => {
    setIsRecharging(true)
    
    try {
      const response = await fetch(`/api/users/${username}/recharge`, {
        method: 'POST',
      })
      
      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Error recharging:', error)
    } finally {
      setIsRecharging(false)
    }
  }

  return (
    <button 
      onClick={handleRecharge} 
      className="recharge-button"
      disabled={isRecharging}
    >
      {isRecharging ? 'Recharging...' : 'Recharge 1000 Coins'}
    </button>
  )
}
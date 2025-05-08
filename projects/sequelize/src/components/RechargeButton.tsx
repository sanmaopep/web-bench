'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import './rechargeButton.css'

interface RechargeButtonProps {
  username: string
}

export default function RechargeButton({ username }: RechargeButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleRecharge = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/recharge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      })
      
      if (response.ok) {
        // Refresh the page to show updated coin amount
        router.refresh()
      } else {
        console.error('Recharge failed')
      }
    } catch (error) {
      console.error('Recharge error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button 
      className="recharge-button" 
      onClick={handleRecharge}
      disabled={isLoading}
    >
      {isLoading ? 'Processing...' : 'Recharge 1000 Coins'}
    </button>
  )
}
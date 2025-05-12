// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
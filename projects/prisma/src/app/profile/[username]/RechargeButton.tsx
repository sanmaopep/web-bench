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
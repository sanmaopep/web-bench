'use client'

import { useState } from 'react'
import './referral-code.css'

export default function ReferralCode({ referralCode }: { referralCode: string }) {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    setIsCopied(true);
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }

  return (
    <div className="referral-section">
      <h3 className="referral-title">Invite Friends & Earn Rewards</h3>
      
      <div className="referral-code-container">
        <span className="referral-code-label">Your Referral Code:</span>
        <div className="referral-code">{referralCode}</div>
        <button 
          className="copy-referral-code" 
          onClick={copyToClipboard}
        >
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      
      <p className="referral-rules">
        When a new user registers through your referral code, you will earn $888, and an additional $1888 when they pay for their first order.
      </p>
    </div>
  )
}
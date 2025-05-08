'use client'

import { useState } from 'react'
import './referralCode.css'

interface ReferralCodeProps {
  code: string
}

export default function ReferralCode({ code }: ReferralCodeProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="referral-code-container">
      <h3>Your Referral Code</h3>
      <div className="referral-code-box">
        <span className="referral-code">{code}</span>
        <button 
          className="copy-referral-code" 
          onClick={handleCopy}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="referral-info">
        <p>When a new user registers through your referral code, you will earn $888, and an additional $1888 when they pay for their first order.</p>
      </div>
    </div>
  )
}
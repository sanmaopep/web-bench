import React, { useState, useEffect, useRef, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import styled, { keyframes } from 'styled-components'

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const TooltipContainer = styled.div.attrs({ className: 'tooltip' })<{
  $pos: { top: number; left: number; transform: string }
  className?: string
}>`
  position: fixed;
  top: ${(props) => props.$pos.top}px;
  left: ${(props) => props.$pos.left}px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease-out;
  pointer-events: none;
  transform: ${(props) => props.$pos.transform};
  margin-top: -10px;
`

const Wrapper = styled.div`
  display: inline-block;
`

interface TooltipProps {
  text: string
  children: ReactNode
  mode?: 'top' | 'bottom'
  className?: string
}

export const Tooltip = ({ text, children, mode = 'bottom', className }: TooltipProps) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0, transform: 'translateX(-50%)' })
  const targetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (showTooltip && targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect()

      if (mode === 'top') {
        setTooltipPos({
          top: rect.top,
          left: rect.left + rect.width / 2,
          transform: 'translate(-50%, -100%)',
        })
      } else {
        setTooltipPos({
          top: rect.bottom,
          left: rect.left + rect.width / 2,
          transform: 'translate(-50%, 50%)',
        })
      }
    }
  }, [showTooltip])

  return (
    <Wrapper
      ref={targetRef}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip &&
        createPortal(
          <TooltipContainer $pos={tooltipPos} className={className}>
            {text}
          </TooltipContainer>,
          document.body
        )}
    </Wrapper>
  )
}

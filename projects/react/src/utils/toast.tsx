import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

interface ToastProps {
  message: string
  duration?: number
  style?: React.CSSProperties
  onClose: () => void
}

const Toast: React.FC<ToastProps> = ({ message, duration = 2000, style, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div
      style={{
        backgroundColor: 'green',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        position: 'fixed',
        zIndex: 9999,
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        textWrap: 'nowrap',
        fontSize: 12,
        ...style,
      }}
    >
      {message}
    </div>
  )
}

let toastContainer: HTMLDivElement | null = null

export const showToast = (message: string, duration?: number, style?: React.CSSProperties) => {
  if (!toastContainer) {
    toastContainer = document.createElement('div')
    document.body.appendChild(toastContainer)
  }

  const toastId = Date.now()

  const handleClose = () => {
    if (toastContainer) {
      ReactDOM.unmountComponentAtNode(toastContainer)
    }
  }

  ReactDOM.render(
    <div
      style={{
        position: 'fixed',
        top: `10px`,
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      <Toast
        key={toastId}
        message={message}
        duration={duration}
        style={style}
        onClose={handleClose}
      />
    </div>,
    toastContainer
  )
}

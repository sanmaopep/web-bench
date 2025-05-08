import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import styled, { keyframes, ThemeProvider } from 'styled-components'
import { createPortal } from 'react-dom'
import { currentThemeRef } from '../context/ThemeContext'

const slideIn = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`

const slideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`

const ToastContainer = styled.div<{ $isClosing: boolean }>`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({ theme }) => theme.toastBackground || '#4caf50'};
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 9999;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  animation: ${({ $isClosing }) => ($isClosing ? slideOut : slideIn)} 0.3s ease-in-out;
`

let toastTimeout: NodeJS.Timeout | null = null

export const showToast = (message: string) => {
  const Toast = () => {
    const [isClosing, setIsClosing] = useState(false)
    const [show, setShow] = useState(true)

    useEffect(() => {
      if (toastTimeout) {
        clearTimeout(toastTimeout)
      }

      toastTimeout = setTimeout(() => {
        setIsClosing(true)
        setTimeout(() => {
          setShow(false)
        }, 300)
      }, 2000)

      return () => {
        if (toastTimeout) {
          clearTimeout(toastTimeout)
        }
      }
    }, [])

    if (!show) return null

    return createPortal(
      <ThemeProvider theme={currentThemeRef.current || {}}>
        <ToastContainer className="toast" $isClosing={isClosing}>
          {message}
        </ToastContainer>
      </ThemeProvider>,
      document.body
    )
  }

  const toastRoot = document.getElementById('toast-root')
  if (toastRoot) {
    toastRoot.innerHTML = ''
  }

  const container = document.createElement('div')
  container.id = 'toast-root'
  document.body.appendChild(container)

  ReactDOM.createRoot(container).render(<Toast />)
}

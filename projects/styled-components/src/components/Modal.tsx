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

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import styled, { keyframes } from 'styled-components'

interface ModalProps {
  title: JSX.Element
  content: JSX.Element
  className?: string
  isOpen: boolean
  onClose: () => void
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 0.3;
  }
`

const slideIn = keyframes`
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #999999;
  opacity: 0.3;
  animation: ${fadeIn} 0.3s ease-in-out;
`

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  min-width: 500px;
  max-width: 80%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  z-index: 1001;
  animation: ${slideIn} 0.3s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  color: #666;
  transition: color 0.2s;

  &:hover {
    color: #000;
  }
`

const Modal: React.FC<ModalProps> = ({ title, content, className, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <ModalContainer className={`modal ${className || ''}`}>
      <ModalOverlay className="modal-overlay" onClick={onClose} />
      <ModalContent>
        <ModalHeader>
          {title}
          <CloseButton className="close-btn" onClick={onClose}>
            ×
          </CloseButton>
        </ModalHeader>
        {content}
      </ModalContent>
    </ModalContainer>,
    document.body
  )
}

export default Modal

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

import styled, { keyframes } from 'styled-components'
import StyledButton from './Button'
import { Tooltip } from './Tooltip'
import Modal from './Modal'
import { useState } from 'react'

const StyledFooter = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.footerBackground};
  color: white;
  padding: 1rem;
  text-align: center;
  z-index: 1000;
  box-sizing: border-box;
`

const FooterButton = styled(StyledButton)`
  background-color: transparent;
  color: #0095ee;
`

const StyledModal = styled(Modal)`
  .modal-overlay {
    background-color: #ff69b4;
  }
`

const swing = keyframes`
  0%, 100% {
    transform: rotate(-45deg);
  }
  50% {
    transform: rotate(45deg);
  }
`

const AnimalContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding: 20px;
`

const Animal = styled.div.attrs({ className: 'animal' })`
  font-size: 2rem;
  animation: ${swing} 2s ease-in-out infinite;
  display: inline-block;
  padding: 10px;

  &:hover {
    cursor: pointer;
    transform: scale(1.2);
  }
`

const StyledTooltip = styled(Tooltip)`
  font-size: 50px;
  padding: 16px 20px;
  background-color: #444;

  &::before {
    border-color: transparent transparent #444 transparent;
  }
`

export const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const animals = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼']

  const modalTitle = <h2>My Friends</h2>
  const modalContent = (
    <AnimalContainer>
      {animals.map((animal, index) => (
        <Animal key={index}>{animal}</Animal>
      ))}
    </AnimalContainer>
  )

  return (
    <StyledFooter className="site-footer">
      Footer
      <StyledTooltip text="🐶🐱🐭🐹🐰🦊🐻🐼" mode="top">
        <FooterButton $type="secondary" onClick={() => setIsModalOpen(true)}>
          My Friends
        </FooterButton>
      </StyledTooltip>
      <StyledModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        content={modalContent}
      />
    </StyledFooter>
  )
}

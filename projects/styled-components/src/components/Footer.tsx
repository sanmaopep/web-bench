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

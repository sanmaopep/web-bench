import styled from 'styled-components'

const StyledButton = styled.button<{ $type: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  margin-left: 1rem;
  background-color: ${({ $type, theme }) =>
    $type === 'primary'
      ? theme.buttonPrimary
      : $type === 'secondary'
      ? theme.buttonSecondary
      : theme.buttonDanger};
  transition: opacity 0.3s ease, transform 0.3s ease;

  &:hover {
    opacity: 0.7;
  }

  &:focus {
    transform: scale(1.2);
    outline: none;
  }
`

export default StyledButton

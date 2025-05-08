import styled from 'styled-components'
import StyledButton from './Button'
import { Tooltip } from './Tooltip'

const StyledHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.headerBackground};
  color: white;
  padding: 1rem;
  text-align: center;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
`

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
`

interface HeaderProps {
  onPageChange: (page: string) => void
}

export const Header = ({ onPageChange }: HeaderProps) => {
  return (
    <StyledHeader className="site-header">
      <HeaderContent>
        <span>Hello Blog</span>
      </HeaderContent>
      <HeaderContent>
        <HeaderContent>
          <Tooltip text="🪄">
            <StyledButton $type="primary" onClick={() => onPageChange('add')}>
              Add Blog
            </StyledButton>
          </Tooltip>
          <Tooltip text="🍉">
            <StyledButton $type="secondary" onClick={() => onPageChange('read')}>
              Read Blogs
            </StyledButton>
          </Tooltip>
          <Tooltip text="🎨">
            <StyledButton $type="danger" onClick={() => onPageChange('manage')}>
              Theme
            </StyledButton>
          </Tooltip>
        </HeaderContent>
      </HeaderContent>
    </StyledHeader>
  )
}

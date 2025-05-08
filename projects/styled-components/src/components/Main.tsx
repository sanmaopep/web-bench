import styled, { keyframes } from 'styled-components'
import { AddBlog } from './AddBlog'
import { ReadBlogs } from './ReadBlogs'
import { ThemePage } from './ThemePage'

const StyledMain = styled.main`
  margin-top: 60px;
  margin-bottom: 60px;
  min-height: calc(100vh - 120px);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f4f4f4;
  position: relative;
  overflow: hidden;
`

const WelcomeMessage = styled.h1`
  color: #333;
  font-size: 2.5rem;
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const fadeIn = keyframes`
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0);
  }
`

const PageContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 1s ease-in-out;
`

interface MainProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export const Main = ({ currentPage, onPageChange }: MainProps) => {
  const renderContent = (page: string) => {
    switch (page) {
      case 'add':
        return (
          <AddBlog
            onBlogAdded={() => {
              onPageChange('read')
            }}
          />
        )
      case 'read':
        return <ReadBlogs />
      case 'manage':
        return <ThemePage />
      default:
        return <WelcomeMessage>Welcome to Blog System</WelcomeMessage>
    }
  }

  return (
    <StyledMain className="site-main">
      <PageContainer key={currentPage}>{renderContent(currentPage)}</PageContainer>
    </StyledMain>
  )
}

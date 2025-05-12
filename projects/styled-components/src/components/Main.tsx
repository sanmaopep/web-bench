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

import styled, { keyframes } from 'styled-components'
import { useBlogContext } from '../context/BlogContext'
import { useState, useEffect } from 'react'
import { Markdown } from './Markdown'

const ReadBlogsContainer = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 80%;

  > h1 {
    color: #333;
    margin-bottom: 2rem;
    text-align: center;
    font-size: 2.5rem;
  }
`

const FlexContainer = styled.div`
  display: flex;
  gap: 1rem;
`

const BlogList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 200px;
`

const BlogItem = styled.div.attrs({ className: 'list-item' })`
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #0064fa;
  transition: transform 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateX(10px);
    background: #e9ecef;
  }

  font-size: 1.2rem;
  color: #495057;
`

const fadeInFromBottom = keyframes`
  from {
    opacity: 0;
    transform: translateY(100%);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`

const BlogContent = styled.div.attrs({ className: 'blog-content' })<{ $isNewBlog?: boolean }>`
  flex-grow: 1;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 1.1rem;
  line-height: 1.6;
  color: #495057;
  min-height: 100px;
  position: relative;
  overflow: hidden;

  // Use different animations based on a data attribute
  animation: ${({ $isNewBlog }: { $isNewBlog?: boolean }) =>
      $isNewBlog ? fadeInFromBottom : fadeIn}
    1s ease-in-out;
`

export const ReadBlogs = () => {
  const { blogs, selectedBlog, setSelectedBlogTitle } = useBlogContext()
  const [key, setKey] = useState(0)

  const [isNewBlog, setIsNewBlog] = useState(false)

  useEffect(() => {
    const isFromSubmit = sessionStorage.getItem('newBlogSubmitted')
    if (isFromSubmit) {
      setIsNewBlog(true)
      sessionStorage.removeItem('newBlogSubmitted')
    }
  }, [])

  const handleBlogClick = (title: string) => {
    setIsNewBlog(false)

    setKey((prev) => prev + 1)
    setSelectedBlogTitle(title)
  }

  return (
    <ReadBlogsContainer>
      <h1>Read Blogs</h1>

      <FlexContainer>
        <BlogList>
          {blogs.map((blog, index) => (
            <BlogItem key={index} onClick={() => handleBlogClick(blog.title)}>
              {blog.title}
            </BlogItem>
          ))}
        </BlogList>
        {selectedBlog && (
          <BlogContent $isNewBlog={isNewBlog} key={key}>
            <Markdown content={selectedBlog.content}></Markdown>
          </BlogContent>
        )}
      </FlexContainer>
    </ReadBlogsContainer>
  )
}

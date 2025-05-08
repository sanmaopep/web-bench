import styled from 'styled-components'
import { BlogForm } from './BlogForm'
import { useBlogContext } from '../context/BlogContext'
import { showToast } from '../utils/toast'

const AddBlogContainer = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 800px;

  h1 {
    color: #333;
    margin-bottom: 2rem;
    text-align: center;
    font-size: 2.5rem;
  }
`

interface AddBlogProps {
  onBlogAdded: () => void
}

export const AddBlog = ({ onBlogAdded }: AddBlogProps) => {
  const { addBlog, setSelectedBlogTitle } = useBlogContext()

  const handleSubmit = (title: string, content: string) => {
    addBlog({ title, content })
    setSelectedBlogTitle(title)
    showToast('New Blog Created Successfully!')
    // Set flag in sessionStorage to indicate new blog submission
    sessionStorage.setItem('newBlogSubmitted', 'true')
    onBlogAdded()
  }

  return (
    <AddBlogContainer>
      <h1>Add Blog</h1>
      <BlogForm onSubmit={handleSubmit} />
    </AddBlogContainer>
  )
}

import styled from 'styled-components'
import StyledButton from './Button'
import { useState } from 'react'
import Modal from './Modal'
import { Markdown } from './Markdown'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`

const Input = styled.input`
  padding: 0.8rem;
  font-size: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 4px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #0064fa;
  }
`

const TextArea = styled.textarea`
  padding: 0.8rem;
  font-size: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 4px;
  min-height: 200px;
  resize: vertical;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #0064fa;
  }
`

const SubmitButton = styled(StyledButton)`
  align-self: flex-end;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
`

const PreviewButton = styled(StyledButton)`
  float: right;
  padding: 0.8rem 2rem;
  margin-top: 10px;
  font-size: 1.1rem;
`

interface BlogFormProps {
  onSubmit: (title: string, content: string) => void
  initialTitle?: string
  initialContent?: string
}

export const BlogForm = ({ onSubmit, initialTitle = '', initialContent = '' }: BlogFormProps) => {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)

  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const handlePreview = () => {
    setIsPreviewOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && content.trim()) {
      onSubmit(title, content)
    }
  }

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextArea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <SubmitButton className="submit-btn" $type="primary" type="submit">
          Submit Blog
        </SubmitButton>
      </Form>
      <PreviewButton className="preview-btn" $type="secondary" onClick={handlePreview}>
        Preview Blog
      </PreviewButton>
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={<h2>Preview Blog Markdown</h2>}
        content={<Markdown content={content} />}
      />
    </>
  )
}

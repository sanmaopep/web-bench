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

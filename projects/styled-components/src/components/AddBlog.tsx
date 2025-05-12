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

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

import React from 'react'
import { useDelete } from '../hooks/useDelete'
import { useEdit } from '../hooks/useEdit'
import useMarkdown from '../hooks/useMarkdown'
import BlogForm from './BlogForm'
import Comments from './Comments'
import TruncatedTitle from './TruncatedTitle'

function Blog({ title, detail }) {
  const handleDelete = useDelete();
  const { isEditFormVisible, setIsEditFormVisible, handleEdit } = useEdit();
  const { convertMarkdown } = useMarkdown();

  return (
    <div style={{ position: 'relative' }}>
      <button
        className="delete-btn"
        onClick={handleDelete}
        style={{
          position: 'absolute',
          top: '0',
          right: '100px',
          backgroundColor: '#ff4d4d',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'background-color 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#ff3333'
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#ff4d4d'
        }}
      >
        Delete
      </button>
      <button
        className="edit-btn"
        onClick={() => setIsEditFormVisible(true)}
        style={{
          position: 'absolute',
          top: '0',
          right: '0',
          backgroundColor: '#4A90E2',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'background-color 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#357ABD'
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#4A90E2'
        }}
      >
        Edit
      </button>
      <h2 className="blog-title" style={{
        width: 'fit-content',
        fontSize: '24px'
      }}>
        <TruncatedTitle title={title} />
      </h2>
      <div 
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: convertMarkdown(detail) }}
        style={{
          lineHeight: '1.6',
          '& code': {
            backgroundColor: '#f5f5f5',
            padding: '2px 4px',
            borderRadius: '4px',
            fontSize: '0.9em'
          },
          '& pre': {
            backgroundColor: '#f5f5f5',
            padding: '1em',
            borderRadius: '4px',
            overflowX: 'auto'
          },
          '& img': {
            maxWidth: '100%',
            height: 'auto'
          },
          '& a': {
            color: '#4A90E2',
            textDecoration: 'none'
          },
          '& a:hover': {
            textDecoration: 'underline'
          }
        }}
      />
      <BlogForm 
        isVisible={isEditFormVisible}
        onClose={() => setIsEditFormVisible(false)}
        isEdit={true}
        initialTitle={title}
        initialDetail={detail}
        onEdit={handleEdit}
      />
      <Comments blogTitle={title} />
    </div>
  )
}

export default Blog
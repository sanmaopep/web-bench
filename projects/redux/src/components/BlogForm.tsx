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

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './BlogForm.css';
import { toggleFormVisibility } from '../models/blogForm';
import { addBlog, updateBlog } from '../models/blog';
import { RootState } from '../store';
import { parseMarkdown } from '../utils/markdown';

const BlogForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const dispatch = useDispatch();
  const blogs = useSelector((state: RootState) => state.blog.blogs);
  const isEditing = useSelector((state: RootState) => state.blogForm.isEditing);
  const selectedBlogIndex = useSelector((state: RootState) => state.blog.selectedBlogIndex);
  const selectedBlog = blogs[selectedBlogIndex];
  const username = useSelector((state: RootState) => state.user.username);

  useEffect(() => {
    if (isEditing && selectedBlog) {
      setTitle(selectedBlog.title);
      setDetail(selectedBlog.detail);
    }
  }, [isEditing, selectedBlog]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      // Check for duplicate title if title changed
      if (title !== selectedBlog.title) {
        const isDuplicate = blogs.some(blog => blog.title === title);
        
        if (isDuplicate) {
          setTitleError(true);
          return;
        }
      }
      
      // Update existing blog
      dispatch(updateBlog({ title, detail }));
    } else {
      // Check for duplicate title
      const isDuplicate = blogs.some(blog => blog.title === title);
      
      if (isDuplicate) {
        setTitleError(true);
        return;
      }
      
      // Add new blog with author
      dispatch(addBlog({ title, detail, author: username || undefined }));
    }
    
    // Reset form
    setTitle('');
    setDetail('');
    setTitleError(false);
    dispatch(toggleFormVisibility());
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setTitleError(false);
  };

  const handleClose = () => {
    dispatch(toggleFormVisibility());
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{isEditing ? 'Edit Blog' : 'Create Blog'}</h2>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input 
              type="text" 
              id="title" 
              value={title} 
              onChange={handleTitleChange} 
              required 
              style={{ borderColor: titleError ? 'red' : '#ddd' }}
            />
            {titleError && <span style={{ color: 'red', fontSize: '14px' }}>Title already exists</span>}
          </div>
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label htmlFor="detail">Detail</label>
              <button 
                type="button" 
                onClick={togglePreview} 
                style={{ 
                  backgroundColor: '#f0f0f0',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  cursor: 'pointer'
                }}
              >
                {previewMode ? 'Edit' : 'Preview'}
              </button>
            </div>
            {previewMode ? (
              <div 
                className="markdown-preview"
                style={{ 
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '10px',
                  minHeight: '120px',
                  backgroundColor: '#f9f9f9'
                }}
                dangerouslySetInnerHTML={{ __html: parseMarkdown(detail) }}
              />
            ) : (
              <textarea 
                id="detail" 
                value={detail} 
                onChange={(e) => setDetail(e.target.value)} 
                required 
                placeholder="You can use Markdown syntax here"
              />
            )}
          </div>
          <button type="submit" className="submit-btn">{isEditing ? 'Update' : 'Create'}</button>
        </form>
      </div>
    </div>
  );
};

export default BlogForm;
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

import React, { useMemo } from 'react'
import Blog from './Blog'
import { useAtom } from 'jotai'
import { blogAtom, selectedBlogAtom } from '../atoms/blog'

interface Blog {
  title: string
  detail: string
}

interface BlogListProps {
  blogs: Blog[]
}

const BlogList: React.FC<BlogListProps> = ({ blogs }) => {
  const [selectedIndex, setSelectedIndex] = useAtom(selectedBlogAtom)

  // Only render the visible items to prevent performance issues with large lists
  const visibleBlogs = useMemo(() => {
    // Show only the first 100 items by default
    return blogs.slice(0, 100);
  }, [blogs]);

  return (
    <div style={{ width: '300px', borderRight: '1px solid #ccc', paddingRight: '20px' }}>
      <div style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
        Showing {visibleBlogs.length} of {blogs.length} blogs
      </div>
      {visibleBlogs.map((blog, index) => (
        <div 
          key={index} 
          className="list-item"
          onClick={() => setSelectedIndex(index)}
          style={{
            backgroundColor: selectedIndex === index ? '#e3f2fd' : 'white',
            color: selectedIndex === index ? '#1976d2' : 'inherit',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            margin: '4px 0',
            fontWeight: selectedIndex === index ? '600' : '400'
          }}
        >
          {blog.title}
        </div>
      ))}
    </div>
  )
}

export default BlogList
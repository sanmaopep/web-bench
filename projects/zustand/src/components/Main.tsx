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
import Blog from './Blog'
import BlogList from './BlogList'
import Search from './Search'
import useBlogStore from '../stores/blog'

const Main = () => {
  const { blogs, filteredBlogs, selectedBlogIndex } = useBlogStore()
  const displayBlogs = filteredBlogs.length > 0 ? filteredBlogs : blogs
  
  return (
    <main style={{
      flex: 1,
      padding: '20px',
      display: 'flex',
      flexDirection: 'row'
    }}>
      <div style={{ width: '300px', marginRight: '20px' }}>
        <Search />
        <BlogList blogs={displayBlogs} />
      </div>
      <div style={{ flex: 1 }}>
        {displayBlogs.length === 0 ? (
          <div>No Blog</div>
        ) : (
          <Blog {...displayBlogs[selectedBlogIndex]} selectedIndex={selectedBlogIndex} />
        )}
      </div>
    </main>
  )
}

export default Main
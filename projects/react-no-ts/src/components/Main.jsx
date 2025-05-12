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

import React, { useState, useMemo, useCallback } from 'react'
import Blog from './Blog'
import BlogList from './BlogList'
import Search from './Search'
import { useBlog } from '../context/BlogContext'

function Main() {
  const { blogs, selectedBlog, setSelectedBlog } = useBlog();
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredBlogs = useMemo(() => {
    return blogs.filter(blog => 
      blog.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [blogs, searchKeyword]);

  const handleSearch = useCallback((keyword) => {
    setSearchKeyword(keyword);
  }, []);

  const handleSelectBlog = useCallback((blog) => {
    setSelectedBlog(blog);
  }, [setSelectedBlog]);

  return (
    <main style={{
      padding: '20px',
      flex: 1,
      display: 'flex',
      gap: '20px',
      backgroundColor: '#fff'
    }}>
      <div>
        <Search onSearch={handleSearch} />
        <BlogList 
          blogs={filteredBlogs} 
          selectedBlog={selectedBlog}
          onSelectBlog={handleSelectBlog}
        />
      </div>
      <div style={{flex: 1}}>
        <Blog title={selectedBlog.title} detail={selectedBlog.detail} />
      </div>
    </main>
  )
}

export default React.memo(Main)
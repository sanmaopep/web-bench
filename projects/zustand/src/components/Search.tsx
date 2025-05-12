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

import React, { useState, useEffect } from 'react'
import useBlogStore from '../stores/blog'

const Search = () => {
  const [keywords, setKeywords] = useState('')
  const { fetchSearchBlogs } = useBlogStore()

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchSearchBlogs(keywords)
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [keywords, fetchSearchBlogs])

  return (
    <div style={{ marginBottom: '16px' }}>
      <input
        type="text"
        placeholder="Search Blogs"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        style={{
          width: '200px',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          boxSizing: 'border-box'
        }}
      />
    </div>
  )
}

export default Search
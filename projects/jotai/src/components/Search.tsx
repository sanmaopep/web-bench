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
import { useAtom } from 'jotai'
import { searchKeywordsAtom, fetchFilteredBlogsAtom } from '../atoms/blog'

const Search: React.FC = () => {
  const [inputValue, setInputValue] = useState('')
  const [, setSearchKeywords] = useAtom(searchKeywordsAtom)
  const [, fetchFilteredBlogs] = useAtom(fetchFilteredBlogsAtom)

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchKeywords(inputValue)
      fetchFilteredBlogs(inputValue)
    }, 300)
    return () => clearTimeout(handler)
  }, [inputValue])

  return (
    <div style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Search Blogs"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{
          width: '200px',
          boxSizing: 'border-box',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ddd',
          outline: 'none'
        }}
      />
    </div>
  )
}

export default Search
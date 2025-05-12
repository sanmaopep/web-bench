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
import { observer } from 'mobx-react-lite'
import blogStore from '../stores/blog'

const Search = observer(() => {
  const [keywords, setKeywords] = React.useState('')
  const [timer, setTimer] = React.useState<NodeJS.Timeout>()

  const handleSearch = (value: string) => {
    if (value.trim() === '') {
      blogStore.setFilteredBlogs([])
      return
    }
    blogStore.searchBlogs(value)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setKeywords(value)
    
    if (timer) {
      clearTimeout(timer)
    }
    
    const newTimer = setTimeout(() => {
      handleSearch(value)
    }, 300)
    
    setTimer(newTimer)
  }

  React.useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [timer])

  return (
    <div style={{ width: '200px', boxSizing: 'border-box', padding: '10px' }}>
      <input
        type="text"
        placeholder="Search Blogs"
        value={keywords}
        onChange={handleChange}
        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
      />
    </div>
  )
})

export default Search
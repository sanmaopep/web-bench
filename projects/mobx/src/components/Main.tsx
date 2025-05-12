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
import { observer } from 'mobx-react-lite'
import blogStore from '../stores/blog'

const Main = observer(() => {
  const selectedBlog = blogStore.selectedBlog
  return (
    <main style={{ padding: '20px', textAlign: 'left', display: 'flex' }}>
      <div style={{ width: '300px', borderRight: '1px solid #ccc' }}>
        <Search />
        <BlogList
          blogs={blogStore.filteredBlogs.length > 0 ? blogStore.filteredBlogs : blogStore.blogs}
        />
      </div>
      <div style={{ flex: 1, paddingLeft: '20px' }}>
        {selectedBlog ? (
          <Blog 
            title={selectedBlog.title} 
            detail={selectedBlog.detail} 
            author={selectedBlog.author}
          />
        ) : (
          <div>No Blog</div>
        )}
      </div>
    </main>
  )
})

export default Main
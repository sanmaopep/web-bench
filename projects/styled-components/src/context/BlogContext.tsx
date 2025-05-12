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

import React, { createContext, useContext, useMemo, useState } from 'react'

interface Blog {
  title: string
  content: string
}

interface BlogContextType {
  blogs: Blog[]
  selectedBlog?: Blog
  selectedBlogTitle: string
  setSelectedBlogTitle: (title: string) => void
  addBlog: (blog: Blog) => void
  updateBlog: (title: string, newBlog: Blog) => void
  removeBlog: (title: string) => void
}

const BlogContext = createContext<BlogContextType>({
  blogs: [],
  selectedBlogTitle: '',
  addBlog: () => {},
  removeBlog: () => {},
  updateBlog: () => {},
  setSelectedBlogTitle: () => {},
})

export const useBlogContext = () => useContext(BlogContext)

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blogs, setBlogs] = useState<Blog[]>([
    { title: 'Morning', content: 'Morning My Friends' },
    { title: 'Travel', content: 'I love traveling!' },
  ])
  const [selectedBlogTitle, setSelectedBlogTitle] = useState<string>('')

  const addBlog = (blog: Blog) => {
    setBlogs([...blogs, blog])
  }

  const removeBlog = (title: string) => {
    setBlogs(blogs.filter((blog) => blog.title !== title))
  }

  const updateBlog = (title: string, newBlog: Blog) => {
    setBlogs(blogs.map((blog) => (blog.title === title ? newBlog : blog)))
  }

  const selectedBlog = useMemo(
    () => blogs.find((blog) => blog.title === selectedBlogTitle),
    [selectedBlogTitle, blogs]
  )

  return (
    <BlogContext.Provider
      value={{
        blogs,
        selectedBlog,
        updateBlog,
        selectedBlogTitle,
        addBlog,
        removeBlog,
        setSelectedBlogTitle,
      }}
    >
      {children}
    </BlogContext.Provider>
  )
}

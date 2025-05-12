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

import React, { createContext, useState, useContext, useEffect } from 'react';

const BlogContext = createContext();

export function BlogProvider({ children }) {
  const initialBlogs = [
    {title: 'Morning', detail: 'Morning My Friends'},
    {title: 'Travel', detail: 'I love traveling!'}
  ];

  const [blogs, setBlogs] = useState(initialBlogs);
  const [selectedBlog, setSelectedBlog] = useState(blogs[0]);

  useEffect(() => {
    const handleBlogCreated = (event) => {
      const newBlog = event.detail;
      setBlogs(prevBlogs => [...prevBlogs, newBlog]);
      setSelectedBlog(newBlog);
    };

    window.addEventListener('blog-created', handleBlogCreated);
    return () => window.removeEventListener('blog-created', handleBlogCreated);
  }, []);

  return (
    <BlogContext.Provider value={{ blogs, setBlogs, selectedBlog, setSelectedBlog }}>
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  return useContext(BlogContext);
}
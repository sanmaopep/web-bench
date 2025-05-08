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
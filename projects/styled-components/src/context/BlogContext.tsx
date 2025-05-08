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

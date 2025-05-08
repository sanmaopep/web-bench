import React, { createContext, useState, useContext } from 'react';

interface Blog {
  title: string;
  detail: string;
}

interface BlogContextType {
  blogs: Blog[];
  setBlogs: React.Dispatch<React.SetStateAction<Blog[]>>;
  selectedBlog: string;
  setSelectedBlog: React.Dispatch<React.SetStateAction<string>>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const useBlogContext = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlogContext must be used within a BlogProvider');
  }
  return context;
};

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blogs, setBlogs] = useState<Blog[]>([
    { title: 'Morning', detail: 'Morning My Friends' },
    { title: 'Travel', detail: 'I love traveling!' }
  ]);
  const [selectedBlog, setSelectedBlog] = useState('Morning');

  return (
    <BlogContext.Provider value={{ blogs, setBlogs, selectedBlog, setSelectedBlog }}>
      {children}
    </BlogContext.Provider>
  );
};
import { useBlog } from "../context/BlogContext";
import { useState } from "react";
import CommentStore from "../store/Comment";

export function useEdit() {
  const { blogs, setBlogs, selectedBlog, setSelectedBlog } = useBlog();
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);

  const handleEdit = (updatedBlog) => {
    const isDuplicate = blogs.some(blog => 
      blog.title === updatedBlog.title && blog.title !== selectedBlog.title
    );

    if (isDuplicate) {
      return false;
    }

    const updatedBlogs = blogs.map(blog =>
      blog.title === selectedBlog.title ? updatedBlog : blog
    );
    
    CommentStore.updateBlogTitle(selectedBlog.title, updatedBlog.title);
    setBlogs(updatedBlogs);
    setSelectedBlog(updatedBlog);
    return true;
  };

  return {
    isEditFormVisible,
    setIsEditFormVisible,
    handleEdit
  };
}
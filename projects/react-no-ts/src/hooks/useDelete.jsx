import { useBlog } from "../context/BlogContext";
import CommentStore from "../store/Comment";

export function useDelete() {
  const { blogs, setBlogs, selectedBlog, setSelectedBlog } = useBlog();

  const handleDelete = () => {
    const updatedBlogs = blogs.filter(blog => blog.title !== selectedBlog.title);
    CommentStore.deleteComments(selectedBlog.title);
    setBlogs(updatedBlogs);
    setSelectedBlog(updatedBlogs[0] || { title: '', detail: '' });
  };

  return handleDelete;
}
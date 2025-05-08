import { useBlogContext } from '../context/BlogContext';
import { useCommentStore } from '../store/comment';

export function useDelete() {
  const { blogs, selectedBlog, selectBlog } = useBlogContext();
  const commentStore = useCommentStore();

  const deleteBlog = () => {
    const index = blogs.findIndex(blog => blog.title === selectedBlog.value.title);
    if (index !== -1) {
      commentStore.deleteCommentsForBlog(selectedBlog.value.title);
      blogs.splice(index, 1);
      if (blogs.length > 0) {
        selectBlog(blogs[0]);
      } else {
        selectBlog({ title: '', detail: '' });
      }
    }
  };

  return { deleteBlog };
}
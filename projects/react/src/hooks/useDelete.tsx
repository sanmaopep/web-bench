import { useBlogContext } from '../context/BlogContext'
import { commentStore } from '../store/Comment'

export const useDeleteBlog = () => {
  const { blogs, setBlogs, setSelectedBlog } = useBlogContext()

  const deleteBlog = (title: string) => {
    const newBlogs = blogs.filter((blog) => blog.title !== title)
    setBlogs(newBlogs)
    if (newBlogs.length > 0) {
      setSelectedBlog(newBlogs[0].title)
    } else {
      setSelectedBlog('')
    }

    // Remove comments for the deleted blog
    commentStore.deleteBlogComments(title)
  }

  return deleteBlog
}

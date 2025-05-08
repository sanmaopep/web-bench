import { useBlogContext } from '../context/BlogContext'
import { commentStore } from '../store/Comment'

export const useEditBlog = () => {
  const { blogs, setBlogs, setSelectedBlog } = useBlogContext()

  const editBlog = (oldTitle: string, newTitle: string, newDetail: string) => {
    const updatedBlogs = blogs.map((blog) =>
      blog.title === oldTitle ? { title: newTitle, detail: newDetail } : blog
    )
    setBlogs(updatedBlogs)
    setSelectedBlog(newTitle)

    // Update comments for the edited blog
    if (oldTitle !== newTitle) {
      commentStore.switchBlogComments(oldTitle, newTitle)
    }
  }

  return editBlog
}

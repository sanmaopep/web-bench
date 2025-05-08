import { useBlogContext } from '../context/BlogContext'
import { useCommentStore } from '../store/comment'

export function useEdit() {
  const { showForm, isEditing, selectedBlog } = useBlogContext()
  const commentStore = useCommentStore()

  const editBlog = () => {
    isEditing.value = true
    showForm.value = true
  }

  const updateBlogTitle = (newTitle: string) => {
    commentStore.updateBlogTitle(selectedBlog.value.title, newTitle)
  }

  return { editBlog, updateBlogTitle }
}
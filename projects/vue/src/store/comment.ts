import { ref, computed } from 'vue'

interface Comment {
  blogTitle: string
  text: string
}

class CommentStore {
  private static instance: CommentStore
  private comments = ref<Comment[]>([])

  private constructor() {}

  static getInstance(): CommentStore {
    if (!CommentStore.instance) {
      CommentStore.instance = new CommentStore()
    }
    return CommentStore.instance
  }

  addComment(blogTitle: string, text: string) {
    this.comments.value.push({ blogTitle, text })
  }

  getComments(blogTitle: string) {
    return computed(() => this.comments.value.filter((comment) => comment.blogTitle === blogTitle))
      .value
  }

  deleteCommentsForBlog(blogTitle: string) {
    this.comments.value = this.comments.value.filter((comment) => comment.blogTitle !== blogTitle)
  }

  updateBlogTitle(oldTitle: string, newTitle: string) {
    this.comments.value.forEach((comment) => {
      if (comment.blogTitle === oldTitle) {
        comment.blogTitle = newTitle
      }
    })
  }
}

export const useCommentStore = () => CommentStore.getInstance()

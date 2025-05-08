import { create } from 'zustand'

interface Comment {
  blogId: number
  author: string
  text: string
  createdAt: string
}

interface CommentStore {
  comments: Comment[]
  addComment: (blogId: number, comment: Omit<Comment, 'blogId'>) => void
  undoLastComment: (blogId: number, username: string) => void
}

const useCommentStore = create<CommentStore>((set) => ({
  comments: [],
  addComment: (blogId, comment) => set((state) => ({
    comments: [...state.comments, { blogId, ...comment }]
  })),
  undoLastComment: (blogId:number, username: string) => set((state) => {
    // Find the last comment for this blog
    const reversedComments = [...state.comments].reverse()
    const lastCommentIndex = reversedComments.findIndex(comment => comment.blogId === blogId && comment.author === username)
    
    if (lastCommentIndex === -1) return state
    
    // Remove the last comment
    const actualIndex = state.comments.length - 1 - lastCommentIndex
    return {
      comments: state.comments.filter((_, index) => index !== actualIndex)
    }
  })
}))

export default useCommentStore
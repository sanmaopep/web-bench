import { useCallback } from 'react'
import { useSyncExternalStore } from 'react'

interface CommentStore {
  [blogTitle: string]: string[]
}

const createCommentStore = () => {
  let commentStore: CommentStore = {}
  let listeners: (() => void)[] = []

  const subscribe = (listener: () => void) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }

  const getSnapshot = () => commentStore

  const addComment = (blogTitle: string, comment: string) => {
    commentStore = {
      ...commentStore,
      [blogTitle]: [...(commentStore[blogTitle] || []), comment],
    }
    listeners.forEach((listener) => listener())
  }

  const deleteBlogComments = (blogTitle: string) => {
    delete commentStore[blogTitle]
    listeners.forEach((listener) => listener())
  }

  const switchBlogComments = (oldTitle: string, newTitle: string) => {
    commentStore[newTitle] = commentStore[oldTitle]
    delete commentStore[oldTitle]
    listeners.forEach((listener) => listener())
  }

  return { subscribe, getSnapshot, addComment, deleteBlogComments, switchBlogComments }
}

export const commentStore = createCommentStore()

export const useBlogComments = (blogTitle: string) => {
  const store = useSyncExternalStore(commentStore.subscribe, commentStore.getSnapshot)

  return {
    addComment: useCallback(
      (comment: string) => {
        commentStore.addComment(blogTitle, comment)
      },
      [blogTitle]
    ),
    comments: store[blogTitle] || [],
  }
}

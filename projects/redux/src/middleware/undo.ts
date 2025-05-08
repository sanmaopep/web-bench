import { Middleware } from 'redux'
import { RouteState } from '../models/route'
import { BlogState } from '../models/blog'
import { UserState } from '../models/user'
import { undoLastComment } from '../models/comment'
import { undoMove } from '../models/game'

export const undoMiddleware: Middleware = (store) => {
  const handleBlogUndo = () => {
    const blogState = store.getState().blog as BlogState
    const userState = store.getState().user as UserState

    store.dispatch(
      undoLastComment({
        blogId: blogState.selectedBlogIndex,
        author: userState.username!,
      })
    )
  }

  const handleGameUndo = () => {
    store.dispatch(undoMove())
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    // Check for Ctrl+Z (Windows/Linux) or Command+Z (Mac)
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      const route = (store.getState().route as RouteState).currentRoute

      // Perform different undo strategies based on the current route
      if (route === '/') {
        handleBlogUndo()
      } else if (route === '/game') {
        handleGameUndo()
      }
    }
  }

  window.addEventListener('keydown', handleKeyDown)

  return (next) => (action) => {
    return next(action)
  }
}
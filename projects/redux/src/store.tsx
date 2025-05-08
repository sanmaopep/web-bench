import { configureStore } from '@reduxjs/toolkit'
import blogReducer from './models/blog'
import blogFormReducer from './models/blogForm'
import searchReducer from './models/search'
import routeReducer from './models/route'
import userReducer from './models/user'
import commentReducer from './models/comment'
import gameReducer, { shareGame } from './models/game'
import roomReducer from './models/room'
import chatReducer from './models/chat'
import { routeMiddleware } from './middleware/route'
import { undoMiddleware } from './middleware/undo'
import { navigate } from './middleware/route'
import { addBlog } from './models/blog'

// Create a custom middleware for handling the shareGame action
const shareGameMiddleware = store => next => action => {
  if (action.type === shareGame.type) {
    const { title, description, moveHistory } = action.payload
    
    // Create a blog post from the game data
    store.dispatch(addBlog({
      title,
      detail: description,
      author: store.getState().user.username || 'Anonymous',
      gameData: {
        moveHistory
      }
    }))
    
    // Navigate to home page
    store.dispatch(navigate('/'))
    
    // Reset the game
    store.dispatch({ type: 'game/resetGame' })
  }
  
  return next(action)
}

export type RootState = ReturnType<typeof store.getState>

export const store = configureStore({
  reducer: {
    blog: blogReducer,
    blogForm: blogFormReducer,
    search: searchReducer,
    route: routeReducer,
    user: userReducer,
    comment: commentReducer,
    game: gameReducer,
    room: roomReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(routeMiddleware, undoMiddleware, shareGameMiddleware),
})
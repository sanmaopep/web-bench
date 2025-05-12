// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
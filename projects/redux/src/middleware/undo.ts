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
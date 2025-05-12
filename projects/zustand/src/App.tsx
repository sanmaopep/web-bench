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

import React, { useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import Main from './components/Main'
import BlogForm from './components/BlogForm'
import useBlogStore from './stores/blog'
import useRouteStore from './stores/route'
import Login from './components/Login'
import Game from './components/Game'
import Rooms from './components/Rooms'
import ChatRoom from './components/ChatRoom'

function App() {
  const formVisible = useBlogStore((state) => state.formVisible)
  const isLoading = useBlogStore((state) => state.isLoading)
  const fetchBlogs = useBlogStore((state) => state.fetchBlogs)
  const currentRoute = useRouteStore((state) => state.currentRoute)

  useEffect(() => {
    fetchBlogs()
  }, [fetchBlogs])

  const isChatRoute = currentRoute.startsWith('/chat/')

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      {isLoading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Blog is loading
        </div>
      ) : (
        <>
          {currentRoute === '/' && <Main />}
          {currentRoute === '/login' && <Login />}
          {currentRoute === '/game' && <Game />}
          {currentRoute === '/rooms' && <Rooms />}
          {isChatRoute && <ChatRoom />}
          {formVisible && <BlogForm />}
        </>
      )}
    </div>
  )
}

export default App
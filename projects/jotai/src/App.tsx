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

import React from 'react'
import './App.css'
import Header from './components/Header'
import Main from './components/Main'
import BlogForm from './components/BlogForm'
import Login from './components/Login'
import Game from './components/Game'
import Rooms from './components/Rooms'
import ChatRoom from './components/ChatRoom'
import { useAtom } from 'jotai'
import { blogsAsyncAtom, loadingAtom } from './atoms/blog'
import { routeAtom, initRouteAtom } from './atoms/route'

function App() {
  const [, fetchBlogs] = useAtom(blogsAsyncAtom)
  const [isLoading] = useAtom(loadingAtom)
  const [route] = useAtom(routeAtom)
  const [, initRoute] = useAtom(initRouteAtom)

  React.useEffect(() => {
    fetchBlogs()
    initRoute()
  }, [fetchBlogs, initRoute])

  if (isLoading)
    return (
      <div>
        <Header />
        Blog is loading
      </div>
    )

  const isChatRoute = route.startsWith('/chat/')

  return (
    <>
      <Header />
      {route === '/' ? (
        <>
          <Main />
          <BlogForm />
        </>
      ) : route === '/login' ? (
        <Login />
      ) : route === '/game' ? (
        <Game />
      ) : route === '/rooms' ? (
        <Rooms />
      ) : isChatRoute ? (
        <ChatRoom />
      ) : null}
    </>
  )
}

export default App

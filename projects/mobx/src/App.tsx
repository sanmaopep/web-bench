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
import Login from './components/Login'
import BlogForm from './components/BlogForm'
import GomokuGame from './components/GomokuGame'
import Rooms from './components/Rooms'
import Chat from './components/Chat'
import { observer } from 'mobx-react-lite'
import blogStore from './stores/blog'
import routeStore from './stores/route'

function App() {
  React.useEffect(() => {
    blogStore.fetchBlogs()
  }, [])

  if (blogStore.isLoading) {
    return (
      <div>
        <Header />
        Blog is loading
      </div>
    )
  }

  // Check if current route is a chat route
  const isChatRoute = routeStore.currentRoute.startsWith('/chat/')

  return (
    <div className="App">
      <Header />
      {routeStore.currentRoute === '/' && <Main />}
      {routeStore.currentRoute === '/login' && <Login />}
      {routeStore.currentRoute === '/game' && <GomokuGame />}
      {routeStore.currentRoute === '/rooms' && <Rooms />}
      {isChatRoute && <Chat />}
      <BlogForm />
    </div>
  )
}

export default observer(App)

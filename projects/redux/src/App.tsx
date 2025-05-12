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
import Login from './components/Login'
import Game from './components/Game'
import Rooms from './components/Rooms'
import ChatRoom from './components/ChatRoom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from './store'
import { fetchBlogs } from './models/blog'
import { cleanInactiveParticipants } from './models/chat'

function App() {
  const dispatch = useDispatch()
  const formVisible = useSelector((state: RootState) => state.blogForm.formVisible)
  const loading = useSelector((state: RootState) => state.blog.loading)
  const currentRoute = useSelector((state: RootState) => state.route.currentRoute)

  useEffect(() => {
    dispatch(fetchBlogs())
    
    // Set up interval to clean inactive participants
    const intervalId = setInterval(() => {
      dispatch(cleanInactiveParticipants());
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [dispatch])

  const renderContent = () => {
    if (currentRoute === '/login') {
      return <Login />
    }

    if (currentRoute === '/game') {
      return <Game />
    }

    if (currentRoute === '/rooms') {
      return <Rooms />
    }
    
    if (currentRoute.startsWith('/chat/')) {
      const roomId = currentRoute.split('/chat/')[1];
      return <ChatRoom roomId={roomId} />
    }

    if (loading) {
      return <div style={{ margin: '2rem', textAlign: 'center' }}>Blog is loading</div>
    }

    return <Main />
  }

  return (
    <div className="App">
      <Header />
      {renderContent()}
      {formVisible && currentRoute !== '/game' && 
       currentRoute !== '/rooms' && 
       !currentRoute.startsWith('/chat/') && 
       <BlogForm />}
    </div>
  )
}

export default App
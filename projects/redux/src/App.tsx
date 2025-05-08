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
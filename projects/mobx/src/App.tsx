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

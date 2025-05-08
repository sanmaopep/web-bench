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

import React, { useState, useEffect } from 'react'
import App from './App'
import Game from './pages/Game'
import { BlogProvider } from './context/BlogContext'

function Router() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener('popstate', onLocationChange)
    return () => window.removeEventListener('popstate', onLocationChange)
  }, [])

  const navigate = (to) => {
    window.history.pushState({}, '', to)
    setCurrentPath(to)
  }

  let component
  switch (currentPath) {
    case '/game':
      component = <Game navigate={navigate} />
      break
    default:
      component = <App navigate={navigate} />
  }

  return <BlogProvider>
    {component}
  </BlogProvider>
}

export default Router
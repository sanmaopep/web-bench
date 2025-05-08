import React from 'react'
import App from './App'
import Game from './pages/Game'
import { BlogProvider } from './context/BlogContext'

const Router: React.FC = () => {
  const [currentPath, setCurrentPath] = React.useState(window.location.pathname)

  React.useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener('popstate', onLocationChange)

    return () => window.removeEventListener('popstate', onLocationChange)
  }, [])

  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    setCurrentPath(path)
  }

  return (
    <BlogProvider>
      <div>
        {currentPath === '/' && <App navigate={navigate} />}
        {currentPath === '/game' && <Game navigate={navigate} />}
      </div>
    </BlogProvider>
  )
}

export default Router

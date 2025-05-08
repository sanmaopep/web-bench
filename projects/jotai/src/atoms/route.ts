import { atom } from 'jotai'
import { handleChatRouteChangeAtom } from './chat'

export const routeAtom = atom<string>(window.location.pathname)

routeAtom.onMount = (setAtom) => {
  const handlePopState = () => {
    setAtom(window.location.pathname)
  }
  window.addEventListener('popstate', handlePopState)
  return () => window.removeEventListener('popstate', handlePopState)
}

export const navigateAtom = atom(null, (get, set, path: string) => {
  window.history.pushState(null, '', path)
  set(routeAtom, path)
  
  // Notify chat system about route change
  set(handleChatRouteChangeAtom, path)
})

// Handle initial route
export const initRouteAtom = atom(null, (get, set) => {
  set(handleChatRouteChangeAtom, window.location.pathname)
})
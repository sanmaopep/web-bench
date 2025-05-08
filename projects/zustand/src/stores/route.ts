import { create } from 'zustand'

interface RouteState {
  currentRoute: string
}

const useRouteStore = create<RouteState>((set) => {
  const updateRoute = () => set({ currentRoute: window.location.pathname })

  window.addEventListener('popstate', updateRoute)

  return { currentRoute: window.location.pathname }
})

const navigate = (pathname: string) => {
  window.history.pushState({}, '', pathname)
  useRouteStore.setState({ currentRoute: pathname })
}

export { navigate }

export default useRouteStore
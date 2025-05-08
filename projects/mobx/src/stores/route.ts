import { makeAutoObservable } from 'mobx'

class RouteStore {
  currentRoute: string = window.location.pathname

  constructor() {
    makeAutoObservable(this)
    window.addEventListener('popstate', this.handleRouteChange)
  }

  handleRouteChange = () => {
    this.currentRoute = window.location.pathname
  }

  navigate = (path: string) => {
    window.history.pushState(null, '', path)
    this.currentRoute = path
  }
}

const routeStore = new RouteStore()
export default routeStore
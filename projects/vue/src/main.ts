import { createApp, defineComponent, h } from 'vue'
import App from './App.vue'
import Game from './pages/Game.vue'
import { useBlogProvider } from './context/BlogContext'

const routes: Record<string, any> = {
  '/': App,
  '/game': Game,
}

const SimpleRouter = defineComponent({
  data() {
    return {
      currentRoute: window.location.pathname,
    }
  },
  render() {
    return h(routes[this.currentRoute] || App)
  },
  setup() {
    useBlogProvider()
  },
  created() {
    window.addEventListener('popstate', () => {
      this.currentRoute = window.location.pathname
    })
  },
})

const app = createApp(SimpleRouter)
app.mount('#app')

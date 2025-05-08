import { mount, unmount } from 'svelte'
import { currentPath, getComponent } from './router'

let app: any

currentPath.subscribe((path) => {
  if (app) {
    unmount(app)
  }

  const Component = getComponent(path)
  app = mount(Component, {
    target: document.getElementById('root')!,
  })
})

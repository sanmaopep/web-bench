import { Canvas } from './common/Canvas'
import { Shape } from './common/shape/Shape'
import { Toolkit } from './common/Toolkit'

document.addEventListener('DOMContentLoaded', () => {
  const toolkit = new Toolkit('.toolkit')
  const canvas = new Canvas('.canvas', toolkit)

  const whitelist = ['copy', ...Shape.registeredShapes]
  canvas.on('done', ({ operation }) => {
    console.log('[canvas.done]', operation)
    if (whitelist.includes(operation)) {
      // @ts-ignore
      toolkit.root.querySelector('.move')?.click()
    }
  })
})

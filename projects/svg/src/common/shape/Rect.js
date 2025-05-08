import { CreateConfig } from '../util'
import { Shape } from './Shape'

export class Rect extends Shape {
  get shape() {
    return 'rect'
  }

  /**
   * @param {CreateConfig} config
   */
  onCreateMove(config) {
    const { element, center } = this
    const { cursorP0, cursorP1 } = config

    const x = Math.min(cursorP1.x, cursorP0.x)
    const y = Math.min(cursorP1.y, cursorP0.y)
    const width = Math.max(Math.abs(cursorP1.x - cursorP0.x), config.lineWidth)
    const height = Math.max(Math.abs(cursorP1.y - cursorP0.y), config.lineWidth)

    element.setAttribute('x', `${x}`)
    element.setAttribute('y', `${y}`)
    element.setAttribute('width', `${width}`)
    element.setAttribute('height', `${height}`)
    Object.assign(center, { x: x + width / 2, y: y + height / 2 })
    element.style.transformOrigin = `${center.x}px ${center.y}px`
  }
}

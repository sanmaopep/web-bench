import { CreateConfig, max, min } from '../util'
import { Shape } from './Shape'

export class Triangle extends Shape {
  get shape() {
    return 'polygon'
  }

  /**
   * @param {CreateConfig} config
   */
  onCreateMove(config) {
    const { element, center } = this
    const { cursorP0, cursorP1 } = config

    const p1 = { x: min(cursorP0.x, cursorP1.x), y: min(cursorP0.y, cursorP1.y) }
    const p2 = { x: max(cursorP0.x, cursorP1.x), y: max(cursorP0.y, cursorP1.y) }
    Object.assign(center, { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 })
    element.style.transformOrigin = `${center.x}px ${center.y}px`
    element.setAttribute('points', `${p1.x} ${p2.y}, ${p2.x} ${p2.y}, ${center.x} ${p1.y}`)
  }
}

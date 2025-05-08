import { CreateConfig } from '../util'
import { Shape } from './Shape'

export class Ellipse extends Shape {
  get shape() {
    return 'ellipse'
  }

  /**
   * @param {CreateConfig} config
   */
  onCreateMove(config) {
    const { element, center } = this
    const { cursorP0, cursorP1 } = config

    const rx = Math.max(Math.abs(cursorP1.x - cursorP0.x), config.lineWidth) / 2
    const ry = Math.max(Math.abs(cursorP1.y - cursorP0.y), config.lineWidth) / 2
    const cx = cursorP0.x + rx * (cursorP1.x - cursorP0.x < 0 ? -1 : 1)
    const cy = cursorP0.y + ry * (cursorP1.y - cursorP0.y < 0 ? -1 : 1)
    element.setAttribute('cx', `${cx}`)
    element.setAttribute('cy', `${cy}`)
    element.setAttribute('rx', `${rx}`)
    element.setAttribute('ry', `${ry}`)
    Object.assign(center, { x: cx, y: cy })
    element.style.transformOrigin = `${center.x}px ${center.y}px`
  }
}

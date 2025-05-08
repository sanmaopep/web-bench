import { CreateConfig, ShapeConfig } from '../util'
import { Shape } from './Shape'

export class Line extends Shape {
  get shape() {
    return 'line'
  }

  /**
   * @param {ShapeConfig} [config]
   */
  constructor(config) {
    super(config)

    if (!config) return
    const { lineWidth, origin } = config
    this.onCreateMove({
      cursorP0: origin,
      cursorP1: { x: origin.x + lineWidth, y: origin.y },
      lineWidth,
    })
  }

  /**
   * @param {CreateConfig} config
   */
  onCreateMove(config) {
    const { element, center } = this
    const { cursorP0, cursorP1, lineWidth } = config

    const length = Math.sqrt((cursorP1.x - cursorP0.x) ** 2 + (cursorP1.y - cursorP0.y) ** 2)
    const cursorP2 = Object.assign({}, cursorP1)
    if (length < lineWidth) {
      Object.assign(cursorP2, {
        x: cursorP0.x + lineWidth * (cursorP1.x - cursorP0.x < 0 ? -1 : 1),
        y: cursorP0.y,
      })
    }
    if (!element.getAttribute('x1')) {
      element.setAttribute('x1', `${cursorP0.x}`)
      element.setAttribute('y1', `${cursorP0.y}`)
    }
    element.setAttribute('x2', `${cursorP2.x}`)
    element.setAttribute('y2', `${cursorP2.y}`)
    Object.assign(center, { x: (cursorP0.x + cursorP2.x) / 2, y: (cursorP0.y + cursorP2.y) / 2 })
    element.style.transformOrigin = `${center.x}px ${center.y}px`
  }
}

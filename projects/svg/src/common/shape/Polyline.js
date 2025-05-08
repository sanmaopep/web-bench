import { calcCenter, CreateConfig, ShapeConfig } from '../util'
import { Shape } from './Shape'

export class Polyline extends Shape {
  get shape() {
    return 'polyline'
  }
  get isMinimalEnable() {
    return false
  }

  /**
   * @param {ShapeConfig} [config]
   */
  constructor(config) {
    super(config ? { ...config, fillColor: 'none' } : undefined)

    if (config) this.points.push(config.origin)
  }

  /**
   * @param {CreateConfig} config
   */
  onCreateMove(config) {
    const { element, center, points } = this
    const { cursorP1 } = config

    points.push(cursorP1)

    Object.assign(center, calcCenter(points))
    element.style.transformOrigin = `${center.x}px ${center.y}px`
    element.setAttribute('points', points.map((p) => `${p.x} ${p.y}`).join(', '))
  }
}

import { Shape } from './Shape'
import { Point, SVG_NS } from '../util'

export class Line extends Shape {
  /**
   * @param {object} [opts]
   * @param {string} opts.color
   * @param {number} opts.lineWidth
   * @param {Point} opts.origin
   */
  constructor(opts) {
    super(opts)

    if (!opts) return
    const { color, lineWidth, origin } = opts
    const element = document.createElementNS(SVG_NS, 'line')
    this.element = element
    element.setAttribute('stroke', color)
    element.setAttribute('stroke-width', `${lineWidth}`)
    element.setAttribute('x1', `${origin.x}`)
    element.setAttribute('y1', `${origin.y}`)
    element.setAttribute('x2', `${origin.x + lineWidth}`)
    element.setAttribute('y2', `${origin.y}`)
    Object.assign(this.center, { x: origin.x + lineWidth / 2, y: origin.y })
  }

  /**
   * @param {object} opts
   * @param {Point} opts.cursorP0
   * @param {Point} opts.cursorP1
   * @param {number} opts.lineWidth
   */
  onCreateMove(opts) {
    const { element, center } = this
    const { cursorP0, cursorP1, lineWidth } = opts

    const length = Math.sqrt((cursorP1.x - cursorP0.x) ** 2 + (cursorP1.y - cursorP0.y) ** 2)
    const cursorP2 = Object.assign({}, cursorP1)
    if (length < lineWidth) {
      Object.assign(cursorP2, {
        x: cursorP0.x + lineWidth * (cursorP1.x - cursorP0.x < 0 ? -1 : 1),
        y: cursorP0.y,
      })
    }
    element.setAttribute('x2', `${cursorP2.x}`)
    element.setAttribute('y2', `${cursorP2.y}`)
    Object.assign(center, { x: (cursorP0.x + cursorP2.x) / 2, y: (cursorP0.y + cursorP2.y) / 2 })
    element.style.transformOrigin = `${center.x}px ${center.y}px`
  }

  /**
   * @return {Line}
   */
  clone() {
    /** @type {SVGElement} */
    // @ts-ignore
    const el = this.element.cloneNode(true)
    el.setAttribute('x1', `${parseFloat(el.getAttribute('x1') ?? '0') + Shape.offset.x}`)
    el.setAttribute('y1', `${parseFloat(el.getAttribute('y1') ?? '0') + Shape.offset.y}`)
    el.setAttribute('x2', `${parseFloat(el.getAttribute('x2') ?? '0') + Shape.offset.x}`)
    el.setAttribute('y2', `${parseFloat(el.getAttribute('y2') ?? '0') + Shape.offset.y}`)

    const shape = new Line()
    shape.element = el
    Object.assign(shape.center, this.center)

    return shape
  }
}

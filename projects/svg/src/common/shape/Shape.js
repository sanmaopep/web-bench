import {
  calculateRotationAngleDeg,
  calculateScale,
  CreateConfig,
  MoveConfig,
  Point,
  setTransform,
  ShapeConfig,
  SVG_NS,
  Transform,
} from '../util'

const registeredShapes = [
  'line',
  'rect',
  'circle',
  'ellipse',
  'triangle',
  'trapezoid',
  'hexagon',
  'polyline',
  'curve',
  'text',
]

export class Shape {
  get shape() {
    return 'svg'
  }
  get isMinimalEnable() {
    return true
  }
  /** @type {SVGElement} */
  element
  /** @type {Point} */
  center = { x: 0, y: 0 }
  /** @type {Point[]} */
  points = []

  /**
   * @param {ShapeConfig} [config]
   */
  constructor(config) {
    console.log(`[${this.constructor.name}.create]`, config, this)
    Shape.shapes.push(this)
    const element = document.createElementNS(SVG_NS, this.shape)
    this.element = element

    if (!config) return
    const { color, lineWidth, origin, fillColor } = config
    element.setAttribute('fill', fillColor ?? 'white')
    element.setAttribute('stroke', color)
    element.setAttribute('stroke-width', `${lineWidth}`)
    if (this.isMinimalEnable) {
      this.onCreateMove({
        cursorP0: origin,
        cursorP1: { x: origin.x + lineWidth, y: origin.y + lineWidth },
        lineWidth,
      })
    }
  }

  /**
   * @param {CreateConfig} config
   */
  onCreateMove(config) {
    throw new Error('NOT IMPLEMENTED!')
  }

  /**
   * @param {MoveConfig} config
   */
  onMove(config) {
    const {
      cursorP0,
      cursorP1,
      transform0,
      transform0: { translate: translate0, rotate: rotate0, scale: scale0 },
    } = config

    const diff = { x: cursorP1.x - cursorP0.x, y: cursorP1.y - cursorP0.y }
    const translate1 = { x: translate0.x + diff.x, y: translate0.y + diff.y }
    setTransform(this.element, { ...transform0, translate: translate1 })
  }

  /**
   * @param {MoveConfig} config
   */
  onRotate(config) {
    const {
      cursorP0,
      cursorP1,
      transform0,
      transform0: { translate: translate0, rotate: rotate0, scale: scale0 },
    } = config

    const rotate1 = { value: 0, x: this.center.x, y: this.center.y }
    rotate1.value =
      rotate0.value +
      calculateRotationAngleDeg(
        this.center,
        { x: cursorP0.x - translate0.x, y: cursorP0.y - translate0.y },
        { x: cursorP1.x - translate0.x, y: cursorP1.y - translate0.y }
      )
    // console.log(rotate1)
    setTransform(this.element, { ...transform0, rotate: rotate1 })
  }

  /**
   * @param {MoveConfig} config
   */
  onZoom(config) {
    const {
      cursorP0,
      cursorP1,
      transform0,
      transform0: { translate: translate0, rotate: rotate0, scale: scale0 },
    } = config

    const s = calculateScale(
      this.center,
      { x: cursorP0.x - translate0.x, y: cursorP0.y - translate0.y },
      { x: cursorP1.x - translate0.x, y: cursorP1.y - translate0.y }
    )
    const scale1 = { x: scale0.x * s, y: scale0.y * s }
    setTransform(this.element, { ...transform0, scale: scale1 })
  }

  /**
   * @param {object} config
   * @param {Transform} config.transform0
   * @return {Promise<Shape>}
   */
  async clone(config) {
    const {
      transform0,
      transform0: { translate: translate0 },
    } = config

    /** @type {SVGElement} */
    // @ts-ignore
    const el = this.element.cloneNode(true)

    const shape = await Shape.create(this.constructor.name.toLowerCase())
    shape.element = el
    Object.assign(shape.center, this.center)

    const diff = { x: 20, y: 20 }
    const translate1 = { x: translate0.x + diff.x, y: translate0.y + diff.y }
    setTransform(el, { ...transform0, translate: translate1 })

    return shape
  }

  remove() {
    Shape.shapes.splice(
      Shape.shapes.findIndex((shape) => this === shape),
      1
    )
    this.element.remove()
  }

  //////////////////////////////////////////////////////////////////////////////
  // Static
  //////////////////////////////////////////////////////////////////////////////
  /** @type {Shape[]} */
  static shapes = []

  /**
   * @param {string} type
   * @param {ShapeConfig} [config]
   * @returns {Promise<Shape>}
   */
  static async create(type, config) {
    const className = type[0].toUpperCase() + type.slice(1)
    const ShapeClass = (await import(/* @vite-ignore */ `./${className}.js`))[className]

    const shape = new ShapeClass(config)

    return shape
  }

  /**
   * @param {SVGElement} element
   * @returns {Shape | undefined}
   */
  static findByElement(element) {
    return Shape.shapes.find((shape) => element === shape.element)
  }

  static offset = { x: 20, y: 20 }

  static registeredShapes = registeredShapes
}

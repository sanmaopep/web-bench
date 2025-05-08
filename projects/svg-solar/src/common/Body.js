import {
  BodyData,
  eventBus,
  EventEmitter,
  getUid,
  GOTO_PLANET_SYSTEM,
  INSERT_RESOURCE,
  parseColor,
  PAUSE,
  Point,
  RESUME,
  SHOW_DETAIL,
  SVG_NS,
} from './util'

export class Body extends EventEmitter {
  /** @type {BodyData} */
  data
  /** @type {Point} */
  origin
  /** @type {SVGGElement} */
  group
  /** @type {SVGElement} */
  body
  /** @type {SVGElement} */
  ring
  /** @type {Body[]} */
  bodies = []

  get isHoverToPause() {
    return true
  }

  /**
   * @param {BodyData} data
   * @param {Point} origin
   */
  constructor(data, origin) {
    super()

    this.data = data
    this.origin = origin
    const group = document.createElementNS(SVG_NS, 'g')
    this.group = group

    group.setAttribute('class', 'group')
    group.setAttribute(
      'data-body',
      JSON.stringify({ ...data, bodies: data.bodies.map((b) => b.name) })
    )

    const title = document.createElementNS(SVG_NS, 'title')
    title.textContent = `${data.name}`
    group.append(title)
  }

  bindEvents() {
    const { body, data } = this
    body.addEventListener('mouseenter', (e) => {
      e.stopPropagation()
      this.onHover()
    })

    body.addEventListener('mouseleave', (e) => {
      e.stopPropagation()
      this.onCancelHover()
    })

    body.addEventListener('click', (e) => {
      e.stopPropagation()
      if (data.type === 'planet') {
        eventBus.emit(GOTO_PLANET_SYSTEM, data)
      }
    })
  }

  onHover() {
    eventBus.emit(SHOW_DETAIL, this)
    if (this.isHoverToPause) eventBus.emit(PAUSE)
  }

  onCancelHover() {
    // eventBus.emit(HIDE_DETAIL)
    if (this.isHoverToPause) eventBus.emit(RESUME)
  }

  /** 
   * @param {string} color 
   * @example
      <linearGradient id="Gradient2" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="red" />
        <stop offset="50%" stop-color="black" stop-opacity="0" />
        <stop offset="100%" stop-color="blue" />
      </linearGradient>
   */
  getColor(color) {
    const col = parseColor(color)
    if (typeof col === 'string') return col

    const gradient = document.createElementNS(SVG_NS, col.gradient)
    const id = `gradient-${this.data.name}`
    gradient.setAttribute('id', id)
    gradient.setAttribute('x1', '0')
    gradient.setAttribute('y1', '0')
    gradient.setAttribute('x2', '0')
    gradient.setAttribute('y2', '1')
    col.stops.forEach((s) => {
      const stop = document.createElementNS(SVG_NS, 'stop')
      gradient.append(stop)
      Object.keys(s).forEach((key) => {
        stop.setAttribute(key, s[key])
      })
    })

    eventBus.emit(INSERT_RESOURCE, gradient)

    return `url(#${id})`
  }
}

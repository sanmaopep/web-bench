import { Body } from './Body'
import {
  CometData,
  eventBus,
  PlanetData,
  Point,
  SatelliteData,
  SHOW_DETAIL,
  StarData,
  SubbodyData,
  SVG_NS,
} from './util'
import { SubBody } from './SubBody'

export class CenterBody extends Body {
  /** @type {(SubBody)[]} */
  bodies = []

  /**
   * @param {StarData | PlanetData} data
   * @param {Point} origin
   */
  constructor(data, origin) {
    super(data, origin)

    const { group } = this

    const body = document.createElementNS(SVG_NS, 'circle')
    this.body = body
    group.append(body)

    body.setAttribute('class', `centerbody ${data.type} ${data.name}`)
    body.setAttribute('cx', `${origin.x}`)
    body.setAttribute('cy', `${origin.y}`)
    body.setAttribute('r', `${Math.max(data.r, 8)}`)
    body.setAttribute('fill', `${this.getColor(data.color)}`)

    data.bodies.forEach((subbodyData) => this.addSubbody(subbodyData))

    eventBus.emit(SHOW_DETAIL, this)

    this.bindEvents()
  }

  /**
   * @param {SubbodyData} subbodyData
   */
  addSubbody(subbodyData) {
    const { group, origin } = this
    const subbody = new SubBody(subbodyData, origin)
    this.bodies.push(subbody)
    group.append(subbody.group)
  }

  get isHoverToPause() {
    return false
  }
}

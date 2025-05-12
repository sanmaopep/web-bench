// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Body } from './Body'
import {
  CometData,
  config,
  density,
  eventBus,
  PlanetData,
  Point,
  SatelliteData,
  SubbodyData,
  SVG_NS,
} from './util'

export class SubBody extends Body {
  /** @type {SubbodyData} */
  data
  /** @type {(SubBody)[]} */
  bodies = []
  /** @type {SVGGElement} */
  bodyGroup
  /** @type {SVGCircleElement} */
  body
  /** @type {SVGPathElement} */
  orbit
  /** @type {SVGPathElement} */
  tail
  /** @type {Point[]} */
  tailPoints = []

  /**
   * @param {SubbodyData} data
   * @param {Point} origin
   */
  constructor(data, origin) {
    super(data, origin)

    this.data = data
    const { group } = this
    const o1 = { x: origin.x + data.rx, y: origin.y }

    // orbit & tail ////////////////////////////////////////////////////////////
    const orbitId = `orbit_${data.name}`
    const orbit = document.createElementNS(SVG_NS, 'path')
    this.orbit = orbit
    orbit.setAttribute('id', orbitId)
    orbit.setAttribute('class', `orbit`)
    const startPoint = `${o1.x},${o1.y}`
    const leftPoint = `${o1.x - data.rx * 2},${o1.y}`
    orbit.setAttribute(
      'd',
      `M ${startPoint} A ${data.rx},${data.ry} 0 1,1 ${leftPoint} A ${data.rx},${data.ry} 0 1,1 ${startPoint}`
    )
    orbit.style.display = config.orbitEnabled ? 'block' : 'none'
    group.append(orbit)

    const tailId = `tail_${data.name}`
    const tail = document.createElementNS(SVG_NS, 'path')
    this.tail = tail
    tail.setAttribute('id', tailId)
    tail.setAttribute('class', `tail`)
    tail.style.display = config.tailEnabled ? 'block' : 'none'
    group.append(tail)

    // bodyGroup ///////////////////////////////////////////////////////////////
    const bodyGroup = document.createElementNS(SVG_NS, 'g')
    this.bodyGroup = bodyGroup
    bodyGroup.setAttribute('class', `body-group`)

    const body = document.createElementNS(SVG_NS, 'circle')
    this.body = body
    bodyGroup.append(body)
    body.setAttribute('class', `subbody ${data.type} ${data.name}`)
    body.setAttribute('r', `${data.r}`)
    body.setAttribute('fill', `${this.getColor(data.color)}`)

    if ('ring' in data && data.ring) {
      const ring = document.createElementNS(SVG_NS, 'use')
      this.ring = ring
      bodyGroup.append(ring)
      ring.setAttribute('href', `#ring`)
      ring.setAttribute('id', `ring_${data.name}`)
      ring.setAttribute('x', `-3`)
      ring.setAttribute('y', `-1`)
      ring.setAttribute('transform', `scale(${(data.r * 1.5) / 3})`)
    }

    const revolution = document.createElementNS(SVG_NS, 'animateMotion')
    bodyGroup.append(revolution)
    revolution.setAttribute('repeatCount', `indefinite`)

    revolution.setAttribute('dur', `${data.dur / config.speed}s`)
    const mpath = document.createElementNS(SVG_NS, 'mpath')
    mpath.setAttribute('href', `#${orbitId}`)
    revolution.append(mpath)

    group.append(bodyGroup)
    // events //////////////////////////////////////////////////////////////////
    this.bindEvents()
  }

  bindEvents() {
    super.bindEvents()

    const { body, data, tailPoints, tail } = this
    body.addEventListener('mouseenter', this.highlight.bind(this))
    body.addEventListener('mouseleave', this.unhighlight.bind(this))

    const interval = 0.05
    setInterval(() => {
      // tail-length === 5% orbit-length
      const maxTailPointCount = Math.max((data.dur / config.speed / interval) * 0.05, 2)
      const rect = body.getBoundingClientRect()
      const point = {
        x: (rect.x + rect.width / 2) / density,
        y: (rect.y + rect.height / 2) / density,
      }
      if (tailPoints.length > maxTailPointCount) {
        tailPoints.splice(0, tailPoints.length - maxTailPointCount)
      }
      tailPoints.push(point)
      // console.log(orbitPoints)
      const p0 = tailPoints[0]
      const p1 = point
      tail.setAttribute('d', `M ${p0.x} ${p0.y} A ${data.rx} ${data.ry} 0 0 1 ${p1.x} ${p1.y}`)
    }, interval * 1000)
  }

  highlight() {
    const { body, orbit } = this
    body.classList.add('highlight')
    orbit.classList.add('highlight')
  }

  unhighlight() {
    const { body, orbit } = this
    body.classList.remove('highlight')
    orbit.classList.remove('highlight')
  }
}

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

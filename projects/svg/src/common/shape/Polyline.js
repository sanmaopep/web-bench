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

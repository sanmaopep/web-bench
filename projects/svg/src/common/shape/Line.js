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

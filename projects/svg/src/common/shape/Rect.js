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

import { CreateConfig } from '../util'
import { Shape } from './Shape'

export class Rect extends Shape {
  get shape() {
    return 'rect'
  }

  /**
   * @param {CreateConfig} config
   */
  onCreateMove(config) {
    const { element, center } = this
    const { cursorP0, cursorP1 } = config

    const x = Math.min(cursorP1.x, cursorP0.x)
    const y = Math.min(cursorP1.y, cursorP0.y)
    const width = Math.max(Math.abs(cursorP1.x - cursorP0.x), config.lineWidth)
    const height = Math.max(Math.abs(cursorP1.y - cursorP0.y), config.lineWidth)

    element.setAttribute('x', `${x}`)
    element.setAttribute('y', `${y}`)
    element.setAttribute('width', `${width}`)
    element.setAttribute('height', `${height}`)
    Object.assign(center, { x: x + width / 2, y: y + height / 2 })
    element.style.transformOrigin = `${center.x}px ${center.y}px`
  }
}

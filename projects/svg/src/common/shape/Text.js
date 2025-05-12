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

import { abs, CreateConfig, min, ShapeConfig } from '../util'
import { Shape } from './Shape'

export class Text extends Shape {
  get shape() {
    return 'text'
  }

  /**
   * @param {ShapeConfig} [config]
   */
  constructor(config) {
    super(config)

    if (!config) return
    const { element } = this
    const { color } = config
    element.setAttribute('stroke', 'none')
    element.setAttribute('fill', color)
    element.setAttribute('text-anchor', 'middle')
    element.innerHTML = 'Text'
    element.addEventListener('dblclick', () => {
      const text = prompt('Update Content:', element.innerHTML)
      if (text) {
        element.innerHTML = text
      }
    })
  }

  /**
   * @param {CreateConfig} config
   */
  onCreateMove(config) {
    const { element, center } = this
    const { cursorP0, cursorP1 } = config

    const x = min(cursorP1.x, cursorP0.x)
    const y = min(cursorP1.y, cursorP0.y)
    const width = abs(cursorP1.x - cursorP0.x)
    const height = abs(cursorP1.y - cursorP0.y)
    const fontSize = Math.floor(min(width, height) * 0.8)
    Object.assign(center, { x: x + width / 2, y: y + height / 2 })

    element.style.transformOrigin = `${center.x}px ${center.y}px`
    element.setAttribute('x', `${center.x}`)
    element.setAttribute('y', `${y + height * 0.8}`)
    element.setAttribute('font-size', `${fontSize}`)
  }
}

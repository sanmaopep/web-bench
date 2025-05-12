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

export class Circle extends Shape {
  get shape() {
    return 'circle'
  }

  /**
   * @param {CreateConfig} config
   */
  onCreateMove(config) {
    const { element, center } = this
    const { cursorP0, cursorP1 } = config

    const rx = Math.max(Math.abs(cursorP1.x - cursorP0.x), config.lineWidth) / 2
    const ry = Math.max(Math.abs(cursorP1.y - cursorP0.y), config.lineWidth) / 2
    const cx = cursorP0.x + rx * (cursorP1.x - cursorP0.x < 0 ? -1 : 1)
    const cy = cursorP0.y + ry * (cursorP1.y - cursorP0.y < 0 ? -1 : 1)
    element.setAttribute('cx', `${cx}`)
    element.setAttribute('cy', `${cy}`)
    element.setAttribute('r', `${rx}`)
    Object.assign(center, { x: cx, y: cy })
    element.style.transformOrigin = `${center.x}px ${center.y}px`
  }
}

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

import { Question } from './Question.js'

export class RatingQuestion extends Question {
  starCount

  /**
   * @param {string} title
   * @param {string} name
   * @param {number} starCount
   */
  constructor(title, name, starCount = 5) {
    super(title, name)
    this.starCount = starCount

    if (starCount <= 0) starCount = 1

    const container = document.createElement('div')
    container.className = 'rating-container'

    for (let i = 1; i <= starCount; i++) {
      const starLabel = document.createElement('label')
      container.appendChild(starLabel)
      const starRadio = document.createElement('input')
      starLabel.appendChild(starRadio)
      starLabel.appendChild(document.createTextNode('★'))

      starLabel.className = 'star'
      starLabel.addEventListener('click', () => {
        container.querySelectorAll('.star').forEach((s, index) => {
          s.classList.toggle('active', index < i)
        })
      })
      starRadio.type = 'radio'
      starRadio.name = name
      starRadio.value = `${i / starCount}`
    }

    this.contentElements = [container]
    
    // Config
    this.required = false
  }

  /**
   * @param {boolean} required
   */
  onRequiredChange(required) {
    this.bodyElement.querySelectorAll('input[type="radio"]').forEach((radio) => {
      required ? radio.setAttribute('required', 'true') : radio.removeAttribute('required')
    })
  }

  toJSON() {
    const data = super.toJSON()
    return { ...data, starCount: this.starCount }
  }
}

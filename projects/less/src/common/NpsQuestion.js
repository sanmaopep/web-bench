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

export class NpsQuestion extends Question {
  /** @type {HTMLElement} */
  container

  /**
   * @param {string} title
   * @param {string} name
   * @param {boolean} preview
   */
  constructor(title, name, preview) {
    super(title, name, preview)

    const container = document.createElement('div')
    this.container = container
    container.className = 'nps'

    this.setOptions()

    // Config
    this.required = false
  }

  setOptions() {
    const { container, name, preview } = this

    for (let i = 0; i <= 10; i++) {
      const option = document.createElement('label')
      container.appendChild(option)
      const score = document.createElement('input')
      option.append(score)
      option.append(document.createTextNode(`${i}`))

      option.className = 'option'
      if (preview) {
        option.addEventListener('click', () => {
          container.querySelectorAll('.option.active').forEach((s, index) => {
            s.classList.remove('active')
          })
          option.classList.add('active')
        })
      }

      score.type = 'radio'
      score.name = name
      score.value = `${i}`
    }

    this.contentEls = [container]
  }

  /**
   * @param {boolean} required
   */
  onRequiredChange(required) {
    this.bodyEl.querySelectorAll('input[type="radio"]').forEach((radio) => {
      required ? radio.setAttribute('required', 'true') : radio.removeAttribute('required')
    })
  }

  static fromJSON(json, preview = true) {
    const question = new NpsQuestion(json.title, json.name, preview)
    question.required = json.required

    return question
  }
}

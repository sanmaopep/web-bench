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
  /**
   * @param {string} title
   * @param {string} name
   * @param {boolean} preview
   * @param {number} starCount
   */
  constructor(title, name, preview, starCount = 5) {
    super(title, name, preview)

    if (starCount <= 0) starCount = 1

    // Config
    this.required = false
    this.starCount = starCount
  }

  /**
   * @param {number} starCount
   */
  setOptions(starCount) {
    const container = document.createElement('div')
    container.className = 'rating'

    for (let i = 1; i <= starCount; i++) {
      const optionEl = document.createElement('label')
      container.appendChild(optionEl)
      const radio = document.createElement('input')
      optionEl.appendChild(radio)
      optionEl.appendChild(document.createTextNode('★'))

      optionEl.className = 'option'
      if (this.preview) {
        optionEl.addEventListener('click', () => {
          container.querySelectorAll('.option').forEach((s, index) => {
            s.classList.toggle('active', index < i)
          })
        })
      }
      radio.disabled = !this.preview
      radio.type = 'radio'
      radio.name = this.name
      radio.value = `${i / starCount}`
    }

    this.contentEls = [container]
  }

  //////////////////////////////////////////////////////////////////////////////
  /** @returns {HTMLInputElement} */
  starCountConfigInput

  get starCount() {
    return parseInt(this.starCountConfigInput?.value ?? '0')
  }

  set starCount(starCount) {
    if (!this.starCountConfigInput) {
      this.starCountConfigInput = this.addConfigNumberInput({
        label: 'starCount',
        className: 'q-starCount',
        leftside: true,
        onChange: this.onStarCountChange.bind(this),
        min: 1,
      })
    }

    this.starCountConfigInput.value = starCount
    this.onStarCountChange?.(starCount)
  }

  /**
   * @param {number} starCount
   */
  onStarCountChange(starCount) {
    this.setOptions(starCount)
  }

  //////////////////////////////////////////////////////////////////////////////
  /**
   * @param {boolean} required
   */
  onRequiredChange(required) {
    this.bodyEl.querySelectorAll('input[type="radio"]').forEach((radio) => {
      required ? radio.setAttribute('required', 'true') : radio.removeAttribute('required')
    })
  }

  //////////////////////////////////////////////////////////////////////////////
  toJSON() {
    const data = super.toJSON()
    return { ...data, starCount: this.starCount }
  }

  static fromJSON(json, preview = true) {
    const question = new RatingQuestion(json.title, json.name, preview, json.starCount)
    question.required = json.required

    return question
  }
}

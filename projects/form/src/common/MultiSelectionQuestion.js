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
import { shuffle } from './util/util.js'

export class MultiSelectionQuestion extends Question {
  options

  /**
   * @param {string} title
   * @param {string} name
   * @param {string[]} options
   */
  constructor(title, name, options) {
    super(title, name)
    this.options = options

    this.contentElements = options.map((option, index) => {
      const label = document.createElement('label')
      const radio = document.createElement('input')
      radio.type = 'checkbox'
      radio.name = name
      radio.value = `${index}`

      label.appendChild(radio)
      label.appendChild(document.createTextNode(option))
      label.appendChild(document.createElement('br'))

      return label
    })

    document.querySelector('form')?.addEventListener('submit', (e) => {
      const count = this.bodyElement.querySelectorAll('input[type="checkbox"]:checked').length
      if (count < this.checkedCount) {
        e.stopPropagation()
        e.preventDefault()
        alert(`${MultiSelectionQuestion.name}, at least 1 option should be checked.`)
      }
    })
    
    // Config
    this.required = false
    this.isShuffleMode = false
  }

  checkedCount = 0

  /**
   * @param {boolean} required
   */
  onRequiredChange(required) {
    this.checkedCount = required ? 1 : 0
  }

  /**
   * @param {boolean} shuffleMode
   */
  onShuffleChange(shuffleMode) {
    const options = [...this.bodyElement.querySelectorAll('label')]
    if (shuffleMode) {
      shuffle(options).forEach((option) => this.bodyElement.appendChild(option))
    } else {
      options
        .sort(
          (a, b) =>
            a
              .querySelector('input[type="checkbox"]')
              // @ts-ignore
              ?.value.localeCompare(b.querySelector('input[type="checkbox"]')?.value ?? '') ?? 0
        )
        .forEach((option) => this.bodyElement.appendChild(option))
    }
  }

  toJSON() {
    const data = super.toJSON()
    return { ...data, options: this.options }
  }
}

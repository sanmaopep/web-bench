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

export class SingleSelectionQuestion extends Question {
  /**
   * @param {string} title
   * @param {string} name
   * @param {boolean} preview
   * @param {string[]} options
   */
  constructor(title, name, preview, options) {
    super(title, name, preview)
    this.setOptions(options)

    // Config
    this.required = false
    this.isShuffleMode = false
    this.addOptionButton = this.addConfigButton({
      label: '+ Option',
      className: 'add-option',
      leftside: true,
      onClick: () => {
        this.setOptions([...this.options, 'New Option'])
      },
    })
  }

  /** @type {string[]} */
  get options() {
    const optionEls = [...this.bodyEl.querySelectorAll('.option')]
    if (this.isShuffleMode) {
      optionEls.sort((a, b) => {
        // @ts-ignore
        const aValue = a.querySelector('input[type="radio"]')?.value ?? ''
        // @ts-ignore
        const bValue = b.querySelector('input[type="radio"]')?.value ?? ''
        return aValue.localeCompare(bValue)
      })
    }

    return optionEls.map((el) => el.querySelector('label')?.innerText ?? '')
  }

  /**
   * @param {string[]} options
   */
  setOptions(options) {
    const required = this.required
    this.contentEls = options.map((option, index) => {
      const optionEl = document.createElement('div')
      const radio = document.createElement('input')
      const label = document.createElement('label')
      optionEl.append(radio)
      optionEl.append(label)

      optionEl.className = 'option'
      radio.type = 'radio'
      radio.name = this.name
      radio.id = `${this.name}-${index}`
      radio.value = `${index}`
      radio.disabled = !this.preview
      radio.required = required
      label.className = 'option-text'
      label.htmlFor = radio.id
      label.innerHTML = `${option}`

      if (!this.preview) {
        this.setEditable(label)

        const remove = document.createElement('button')
        optionEl.append(remove)
        remove.className = 'remove-option'
        remove.innerHTML = '-'
        remove.addEventListener('click', () => {
          const opts = this.options
          opts.splice(index, 1)
          this.setOptions(opts)
        })
      }

      return optionEl
    })
  }

  /**
   * @param {boolean} required
   */
  onRequiredChange(required) {
    this.bodyEl.querySelectorAll('input[type="radio"]').forEach((radio) => {
      required ? radio.setAttribute('required', 'true') : radio.removeAttribute('required')
    })
  }

  /**
   * @param {boolean} shuffleMode
   */
  onShuffleChange(shuffleMode) {
    const container = this.bodyEl
    const optionEls = [...this.bodyEl.querySelectorAll('.option')]

    if (shuffleMode) {
      shuffle(optionEls).forEach((option) => container.appendChild(option))
    } else {
      optionEls
        .sort((a, b) => {
          // @ts-ignore
          const aValue = a.querySelector('input[type="radio"]')?.value ?? ''
          // @ts-ignore
          const bValue = b.querySelector('input[type="radio"]')?.value ?? ''
          return aValue.localeCompare(bValue)
        })
        .forEach((option) => container.appendChild(option))
    }
  }

  toJSON() {
    const data = super.toJSON()
    return { ...data, options: this.options }
  }

  static fromJSON(json, preview = true) {
    const question = new SingleSelectionQuestion(json.title, json.name, preview, json.options)
    question.required = json.required
    question.isShuffleMode = json.isShuffleMode

    return question
  }
}

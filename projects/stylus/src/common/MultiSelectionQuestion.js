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
  /**
   * @param {string} title
   * @param {string} name
   * @param {boolean} preview
   * @param {string[]} options
   */
  constructor(title, name, preview, options) {
    super(title, name, preview)
    
    this.setOptions(options)

    document.querySelector('form')?.addEventListener('submit', (e) => {
      const count = this.bodyEl.querySelectorAll('input[type="checkbox"]:checked').length
      if (count < this.checkedCount) {
        e.stopPropagation()
        e.preventDefault()
        alert(`${MultiSelectionQuestion.name}, at least 1 option should be checked.`)
      }
    })

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
    const optionElements = [...this.bodyEl.querySelectorAll('.option')]
    if (this.isShuffleMode) {
      optionElements.sort((a, b) => {
        // @ts-ignore
        const aValue = a.querySelector('input[type="checkbox"]')?.value ?? ''
        // @ts-ignore
        const bValue = b.querySelector('input[type="checkbox"]')?.value ?? ''
        return aValue.localeCompare(bValue)
      })
    }

    return optionElements.map((el) => el.querySelector('label')?.innerText ?? '')
  }

  /**
   * @param {string[]} options
   */
  setOptions(options) {
    const required = this.required
    this.contentEls = options.map((option, index) => {
      const optionElement = document.createElement('div')
      const radio = document.createElement('input')
      const label = document.createElement('label')
      optionElement.append(radio)
      optionElement.append(label)

      optionElement.className = 'option'
      radio.type = 'checkbox'
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
        optionElement.append(remove)
        remove.className = 'remove-option'
        remove.innerHTML = '-'
        remove.addEventListener('click', () => {
          const opts = this.options
          opts.splice(index, 1)
          console.log(opts)

          this.setOptions(opts)
        })
      }

      return optionElement
    })
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
    const options = [...this.bodyEl.querySelectorAll('.option')]
    if (shuffleMode) {
      shuffle(options).forEach((option) => this.bodyEl.appendChild(option))
    } else {
      options
        .sort(
          (a, b) =>
            a
              .querySelector('input[type="checkbox"]')
              // @ts-ignore
              ?.value.localeCompare(b.querySelector('input[type="checkbox"]')?.value ?? '') ?? 0
        )
        .forEach((option) => this.bodyEl.appendChild(option))
    }
  }

  toJSON() {
    const data = super.toJSON()
    return { ...data, options: this.options }
  }

  static fromJSON(json, preview = true) {
    const question = new MultiSelectionQuestion(json.title, json.name, preview, json.options)
    question.required = json.required
    question.isShuffleMode = json.isShuffleMode

    return question
  }
}

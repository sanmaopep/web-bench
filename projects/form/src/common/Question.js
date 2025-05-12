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

export class Question {
  title = ''
  name = ''
  /** @type {HTMLElement} */
  root
  /** @returns {HTMLElement} */
  bodyElement
  /** @returns {HTMLElement} */
  configElement

  /**
   * @param {string} title
   * @param {string} name
   */
  constructor(title, name) {
    this.title = title
    this.name = name

    const root = document.createElement('fieldset')
    const titleElement = document.createElement('legend')
    const bodyElement = document.createElement('div')
    const configElement = document.createElement('div')
    root.appendChild(titleElement)
    root.appendChild(bodyElement)
    root.appendChild(configElement)

    this.root = root
    this.bodyElement = bodyElement
    this.configElement = configElement

    root.id = this.name
    root.className = 'q'
    titleElement.className = 'q-title'
    titleElement.innerHTML = this.title
    bodyElement.className = 'q-body'
    configElement.className = 'q-config'
  }

  /** @param {HTMLElement[]} contentElements */
  set contentElements(contentElements) {
    const bodyElement = this.bodyElement
    ;[...bodyElement.children].forEach((child) => child.remove())
    contentElements.forEach((el) => bodyElement.appendChild(el))
  }

  /**
   * @param {object} options
   * @param {string} options.label
   * @param {string} options.className
   * @param {(checked: boolean) => void} options.onChange
   * @returns {HTMLInputElement}
   */
  addConfigCheckbox(options) {
    const labelElement = document.createElement('label')
    const checkbox = document.createElement('input')
    this.configElement.appendChild(labelElement)

    labelElement.appendChild(checkbox)
    labelElement.appendChild(document.createTextNode(options.label))

    checkbox.classList.add(options.className)
    checkbox.type = 'checkbox'
    checkbox.addEventListener('change', () => options.onChange(checkbox.checked))

    return checkbox
  }

  //////////////////////////////////////////////////////////////////////////////

  /** @returns {HTMLInputElement} */
  requiredConfigCheckbox

  /** @returns {boolean} */
  get required() {
    return !!this.requiredConfigCheckbox?.checked
  }

  /**
   * @param {boolean} required
   */
  set required(required) {
    if (!this.requiredConfigCheckbox) {
      this.requiredConfigCheckbox = this.addConfigCheckbox({
        label: 'Required',
        className: 'q-required',
        onChange: this.onRequiredChange.bind(this),
      })
    }

    this.requiredConfigCheckbox.checked = required
    this.onRequiredChange?.(required)
  }

  /**
   * @param {boolean} required
   */
  onRequiredChange(required) {
    throw new Error('Not Implemented!')
  }

  //////////////////////////////////////////////////////////////////////////////

  /** @returns {HTMLInputElement} */
  shuffleConfigCheckbox

  /** @returns {boolean} */
  get isShuffleMode() {
    return !!this.shuffleConfigCheckbox?.checked
  }

  /**
   * @param {boolean} shuffled
   */
  set isShuffleMode(shuffled) {
    if (!this.shuffleConfigCheckbox) {
      this.shuffleConfigCheckbox = this.addConfigCheckbox({
        label: 'Shuffle',
        className: 'q-shuffle',
        onChange: (checked) => (this.isShuffleMode = checked),
      })
    }

    this.shuffleConfigCheckbox.checked = shuffled
    this.onShuffleChange(shuffled)
  }

  /**
   * @param {boolean} shuffled
   */
  onShuffleChange(shuffled) {
    throw new Error('Not Implemented!')
  }

  //////////////////////////////////////////////////////////////////////////////
  toJSON() {
    return {
      title: this.title,
      name: this.name,
      required: this.required,
      isShuffleMode: this.isShuffleMode,
    }
  }
}

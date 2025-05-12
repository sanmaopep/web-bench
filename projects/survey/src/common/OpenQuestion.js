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

export class OpenQuestion extends Question {
  /** @type {HTMLTextAreaElement} */
  inputControl

  /**
   * @param {string} title
   * @param {string} name
   * @param {boolean} preview
   */
  constructor(title, name, preview) {
    super(title, name, preview)

    const inputControl = document.createElement('textarea')
    this.inputControl = inputControl
    inputControl.minLength = 0
    inputControl.name = name
    inputControl.placeholder = 'Enter your answer here...'
    if (!this.preview) inputControl.disabled = true
    this.contentEls = [inputControl]

    // Config
    this.required = false
    this.isMultilines = false
    this.minLength = 0
  }

  //////////////////////////////////////////////////////////////////////////////
  /** @type {HTMLInputElement} */
  minLengthConfigNumber

  get minLength() {
    return parseInt(this.minLengthConfigNumber.value ?? '0')
  }

  /**
   * @param {number} minLength
   */
  set minLength(minLength) {
    if (!this.minLengthConfigNumber) {
      this.minLengthConfigNumber = this.addConfigNumberInput({
        label: 'minLength',
        className: 'q-minLength',
        onChange: this.onMinLengthChange.bind(this),
      })
    }

    this.minLengthConfigNumber.value = `${minLength}`
    this.onMinLengthChange(minLength)
  }

  /**
   * @param {number} minLength
   */
  onMinLengthChange(minLength) {
    this.inputControl.minLength = minLength
  }

  //////////////////////////////////////////////////////////////////////////////

  /**
   * @param {boolean} required
   */
  onRequiredChange(required) {
    required
      ? this.inputControl.setAttribute('required', 'true')
      : this.inputControl.removeAttribute('required')
  }

  //////////////////////////////////////////////////////////////////////////////

  /** @type {HTMLInputElement} */
  multilinesConfigCheckbox

  /** @returns {boolean} */
  get isMultilines() {
    return !!this.multilinesConfigCheckbox?.checked
  }

  /**
   * @param {boolean} isMultilines
   */
  set isMultilines(isMultilines) {
    if (!this.multilinesConfigCheckbox) {
      this.multilinesConfigCheckbox = this.addConfigCheckbox({
        label: 'Multilines',
        className: 'q-multilines',
        leftside: true,
        onChange: this.onMultilinesChange.bind(this),
      })
    }

    this.multilinesConfigCheckbox.checked = isMultilines
    this.onMultilinesChange?.(isMultilines)
  }

  /**
   * @param {boolean} isMultilines
   */
  onMultilinesChange(isMultilines) {
    const { inputControl } = this

    if (!isMultilines) {
      inputControl.rows = 1
      inputControl.addEventListener('keydown', OpenQuestion.preventEnterKey)
    } else {
      inputControl.rows = 4
      inputControl.cols = 50
      inputControl.removeEventListener('keydown', OpenQuestion.preventEnterKey)
    }
  }

  /**
   * @param {KeyboardEvent} e
   */
  static preventEnterKey(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }

  //////////////////////////////////////////////////////////////////////////////

  toJSON() {
    const data = super.toJSON()
    return { ...data, isMultilines: this.isMultilines, minLength: this.minLength }
  }

  static fromJSON(json, preview = true) {
    const question = new OpenQuestion(json.title, json.name, preview)
    question.isMultilines = json.isMultilines
    question.required = json.required
    question.minLength = json.minLength

    return question
  }
}

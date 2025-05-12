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
  /** @type {HTMLInputElement | HTMLTextAreaElement} */
  inputControl
  isMultilines

  /**
   * @param {string} title
   * @param {string} name
   * @param {boolean} isMultilines
   */
  constructor(title, name, isMultilines) {
    super(title, name)
    this.isMultilines = isMultilines

    let inputControl
    if (!isMultilines) {
      inputControl = document.createElement('input')
      inputControl.type = 'text'
    } else {
      inputControl = document.createElement('textarea')
      inputControl.rows = 4
      inputControl.cols = 50
    }
    inputControl.minLength = 0
    this.inputControl = inputControl

    inputControl.name = name
    inputControl.placeholder = 'Enter your answer here...'
    this.contentElements = [inputControl]

    // Config
    this.required = false
  }

  get minLength() {
    return this.inputControl.minLength
  }

  /**
   * @param {number} length
   */
  set minLength(length) {
    this.inputControl.minLength = length
  }

  /**
   * @param {boolean} required
   */
  onRequiredChange(required) {
    required
      ? this.inputControl.setAttribute('required', 'true')
      : this.inputControl.removeAttribute('required')
  }

  toJSON() {
    const data = super.toJSON()
    return { ...data, isMultilines: this.isMultilines, minLength: this.minLength }
  }
}

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

export class LikertQuestion extends Question {
  options
  statements
  /**
   * @param {string} title
   * @param {string} name
   * @param {string[]} options
   * @param {string[]} statements
   */
  constructor(title, name, options, statements) {
    super(title, name)
    this.options = options
    this.statements = statements

    const table = document.createElement('table')
    table.className = 'likert-container'

    const hidden = document.createElement('input')
    hidden.type = 'hidden'
    hidden.name = name

    this.contentElements = [hidden, table]

    // table structure
    for (let i = 0; i <= statements.length; i++) {
      const row = table.insertRow()
      for (let j = 0; j <= options.length; j++) {
        const cell = row.insertCell()
        if (i === 0) {
          if (j > 0) cell.innerHTML = options[j - 1]
        } else {
          if (j === 0) cell.innerHTML = statements[i - 1]
          else cell.innerHTML = `<input type="radio" name="${name}_${i - 1}" value="${j - 1}" />`
        }
      }
    }

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
    return { ...data, options: this.options, statements: this.statements }
  }
}

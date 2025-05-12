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
  /** @type {HTMLTableElement} */
  table

  /**
   * @param {string} title
   * @param {string} name
   * @param {boolean} preview
   * @param {string[]} options
   * @param {string[]} statements
   */
  constructor(title, name, preview, options, statements) {
    super(title, name, preview)

    const table = document.createElement('table')
    this.table = table
    table.className = 'likert'
    const hidden = document.createElement('input')
    hidden.type = 'hidden'
    hidden.name = name
    this.contentEls = [hidden, table]

    this.setLikertTable(statements, options)

    // Config
    this.required = false
    this.addOptionButton = this.addConfigButton({
      label: '+ Statement',
      className: 'add-statement',
      leftside: true,
      onClick: () => {
        this.setLikertTable([...this.statements, 'New Statement'], this.options)
      },
    })
  }

  /** @returns {string[]} */
  get statements() {
    const optionEls = [...this.bodyEl.querySelectorAll('.statement-text')]
    return optionEls.map((el) => el.textContent ?? '')
  }

  /** @returns {string[]} */
  get options() {
    const optionEls = [...this.bodyEl.querySelectorAll('.option-text')]
    return optionEls.map((el) => el.textContent ?? '')
  }

  /**
   * @param {string[]} statements
   * @param {string[]} options
   */
  setLikertTable(statements, options) {
    const { name, table, preview } = this

    table.innerHTML = ''
    for (let i = 0; i <= statements.length; i++) {
      const row = table.insertRow()
      for (let j = 0; j <= options.length; j++) {
        const cell = row.insertCell()
        if (i === 0) {
          if (j > 0) {
            cell.className = 'option'
            const text = document.createElement('span')
            cell.append(text)
            text.className = 'option-text'
            text.innerHTML = options[j - 1]
            if (!preview) {
              this.setEditable(cell)

              const remove = document.createElement('button')
              cell.append(remove)
              remove.className = 'remove-option'
              remove.innerHTML = '-'
              remove.addEventListener('click', () => {
                options.splice(j - 1, 1)
                this.setLikertTable(statements, options)
              })

              const add = document.createElement('button')
              cell.append(add)
              add.className = 'add-option'
              add.innerHTML = '+'
              add.addEventListener('click', () => {
                options.splice(j, 0, 'New Option')
                this.setLikertTable(statements, options)
              })
            }
          }
        } else {
          row.className = 'statement'
          if (j === 0) {
            const text = document.createElement('span')
            text.className = 'statement-text'
            text.innerHTML = statements[i - 1]
            cell.append(text)
            if (!preview) {
              this.setEditable(text)

              const remove = document.createElement('button')
              cell.append(remove)
              remove.className = 'remove-statement'
              remove.innerHTML = '-'
              remove.addEventListener('click', () => {
                statements.splice(i - 1, 1)
                this.setLikertTable(statements, options)
              })
            }
          } else
            cell.innerHTML = `<input type="radio" name="${name}_${i - 1}" value="${j - 1}" ${
              preview ? '' : 'disabled'
            } />`
        }
      }
    }
  }

  /**
   * @param {boolean} required
   */
  onRequiredChange(required) {
    this.bodyEl.querySelectorAll('input[type="radio"]').forEach((radio) => {
      required ? radio.setAttribute('required', 'true') : radio.removeAttribute('required')
    })
  }

  toJSON() {
    const data = super.toJSON()
    return { ...data, options: this.options, statements: this.statements }
  }

  static fromJSON(json, preview = true) {
    const question = new LikertQuestion(
      json.title,
      json.name,
      preview,
      json.options,
      json.statements
    )
    question.required = json.required

    return question
  }
}

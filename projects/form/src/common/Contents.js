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

import { getOffset } from './util/util.js'
import { Draggable } from './util/Draggable.js'
import { Survey } from './Survey.js'

export class Contents {
  /** @type {HTMLElement} */
  root
  /** @type {Survey} */
  survey

  /**
   * @param {Survey} survey
   */
  constructor(survey) {
    this.survey = survey

    const contents = document.createElement('ul')
    contents.className = 'contents'

    this.root = contents
    document.body.appendChild(contents)
  }

  update() {
    ;[...this.root.children].forEach((child) => child.remove())

    this.survey.form.querySelectorAll('.q').forEach((question, i) => {
      const item = document.createElement('li')
      item.className = 'contents-item'
      item.id = `${item.className}_${i}`
      item.innerHTML = `${question.querySelector('.q-title')?.innerHTML ?? ''}`
      item.setAttribute('q-id', question.id)
      item.addEventListener('click', () => {
        const qeustionOffset = getOffset(question)
        // console.log({ qeustionOffset, question, item })
        document.documentElement.scrollTo(0, qeustionOffset.top)
      })
      this.root.appendChild(item)

      new Draggable(item, {
        container: this.root,
        onDrop: (side, sourceItem, targetItem) => {
          // console.log({ sourceItem, targetItem })
          const sourceQuestion = document.getElementById(sourceItem.getAttribute('q-id') ?? '')
          const targetQuestion = document.getElementById(targetItem.getAttribute('q-id') ?? '')
          if (side === 'bottom') {
            if (sourceQuestion) targetQuestion?.after(sourceQuestion)
          } else if (side === 'top') {
            if (sourceQuestion) targetQuestion?.before(sourceQuestion)
          }
          this.survey.update()
        },
      })
    })
  }
}

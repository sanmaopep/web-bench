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

import { Contents } from './Contents.js'
import { Question } from './Question.js'

export class Survey {
  /** @type {HTMLFormElement} */
  form
  /** @type {HTMLElement} */
  questionsContainer
  /** @type {HTMLElement} */
  titleElement

  /** @type {Contents} */
  contents

  /** @type {Question[]} */
  questions = []

  /**
   * @param {string} formSelector
   * @param {string} title
   */
  constructor(formSelector, title) {
    const form = document.querySelector(formSelector)
    if (!form) throw new Error(`'${formSelector}' is empty`)
    if (!(form instanceof HTMLFormElement)) throw new Error(`'${formSelector}' is not Form`)

    this.form = form
    form.classList.add('survey')

    const titleElement = document.createElement('div')
    this.titleElement = titleElement
    form.prepend(titleElement)
    titleElement.innerHTML = title
    titleElement.className = 'survey-title'

    const questionsContainer = document.createElement('div')
    this.questionsContainer = questionsContainer
    form.appendChild(questionsContainer)
    questionsContainer.className = 'survey-questions'

    this.contents = new Contents(this)
  }

  get title() {
    return this.titleElement.innerHTML
  }

  /**
   * @param {Question} question
   */
  prependQuestion(question) {
    this.prependQuestions([question])
  }

  /**
   * @param {Question[]} questions
   */
  prependQuestions(questions) {
    this.questions.unshift(...questions)
    questions.forEach((question) => {
      this.questionsContainer.prepend(question.root)
    })

    this.update()
  }

  /**
   * @param {Question} question
   */
  appendQuestion(question) {
    this.appendQuestions([question])
  }

  /**
   * @param {Question[]} questions
   */
  appendQuestions(questions) {
    this.questions.push(...questions)
    questions.forEach((question) => {
      this.questionsContainer.append(question.root)
    })

    this.update()
  }

  update() {
    this.form.querySelectorAll('.q').forEach((question, i) => {
      const qTitleElement = question.querySelector('.q-title')
      if (qTitleElement) {
        const title = qTitleElement.innerHTML.trim()
        if (/^\d+\./.test(title)) {
          qTitleElement.innerHTML = title.replace(/^\d+\./, `${i + 1}.`)
        } else {
          qTitleElement.innerHTML = `${i + 1}. ${title}`
        }
      }
    })

    this.contents.update()
  }

  toJSON() {
    return {
      title: this.title,
      questions: this.questions.map((q) => q.toJSON()),
    }
  }
}

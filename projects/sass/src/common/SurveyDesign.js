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
import { SingleSelectionQuestion } from './SingleSelectionQuestion.js'
import { DataQuestion } from './DataQuestion.js'
import { LikertQuestion } from './LikertQuestion.js'
import { MultiSelectionQuestion } from './MultiSelectionQuestion.js'
import { NpsQuestion } from './NpsQuestion.js'
import { OpenQuestion } from './OpenQuestion.js'
import { RankingQuestion } from './RankingQuestion.js'
import { RatingQuestion } from './RatingQuestion.js'
import { SurveyForm } from './SurveyForm.js'
import { getOffset } from './util/util.js'

export class SurveyDesign extends SurveyForm {
  /** @type {HTMLElement} */
  adderEl
  /** @type {HTMLElement} */
  popupAdderEl
  /** @type {Question | null} */
  appendedQuestion

  /**
   * @param {string} formSelector
   * @param {{title:string, questions: any[]}} data
   */
  constructor(formSelector, data) {
    super(formSelector, data)

    const { toolbarEl } = this

    this.render()

    toolbarEl.innerHTML = `
    <button type="button" class="save">Save</button>
    <button type="button" class="preview">Preview</button>
    `
    toolbarEl.querySelector('.save')?.addEventListener('click', this.onSave.bind(this))
    toolbarEl.querySelector('.preview')?.addEventListener('click', this.onPreview.bind(this))

    this.adderEl = this.getAdderPanel()
    this.form.insertBefore(this.adderEl, this.questionsEl)

    this.delegateAdderEvents()
  }

  getAdderPanel() {
    const adderEl = document.createElement('div')
    adderEl.className = 'adder'
    adderEl.innerHTML = `
    <button type="button" class="add-question">Question</button>
    <button type="button" class="add-single">Single Selection</button>
    <button type="button" class="add-multi">Multi Selection</button>
    <button type="button" class="add-open">Open-Ended</button>
    <button type="button" class="add-rating">Rating</button>
    <button type="button" class="add-ranking">Ranking</button>
    <button type="button" class="add-nps">NPS</button>
    <button type="button" class="add-likert">Likert</button>
    <button type="button" class="add-data">Data</button>
    `
    return adderEl
  }

  /**
   * @param {Question} question
   * @param {number} x
   * @param {number} y
   */
  onQuestionAppend(question, x, y) {
    this.appendedQuestion = question

    const { adderEl } = this
    /** @type {HTMLElement} */
    // @ts-ignore
    const popupAdderEl = adderEl.cloneNode(true)
    this.popupAdderEl = popupAdderEl
    this.form.append(popupAdderEl)

    popupAdderEl.classList.add('popup')
    const width = getOffset(popupAdderEl).width
    popupAdderEl.style.left = `${x - width / 2}px`
    popupAdderEl.style.top = `${y + 20}px`
  }

  delegateAdderEvents() {
    document.addEventListener('click', (e) => {
      console.log('adderEl click', e.target, this.appendedQuestion)
      if (this.popupAdderEl) this.popupAdderEl.remove()
    })

    this.form.addEventListener('click', (e) => {
      /** @type {DOMTokenList} */
      // @ts-ignore
      const classList = e.target.classList
      console.log('form click', classList, this.appendedQuestion, e.target)

      if (classList.contains('add-question')) {
        const id = this.questionId
        const q = new Question(`Empty Question ${id}`, `question${id}`, false)
        this.appendedQuestion
          ? this.insertQuestionAfter(this.appendedQuestion, q)
          : this.prependQuestion(q)
      } else if (classList.contains('add-single')) {
        const id = this.questionId
        const options = ['Option 1', 'Option 2', 'Option 3']
        const q = new SingleSelectionQuestion(
          `Single Selection ${id}`,
          `single${id}`,
          false,
          options
        )
        this.appendedQuestion
          ? this.insertQuestionAfter(this.appendedQuestion, q)
          : this.prependQuestion(q)
      } else if (classList.contains('add-multi')) {
        const id = this.questionId
        const options = ['Option 1', 'Option 2', 'Option 3']
        const q = new MultiSelectionQuestion(`Multi Selection ${id}`, `multi${id}`, false, options)
        this.appendedQuestion
          ? this.insertQuestionAfter(this.appendedQuestion, q)
          : this.prependQuestion(q)
      } else if (classList.contains('add-open')) {
        const id = this.questionId
        const q = new OpenQuestion(`Open Selection ${id}`, `open${id}`, false)
        this.appendedQuestion
          ? this.insertQuestionAfter(this.appendedQuestion, q)
          : this.prependQuestion(q)
      } else if (classList.contains('add-rating')) {
        const id = this.questionId
        const q = new RatingQuestion(`Rating Selection ${id}`, `rating${id}`, false)
        this.appendedQuestion
          ? this.insertQuestionAfter(this.appendedQuestion, q)
          : this.prependQuestion(q)
      } else if (classList.contains('add-ranking')) {
        const id = this.questionId
        const options = ['Option 1', 'Option 2', 'Option 3']
        const q = new RankingQuestion(`Ranking Selection ${id}`, `ranking${id}`, false, options)
        this.appendedQuestion
          ? this.insertQuestionAfter(this.appendedQuestion, q)
          : this.prependQuestion(q)
      } else if (classList.contains('add-nps')) {
        const id = this.questionId
        const q = new NpsQuestion(`NPS Selection ${id}`, `nps${id}`, false)
        this.appendedQuestion
          ? this.insertQuestionAfter(this.appendedQuestion, q)
          : this.prependQuestion(q)
      } else if (classList.contains('add-likert')) {
        const id = this.questionId
        const q = new LikertQuestion(
          `Likert Selection ${id}`,
          `likert${id}`,
          false,
          ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'],
          ['Statement 1', 'Statement 2', 'Statement 3']
        )
        this.appendedQuestion
          ? this.insertQuestionAfter(this.appendedQuestion, q)
          : this.prependQuestion(q)
      } else if (classList.contains('add-data')) {
        const id = this.questionId
        const type = ['url', 'tel', 'email', 'date', 'number'][Math.floor(Math.random() * 5)]
        // @ts-ignore
        const q = new DataQuestion(`Data ${type} ${id}`, `data-${type}-${id}`, false, type)
        this.appendedQuestion
          ? this.insertQuestionAfter(this.appendedQuestion, q)
          : this.prependQuestion(q)
      }

      this.appendedQuestion = null
    })
  }

  render() {
    const data = this.data
    console.log(data)

    this.titleEl.innerHTML = data.title
    data.questions.forEach((json) => {
      const cls = this.questionClassCache[json.className]
      if (cls) {
        this.appendQuestion(cls.fromJSON(json, false))
      }
    })
  }

  onPreview() {
    const dataKey = this.onSave()
    window.open(`./preview.html?key=${dataKey}`, 'preview')
  }

  _questionId = parseInt(localStorage.__qid ?? '0')
  get questionId() {
    localStorage.__qid = ++this._questionId
    return this._questionId
  }

  onSave() {
    const data = this.toJSON()

    const uid = SurveyDesign.getUid()
    // const dataKey = `data_${uid}`
    // FIXME?
    const dataKey = 'data'
    console.log({ dataKey, data })
    localStorage[dataKey] = JSON.stringify(data)

    return dataKey
  }

  static getUid() {
    const uid = parseInt(localStorage.__uid ?? '0')
    localStorage.__uid = `${uid >= 99 ? 0 : uid + 1}`
    return uid
  }

  toJSON() {
    return {
      title: this.title,
      questions: this.questions.map((q) => {
        return this.questionObjectCache[q.id]?.toJSON()
      }),
    }
  }
}

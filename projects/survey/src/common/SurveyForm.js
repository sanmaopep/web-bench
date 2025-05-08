import { Contents } from './Contents.js'
import { Question } from './Question.js'
import { SingleSelectionQuestion } from './SingleSelectionQuestion.js'
import { DataQuestion } from './DataQuestion.js'
import { LikertQuestion } from './LikertQuestion.js'
import { MultiSelectionQuestion } from './MultiSelectionQuestion.js'
import { NpsQuestion } from './NpsQuestion.js'
import { OpenQuestion } from './OpenQuestion.js'
import { RankingQuestion } from './RankingQuestion.js'
import { RatingQuestion } from './RatingQuestion.js'

export class SurveyForm {
  /** @type {{[k:string]:any}} */
  questionClassCache = {}
  /** @type {HTMLFormElement} */
  form
  /** @type {HTMLElement} */
  titleEl
  /** @type {HTMLElement} */
  toolbarEl
  /** @type {HTMLElement} */
  questionsEl
  /** @type {Contents} */
  contents
  /** @type {{[name:string]:Question}} */
  questionObjectCache = {}

  /**
   * @param {string} formSelector
   * @param {{title:string, questions: any[]}} data
   */
  constructor(formSelector, data) {
    this.data = data
    this.questionClassCache[Question.name] = Question
    this.questionClassCache[SingleSelectionQuestion.name] = SingleSelectionQuestion
    this.questionClassCache[MultiSelectionQuestion.name] = MultiSelectionQuestion
    this.questionClassCache[OpenQuestion.name] = OpenQuestion
    this.questionClassCache[LikertQuestion.name] = LikertQuestion
    this.questionClassCache[NpsQuestion.name] = NpsQuestion
    this.questionClassCache[RankingQuestion.name] = RankingQuestion
    this.questionClassCache[RatingQuestion.name] = RatingQuestion
    this.questionClassCache[DataQuestion.name] = DataQuestion

    const form = document.querySelector(formSelector)
    if (!form) throw new Error(`'${formSelector}' is empty`)
    if (!(form instanceof HTMLFormElement)) {
      throw new Error(`'${formSelector}' is not Form`)
    }
    this.form = form
    form.classList.add('survey')

    this.form.innerHTML = `
    <div class="survey-top">
      <div class="survey-title"></div>
      <div class="survey-toolbar"></div>
    </div>
    <div class="survey-questions"></div>
    `
    const titleEl = this.form.querySelector('.survey-title')
    // @ts-ignore
    this.titleEl = titleEl
    const toolbarEl = this.form.querySelector('.survey-toolbar')
    // @ts-ignore
    this.toolbarEl = toolbarEl
    const questionsEl = this.form.querySelector('.survey-questions')
    // @ts-ignore
    this.questionsEl = questionsEl

    this.contents = new Contents(this)
  }

  get title() {
    return this.titleEl.innerHTML
  }

  get questions() {
    return [...this.form.querySelectorAll('.q')]
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
    this.insertQuestions(questions, false)
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
    this.insertQuestions(questions, true)
  }

  /**
   * @param {Question[]} questions
   * @param {boolean} isAppend
   */
  insertQuestions(questions, isAppend) {
    questions.forEach((question) => {
      this.prepareQuestion(question)
      isAppend ? this.questionsEl.append(question.root) : this.questionsEl.prepend(question.root)
    })

    this.update()
  }

  /**
   * @param {Question} question
   */
  prepareQuestion(question){
    question.onRemove = this.onQuestionRemove.bind(this)
    question.onTitleChange = this.onQuestionTitleChange.bind(this)
    question.onAppend = this.onQuestionAppend.bind(this)
    this.questionObjectCache[question.root.id] = question
  }

  /**
   * @param {Question} sourceQuestion
   * @param {Question} targetQuestion
   */
  insertQuestionAfter(sourceQuestion, targetQuestion) {
    this.prepareQuestion(targetQuestion)
    sourceQuestion.root.after(targetQuestion.root)
    this.update()
  }

  /**
   * @param {Question} question
   */
  onQuestionRemove(question) {
    delete this.questionObjectCache[question.name]
    this.update()
  }

  /**
   * @param {Question} question
   */
  onQuestionTitleChange(question) {
    // console.log('hit', this)
    this.update()
  }

  /**
   * @param {Question} question
   * @param {number} x
   * @param {number} y
   */
  onQuestionAppend(question, x, y) {}

  update() {
    this.contents.update()
  }
}
